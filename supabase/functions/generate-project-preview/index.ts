// Follow this setup guide to integrate the Deno runtime and Supabase Edge Functions:
// https://supabase.com/docs/guides/functions

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const ALLOWED_ORIGINS = [
  "https://iwaat.in",
  "https://www.iwaat.in",
  "https://iwaat.vercel.app",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const isDev = Deno.env.get("ENVIRONMENT") === "development" || Deno.env.get("DENO_ENV") === "development";
  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) ||
    (isDev && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")));

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "https://iwaat.in",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function isPrivateOrReservedIP(ip: string): boolean {
  // Check IPv4
  const ipv4Parts = ip.split('.').map(Number);
  if (ipv4Parts.length === 4 && ipv4Parts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    const [a, b] = ipv4Parts;
    // 0.0.0.0/8 (Current network)
    if (a === 0) return true;
    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;
    // 10.0.0.0/8 (Private RFC1918)
    if (a === 10) return true;
    // 172.16.0.0/12 (Private RFC1918: 172.16.0.0 - 172.31.255.255)
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16 (Private RFC1918)
    if (a === 192 && b === 168) return true;
    // 169.254.0.0/16 (Link-local & AWS/GCP/Azure cloud metadata)
    if (a === 169 && b === 254) return true;
    // 100.64.0.0/10 (Carrier-grade NAT)
    if (a === 100 && b >= 64 && b <= 127) return true;
    // 192.0.0.0/24 (IETF Protocol Assignments)
    if (a === 192 && b === 0) return true;
    // 224.0.0.0/4 (Multicast / Reserved)
    if (a >= 224) return true;
    return false;
  }

  // Check IPv6 loopback / link-local / unique local
  const cleanIp = ip.toLowerCase();
  if (
    cleanIp === '::1' ||
    cleanIp === '::' ||
    cleanIp.startsWith('fe80:') ||
    cleanIp.startsWith('fc00:') ||
    cleanIp.startsWith('fd00:') ||
    cleanIp.startsWith('::ffff:127.') ||
    cleanIp.startsWith('::ffff:10.') ||
    cleanIp.startsWith('::ffff:192.168.') ||
    cleanIp.startsWith('::ffff:169.254.')
  ) {
    return true;
  }

  return false;
}

function validateAndNormalizeUrl(rawUrl: string): { valid: boolean; normalizedUrl?: string; error?: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'URL must be a valid non-empty string.' };
  }

  let urlStr = rawUrl.trim();
  if (urlStr.length > 2048) {
    return { valid: false, error: 'URL length exceeds maximum limit.' };
  }

  if (urlStr === '#' || urlStr.startsWith('javascript:') || urlStr.startsWith('data:') || urlStr.startsWith('file:') || urlStr.startsWith('ftp:')) {
    return { valid: false, error: 'Only HTTP/HTTPS URLs are allowed.' };
  }

  if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
    urlStr = `https://${urlStr}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    return { valid: false, error: 'Invalid URL syntax.' };
  }

  // Enforce HTTP/HTTPS only
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, error: 'Only HTTP/HTTPS protocols are permitted.' };
  }

  const hostname = parsed.hostname.toLowerCase().trim();

  // Reject empty, single-word (no TLD), or local domains
  if (!hostname || !hostname.includes('.')) {
    return { valid: false, error: 'Invalid hostname format.' };
  }

  // Blacklist common local and internal domain suffixes
  const blockedSuffixes = ['.local', '.internal', '.localhost', '.lan', '.home', '.corp', '.test', '.invalid', '.example'];
  if (blockedSuffixes.some((suffix) => hostname.endsWith(suffix))) {
    return { valid: false, error: 'Internal/private network domains are restricted.' };
  }

  // Blacklist specific cloud metadata and loopback hostnames
  const blockedHosts = [
    'localhost',
    'metadata.google.internal',
    'instance-data',
    'metadata',
    '169.254.169.254',
  ];
  if (blockedHosts.includes(hostname)) {
    return { valid: false, error: 'Restricted target destination.' };
  }

  // Check if hostname is an IP literal
  if (isPrivateOrReservedIP(hostname)) {
    return { valid: false, error: 'Private and reserved IP addresses are restricted.' };
  }

  return { valid: true, normalizedUrl: parsed.href };
}

Deno.serve(async (req: Request) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { project_id, website_url, slug = "preview" } = await req.json();

    const validation = validateAndNormalizeUrl(website_url);
    if (!validation.valid || !validation.normalizedUrl) {
      return new Response(
        JSON.stringify({
          success: false,
          preview_status: "failed",
          error: validation.error || "Invalid website URL. Please provide a valid address (e.g. https://example.com).",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedUrl = validation.normalizedUrl;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://npqfnzuyglgrzsetrbdo.supabase.co";
    const supabaseKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_ANON_KEY") ||
      "";

    const supabase = createClient(supabaseUrl, supabaseKey);

    const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    // Helper to safely fetch image with timeout, size limit, and SSRF redirect validation
    const safeFetchImage = async (targetUrl: string, timeoutMs = 10000): Promise<{ buffer: Uint8Array; contentType: string } | null> => {
      const urlValidation = validateAndNormalizeUrl(targetUrl);
      if (!urlValidation.valid || !urlValidation.normalizedUrl) {
        console.warn(`[Edge Function] Discarding unsafe image URL: ${targetUrl}`);
        return null;
      }

      const res = await fetch(urlValidation.normalizedUrl, {
        signal: AbortSignal.timeout(timeoutMs),
        redirect: "manual", // Prevent unverified automatic redirects to internal IPs
      });

      // Handle redirect manually with SSRF validation
      if (res.status === 301 || res.status === 302 || res.status === 307 || res.status === 308) {
        const location = res.headers.get("location");
        if (!location) return null;
        const redirectUrl = new URL(location, urlValidation.normalizedUrl).href;
        const redirectValidation = validateAndNormalizeUrl(redirectUrl);
        if (!redirectValidation.valid || !redirectValidation.normalizedUrl) {
          console.warn(`[Edge Function] Blocked redirect to private/invalid URL: ${redirectUrl}`);
          return null;
        }
        return safeFetchImage(redirectValidation.normalizedUrl, timeoutMs);
      }

      if (!res.ok) return null;

      const contentLength = Number(res.headers.get("content-length") || "0");
      if (contentLength > MAX_IMAGE_SIZE_BYTES) {
        console.warn(`[Edge Function] Image size (${contentLength} bytes) exceeds 10MB limit`);
        return null;
      }

      const arrayBuffer = await res.arrayBuffer();
      if (arrayBuffer.byteLength < 1000 || arrayBuffer.byteLength > MAX_IMAGE_SIZE_BYTES) {
        return null;
      }

      return {
        buffer: new Uint8Array(arrayBuffer),
        contentType: res.headers.get("content-type") || "image/jpeg",
      };
    };

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

          const imgData = await safeFetchImage(rawImageUrl, 10000);
          if (imgData) {
            screenshotBuffer = imgData.buffer;
            contentType = imgData.contentType || "image/png";
            providerName = "microlink";
            console.log(`[Edge Function] Successfully downloaded Microlink image (${screenshotBuffer.byteLength} bytes)`);
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
        const imgData = await safeFetchImage(mshotsUrl, 12000);
        if (imgData) {
          screenshotBuffer = imgData.buffer;
          contentType = imgData.contentType || "image/jpeg";
          providerName = "mshots";
          console.log(`[Edge Function] Successfully downloaded mShots image (${screenshotBuffer.byteLength} bytes)`);
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
        const imgData = await safeFetchImage(thumUrl, 12000);
        if (imgData) {
          screenshotBuffer = imgData.buffer;
          contentType = imgData.contentType || "image/jpeg";
          providerName = "thum.io";
          console.log(`[Edge Function] Successfully downloaded Thum.io image (${screenshotBuffer.byteLength} bytes)`);
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
