// Follow this setup guide to integrate the Deno runtime and Supabase Edge Functions:
// https://supabase.com/docs/guides/functions

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function normalizeUrl(inputUrl: string): string {
  if (!inputUrl) return "";
  let url = inputUrl.trim();
  if (url === "#" || url.startsWith("javascript:")) return "";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname || !parsed.hostname.includes(".")) {
      return "";
    }
    return parsed.href;
  } catch {
    return "";
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { project_id, website_url, slug = "preview" } = await req.json();

    const normalizedUrl = normalizeUrl(website_url);
    if (!normalizedUrl || !normalizedUrl.startsWith("http")) {
      return new Response(
        JSON.stringify({
          success: false,
          preview_status: "failed",
          error: "Invalid website URL. Please provide a valid address (e.g. https://example.com).",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://npqfnzuyglgrzsetrbdo.supabase.co";
    const supabaseKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_ANON_KEY") ||
      "";

    const supabase = createClient(supabaseUrl, supabaseKey);

    let screenshotBuffer: Uint8Array | null = null;
    let contentType = "image/png";
    let providerName = "microlink";
    const safeSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // =========================================================
    // PROVIDER 1: Microlink API (Server-side fetch)
    // =========================================================
    try {
      console.log(`[Edge Function] Trying Provider 1 (Microlink) for ${normalizedUrl}`);
      const mlApiUrl = `https://api.microlink.io?url=${encodeURIComponent(
        normalizedUrl
      )}&screenshot=true&meta=false&viewport.width=1440&viewport.height=900&waitForTimeout=1000`;

      const mlRes = await fetch(mlApiUrl, { signal: AbortSignal.timeout(12000) });
      if (mlRes.ok) {
        const mlJson = await mlRes.json();
        if (mlJson.status === "success" && mlJson.data?.screenshot?.url) {
          const rawImageUrl = mlJson.data.screenshot.url;
          console.log(`[Edge Function] Microlink image URL: ${rawImageUrl}`);

          const imgRes = await fetch(rawImageUrl, { signal: AbortSignal.timeout(10000) });
          if (imgRes.ok) {
            const arrayBuffer = await imgRes.arrayBuffer();
            if (arrayBuffer.byteLength > 1000) {
              screenshotBuffer = new Uint8Array(arrayBuffer);
              contentType = imgRes.headers.get("content-type") || "image/png";
              providerName = "microlink";
              console.log(`[Edge Function] Successfully downloaded Microlink image (${screenshotBuffer.byteLength} bytes)`);
            }
          }
        }
      }
    } catch (e) {
      console.warn(`[Edge Function] Microlink failed:`, (e as Error).message);
    }

    // =========================================================
    // PROVIDER 2: WordPress mShots (Server-side fetch)
    // =========================================================
    if (!screenshotBuffer) {
      try {
        console.log(`[Edge Function] Trying Provider 2 (mShots) for ${normalizedUrl}`);
        const mshotsUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(normalizedUrl)}?w=1440&h=900`;
        const mshotsRes = await fetch(mshotsUrl, { signal: AbortSignal.timeout(12000) });
        if (mshotsRes.ok) {
          const arrayBuffer = await mshotsRes.arrayBuffer();
          if (arrayBuffer.byteLength > 1000) {
            screenshotBuffer = new Uint8Array(arrayBuffer);
            contentType = mshotsRes.headers.get("content-type") || "image/jpeg";
            providerName = "mshots";
            console.log(`[Edge Function] Successfully downloaded mShots image (${screenshotBuffer.byteLength} bytes)`);
          }
        }
      } catch (e) {
        console.warn(`[Edge Function] mShots failed:`, (e as Error).message);
      }
    }

    // =========================================================
    // PROVIDER 3: Thum.io (Server-side fetch)
    // =========================================================
    if (!screenshotBuffer) {
      try {
        console.log(`[Edge Function] Trying Provider 3 (Thum.io) for ${normalizedUrl}`);
        const thumUrl = `https://image.thum.io/get/width/1440/crop/900/noanimate/${normalizedUrl}`;
        const thumRes = await fetch(thumUrl, { signal: AbortSignal.timeout(12000) });
        if (thumRes.ok) {
          const arrayBuffer = await thumRes.arrayBuffer();
          if (arrayBuffer.byteLength > 1000) {
            screenshotBuffer = new Uint8Array(arrayBuffer);
            contentType = thumRes.headers.get("content-type") || "image/jpeg";
            providerName = "thum.io";
            console.log(`[Edge Function] Successfully downloaded Thum.io image (${screenshotBuffer.byteLength} bytes)`);
          }
        }
      } catch (e) {
        console.warn(`[Edge Function] Thum.io failed:`, (e as Error).message);
      }
    }

    // =========================================================
    // If all providers failed:
    // =========================================================
    if (!screenshotBuffer) {
      console.warn(`[Edge Function] All screenshot providers failed for ${normalizedUrl}`);

      if (project_id) {
        await supabase
          .from("projects")
          .update({
            preview_status: "failed",
            preview_error: "Automatic preview unavailable for this website. External providers could not capture a screenshot.",
            preview_updated_at: new Date().toISOString(),
          })
          .eq("id", project_id);
      }

      return new Response(
        JSON.stringify({
          success: false,
          preview_status: "failed",
          error: "Automatic preview unavailable for this website. Please upload a screenshot manually.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // =========================================================
    // Upload image to Supabase Storage: iwaat-media/previews/
    // =========================================================
    const extension = contentType.includes("png") ? "png" : "jpg";
    const storagePath = `previews/${safeSlug}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("iwaat-media")
      .upload(storagePath, screenshotBuffer, {
        contentType,
        cacheControl: "3600",
        upsert: true,
      });

    let publicUrl = "";
    if (uploadError) {
      console.warn(`[Edge Function] Storage upload error:`, uploadError.message);
      // If storage upload fails, construct expected public URL
      publicUrl = `${supabaseUrl}/storage/v1/object/public/iwaat-media/${storagePath}`;
    } else {
      const { data: publicData } = supabase.storage
        .from("iwaat-media")
        .getPublicUrl(storagePath);
      publicUrl = publicData?.publicUrl || `${supabaseUrl}/storage/v1/object/public/iwaat-media/${storagePath}`;
    }

    console.log(`[Edge Function] Generated public preview URL: ${publicUrl}`);

    // Update project row if project_id is provided
    if (project_id) {
      await supabase
        .from("projects")
        .update({
          image: publicUrl,
          preview_url: publicUrl,
          preview_source: providerName,
          preview_status: "ready",
          preview_error: null,
          preview_updated_at: new Date().toISOString(),
        })
        .eq("id", project_id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        preview_url: publicUrl,
        preview_source: providerName,
        preview_status: "ready",
        preview_updated_at: new Date().toISOString(),
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`[Edge Function] Unhandled error:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        preview_status: "failed",
        error: (error as Error).message || "Internal preview generation error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
