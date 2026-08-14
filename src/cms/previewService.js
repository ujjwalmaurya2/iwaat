/**
 * iWAAT Digital Services - Multi-Provider Website Screenshot & Preview Engine
 * Robust, timeout-guarded pipeline for capturing real rendered client websites.
 */
import { supabase, isSupabaseConfigured, uploadToSupabaseStorage } from './supabase.js';

/**
 * Normalizes input website URL to standard full HTTPS/HTTP canonical URL
 * @param {string} inputUrl 
 * @returns {string}
 */
export function normalizeUrl(inputUrl) {
  if (!inputUrl) return '';
  let url = inputUrl.trim();
  if (url === '#' || url.startsWith('javascript:')) return '';

  // If user pasted without protocol (e.g. "myclient.com" or "www.myclient.com")
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return '';
    }
    return parsed.href;
  } catch (e) {
    return '';
  }
}

/**
 * Verifies that an image URL loads valid image pixels within a strict timeout
 * @param {string} imageUrl 
 * @param {number} timeoutMs 
 * @returns {Promise<boolean>}
 */
export async function verifyImageLoads(imageUrl, timeoutMs = 8000) {
  if (!imageUrl) return false;

  // Browser DOM environment with HTMLImageElement
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
          // Ensure image has real dimensions (reject 0x0 or 1x1 error pixels)
          resolve(img.naturalWidth > 30 && img.naturalHeight > 30);
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

  // Node.js or Web Worker environment without DOM
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(imageUrl, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const type = res.headers.get('content-type') || '';
      return type.startsWith('image/') || type === 'binary/octet-stream';
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Optional helper to upload captured screenshot blob/URL into Supabase Storage
 * @param {string} imageUrl 
 * @param {string} projectSlug 
 * @returns {Promise<string>} Permanent public storage URL, or original imageUrl if storage fails
 */
export async function persistScreenshotToStorage(imageUrl, projectSlug = 'preview') {
  if (!isSupabaseConfigured() || !supabase) return imageUrl;

  try {
    // Attempt to fetch the image as a Blob with a 6s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    
    const res = await fetch(imageUrl, { signal: controller.signal, mode: 'cors' });
    clearTimeout(timeoutId);

    if (res.ok) {
      const blob = await res.blob();
      const filename = `previews/${projectSlug}-${Date.now()}.webp`;
      const publicUrl = await uploadToSupabaseStorage('iwaat-media', filename, blob);
      if (publicUrl) {
        console.log('[Preview] Uploaded screenshot to Supabase Storage:', publicUrl);
        return publicUrl;
      }
    }
  } catch (uploadErr) {
    console.warn('[Preview] Storage upload note (using direct CDN screenshot URL):', uploadErr.message);
  }

  return imageUrl;
}

/**
 * Generates an actual website screenshot preview using a multi-provider fallback pipeline
 * @param {string} rawUrl 
 * @param {string} [projectSlug='preview'] 
 * @returns {Promise<{ previewUrl: string, status: 'success' | 'failed', provider?: string, timestamp?: string, message?: string }>}
 */
export async function generateWebsitePreview(rawUrl, projectSlug = 'preview') {
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

  // ============================================================
  // PROVIDER 1: Microlink Official JSON API (1440x900 Viewport)
  // ============================================================
  try {
    console.log('[Preview] Trying Provider 1: Microlink...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000); // 9s hard timeout

    const mlApiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&viewport.width=1440&viewport.height=900&waitForTimeout=1000`;
    const res = await fetch(mlApiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await res.json();
        if (json.status === 'success' && json.data?.screenshot?.url) {
          const rawScreenshotUrl = json.data.screenshot.url;
          console.log('[Preview] Microlink returned screenshot URL:', rawScreenshotUrl);

          const isValidImage = await verifyImageLoads(rawScreenshotUrl, 6000);
          if (isValidImage) {
            console.log('[Preview] Microlink screenshot verified successfully!');
            const finalUrl = await persistScreenshotToStorage(rawScreenshotUrl, projectSlug);
            return {
              previewUrl: finalUrl,
              status: 'success',
              provider: 'microlink',
              timestamp: new Date().toISOString(),
            };
          }
        }
      }
    }
    console.warn('[Preview] Microlink failed or non-200 response. Trying fallback...');
  } catch (err) {
    console.warn('[Preview] Microlink error/timeout:', err.name === 'AbortError' ? 'Timeout (9s exceeded)' : err.message);
  }

  // ============================================================
  // PROVIDER 2: WordPress mShots Service (High-Speed Viewport Render)
  // ============================================================
  try {
    console.log('[Preview] Trying Provider 2: WordPress mShots...');
    const mshotsUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1440&h=900`;
    const isValidImage = await verifyImageLoads(mshotsUrl, 7000);
    if (isValidImage) {
      console.log('[Preview] WordPress mShots screenshot verified successfully!');
      const finalUrl = await persistScreenshotToStorage(mshotsUrl, projectSlug);
      return {
        previewUrl: finalUrl,
        status: 'success',
        provider: 'mshots',
        timestamp: new Date().toISOString(),
      };
    }
    console.warn('[Preview] WordPress mShots failed. Trying fallback...');
  } catch (err) {
    console.warn('[Preview] WordPress mShots error:', err.message);
  }

  // ============================================================
  // PROVIDER 3: Thum.io Live Capture Engine
  // ============================================================
  try {
    console.log('[Preview] Trying Provider 3: Thum.io...');
    const thumUrl = `https://image.thum.io/get/width/1440/crop/900/noanimate/${url}`;
    const isValidImage = await verifyImageLoads(thumUrl, 7000);
    if (isValidImage) {
      console.log('[Preview] Thum.io screenshot verified successfully!');
      const finalUrl = await persistScreenshotToStorage(thumUrl, projectSlug);
      return {
        previewUrl: finalUrl,
        status: 'success',
        provider: 'thum.io',
        timestamp: new Date().toISOString(),
      };
    }
    console.warn('[Preview] Thum.io failed. Trying fallback...');
  } catch (err) {
    console.warn('[Preview] Thum.io error:', err.message);
  }

  // ============================================================
  // PROVIDER 4: S-Shot Live Render Engine
  // ============================================================
  try {
    console.log('[Preview] Trying Provider 4: S-Shot...');
    const sshotUrl = `https://mini.s-shot.ru/1440x900/JPEG/1440/Z100/?${encodeURIComponent(url)}`;
    const isValidImage = await verifyImageLoads(sshotUrl, 7000);
    if (isValidImage) {
      console.log('[Preview] S-Shot screenshot verified successfully!');
      const finalUrl = await persistScreenshotToStorage(sshotUrl, projectSlug);
      return {
        previewUrl: finalUrl,
        status: 'success',
        provider: 's-shot',
        timestamp: new Date().toISOString(),
      };
    }
    console.warn('[Preview] S-Shot failed.');
  } catch (err) {
    console.warn('[Preview] S-Shot error:', err.message);
  }

  // ============================================================
  // ALL PROVIDERS FAILED
  // ============================================================
  console.log('[Preview] All automated screenshot providers exhausted. Requesting manual upload.');
  return {
    previewUrl: '',
    status: 'failed',
    message: 'Automatic preview unavailable for this website. The website may block external crawlers. Please upload a custom screenshot.',
  };
}
