/**
 * iWAAT Digital Services - Production-Grade Website Preview System
 * Decoupled, multi-provider pipeline with Edge Function server-side capture and Zero-CORS browser fallback.
 */
import { supabase, isSupabaseConfigured } from './supabase.js';

/**
 * Normalizes input website URL to standard full HTTPS/HTTP canonical URL
 * @param {string} inputUrl 
 * @returns {string}
 */
export function normalizeUrl(inputUrl) {
  if (!inputUrl) return '';
  let url = inputUrl.trim();
  if (url === '#' || url.startsWith('javascript:')) return '';

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return '';
    }
    return parsed.href;
  } catch {
    return '';
  }
}

/**
 * Verifies that an image URL renders valid pixels in the browser
 * NOTE: Uses HTMLImageElement. Never uses fetch() to prevent CORS blocks.
 * @param {string} imageUrl 
 * @param {number} timeoutMs 
 * @returns {Promise<boolean>}
 */
export async function verifyImageLoads(imageUrl, timeoutMs = 7000) {
  if (!imageUrl) return false;

  if (typeof Image !== 'undefined') {
    return new Promise((resolve) => {
      const img = new Image();
      let isResolved = false;

      const timer = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          resolve(false);
        }
      }, timeoutMs);

      img.onload = () => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          resolve(img.naturalWidth > 20 && img.naturalHeight > 20);
        }
      };

      img.onerror = () => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          resolve(false);
        }
      };

      img.src = imageUrl;
    });
  }

  // Node.js or non-DOM test environments
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(imageUrl, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Generates an actual website screenshot preview
 * 1. Tries Supabase Edge Function server-side capture (saving to Supabase Storage)
 * 2. Falls back to multi-provider direct verified URL cascade (Zero-CORS)
 * 
 * @param {string} rawUrl 
 * @param {string} [projectId] 
 * @param {string} [slug='preview'] 
 * @returns {Promise<{ previewUrl: string, status: 'ready' | 'failed', provider?: string, timestamp?: string, message?: string }>}
 */
export async function generateWebsitePreview(rawUrl, projectId = '', slug = 'preview') {
  const url = normalizeUrl(rawUrl);

  console.log('[Preview] Starting preview generation for:', rawUrl);
  console.log('[Preview] Normalized URL:', url);

  if (!url || !url.startsWith('http')) {
    return {
      previewUrl: '',
      status: 'failed',
      message: 'Website URL is invalid. Please enter a valid address (e.g. https://example.com).',
    };
  }

  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // ============================================================
  // TIER 1: Supabase Edge Function (Server-Side Capture & Storage)
  // ============================================================
  if (isSupabaseConfigured() && supabase) {
    try {
      console.log('[Preview] Attempting Edge Function server-side screenshot generation...');
      const { data, error } = await supabase.functions.invoke('generate-project-preview', {
        body: {
          project_id: projectId,
          website_url: url,
          slug: safeSlug,
        },
      });

      if (!error && data && (data.success || data.preview_url)) {
        console.log('[Preview] Edge function successfully returned preview:', data.preview_url);
        return {
          previewUrl: data.preview_url,
          status: 'ready',
          provider: data.preview_source || 'edge-function',
          timestamp: data.preview_updated_at || new Date().toISOString(),
        };
      }
    } catch (edgeErr) {
      console.warn('[Preview] Edge function unavailable, proceeding with direct verified provider cascade...', edgeErr.message);
    }
  }

  // ============================================================
  // TIER 2: Microlink Official JSON API (Zero-CORS URL Resolution)
  // ============================================================
  try {
    console.log('[Preview] Trying Provider: Microlink...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const mlApiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&viewport.width=1440&viewport.height=900&waitForTimeout=1000`;
    const res = await fetch(mlApiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data?.screenshot?.url) {
        const screenshotUrl = json.data.screenshot.url;
        console.log('[Preview] Microlink returned screenshot URL:', screenshotUrl);

        const isValid = await verifyImageLoads(screenshotUrl, 6000);
        if (isValid) {
          console.log('[Preview] Microlink screenshot verified successfully!');
          return {
            previewUrl: screenshotUrl,
            status: 'ready',
            provider: 'microlink',
            timestamp: new Date().toISOString(),
          };
        }
      }
    }
    console.warn('[Preview] Microlink response invalid or failed verification. Trying fallback...');
  } catch (err) {
    console.warn('[Preview] Microlink error/timeout:', err.name === 'AbortError' ? 'Timeout (9s)' : err.message);
  }

  // ============================================================
  // TIER 3: WordPress mShots Service
  // ============================================================
  try {
    console.log('[Preview] Trying Provider: WordPress mShots...');
    const mshotsUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1440&h=900`;
    const isValid = await verifyImageLoads(mshotsUrl, 7000);
    if (isValid) {
      console.log('[Preview] WordPress mShots verified successfully!');
      return {
        previewUrl: mshotsUrl,
        status: 'ready',
        provider: 'mshots',
        timestamp: new Date().toISOString(),
      };
    }
    console.warn('[Preview] WordPress mShots verification failed. Trying fallback...');
  } catch (err) {
    console.warn('[Preview] WordPress mShots error:', err.message);
  }

  // ============================================================
  // TIER 4: Thum.io Live Capture Engine
  // ============================================================
  try {
    console.log('[Preview] Trying Provider: Thum.io...');
    const thumUrl = `https://image.thum.io/get/width/1440/crop/900/noanimate/${url}`;
    const isValid = await verifyImageLoads(thumUrl, 7000);
    if (isValid) {
      console.log('[Preview] Thum.io verified successfully!');
      return {
        previewUrl: thumUrl,
        status: 'ready',
        provider: 'thum.io',
        timestamp: new Date().toISOString(),
      };
    }
    console.warn('[Preview] Thum.io failed. Trying fallback...');
  } catch (err) {
    console.warn('[Preview] Thum.io error:', err.message);
  }

  // ============================================================
  // TIER 5: S-Shot Live Render Engine
  // ============================================================
  try {
    console.log('[Preview] Trying Provider: S-Shot...');
    const sshotUrl = `https://mini.s-shot.ru/1440x900/JPEG/1440/Z100/?${encodeURIComponent(url)}`;
    const isValid = await verifyImageLoads(sshotUrl, 7000);
    if (isValid) {
      console.log('[Preview] S-Shot verified successfully!');
      return {
        previewUrl: sshotUrl,
        status: 'ready',
        provider: 's-shot',
        timestamp: new Date().toISOString(),
      };
    }
    console.warn('[Preview] S-Shot failed.');
  } catch (err) {
    console.warn('[Preview] S-Shot error:', err.message);
  }

  // ============================================================
  // ALL PROVIDERS EXHAUSTED: Return structured non-fatal failure
  // ============================================================
  console.log('[Preview] All automated screenshot providers exhausted.');
  return {
    previewUrl: '',
    status: 'failed',
    message: 'Automatic preview unavailable for this website. The website may block external crawlers. Please upload a custom screenshot.',
  };
}
