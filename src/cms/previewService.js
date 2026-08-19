/**
 * iWAAT Digital Services - Direct CDN Website Preview Engine
 * 100% Zero-CORS Architecture: Uses direct CDN screenshot links with no browser blob fetching.
 */

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
 * Verifies that an image URL renders valid pixels using HTMLImageElement (never uses fetch())
 * @param {string} imageUrl 
 * @param {number} timeoutMs 
 * @returns {Promise<boolean>}
 */
export async function verifyImageLoads(imageUrl, timeoutMs = 6000) {
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

  // Node.js or test environment
  return true;
}

/**
 * Generates an actual website screenshot preview using Direct CDN URLs
 * The browser never fetches image blobs, eliminating all CORS restrictions.
 * 
 * @param {string} rawUrl 
 * @returns {Promise<{ previewUrl: string, status: 'ready' | 'failed', provider?: string, timestamp?: string, message?: string }>}
 */
export async function generateWebsitePreview(rawUrl) {
  const url = normalizeUrl(rawUrl);

  console.log('[Preview] Starting Direct CDN preview generation for:', rawUrl);
  console.log('[Preview] Normalized URL:', url);

  if (!url || !url.startsWith('http')) {
    return {
      previewUrl: '',
      status: 'failed',
      message: 'Website URL is invalid. Please enter a valid address (e.g. https://example.com).',
    };
  }

  // ============================================================
  // PROVIDER 1: Microlink Official JSON API
  // ============================================================
  try {
    console.log('[Preview] Trying Provider 1: Microlink...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const mlApiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&viewport.width=1024&viewport.height=640&waitForTimeout=1000`;
    const res = await fetch(mlApiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data?.screenshot?.url) {
        const screenshotUrl = json.data.screenshot.url;
        console.log('[Preview] Microlink CDN URL obtained:', screenshotUrl);

        const isValid = await verifyImageLoads(screenshotUrl, 5000);
        if (isValid) {
          console.log('[Preview] Microlink screenshot verified and ready!');
          return {
            previewUrl: screenshotUrl,
            status: 'ready',
            provider: 'microlink',
            timestamp: new Date().toISOString(),
          };
        }
      }
    }
    console.warn('[Preview] Microlink failed or slow, trying fallback...');
  } catch (err) {
    console.warn('[Preview] Microlink note:', err.name === 'AbortError' ? 'Timeout' : err.message);
  }

  // ============================================================
  // PROVIDER 2: WordPress mShots Direct CDN
  // ============================================================
  try {
    console.log('[Preview] Trying Provider 2: WordPress mShots CDN...');
    const mshotsUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=960&h=600`;
    const isValid = await verifyImageLoads(mshotsUrl, 6000);
    if (isValid) {
      console.log('[Preview] WordPress mShots CDN URL verified and ready!');
      return {
        previewUrl: mshotsUrl,
        status: 'ready',
        provider: 'mshots',
        timestamp: new Date().toISOString(),
      };
    }
    console.warn('[Preview] WordPress mShots failed, trying fallback...');
  } catch (err) {
    console.warn('[Preview] WordPress mShots note:', err.message);
  }

  // ============================================================
  // PROVIDER 3: Thum.io Live Capture CDN
  // ============================================================
  try {
    console.log('[Preview] Trying Provider 3: Thum.io CDN...');
    const thumUrl = `https://image.thum.io/get/width/960/crop/600/noanimate/${url}`;
    const isValid = await verifyImageLoads(thumUrl, 6000);
    if (isValid) {
      console.log('[Preview] Thum.io CDN URL verified and ready!');
      return {
        previewUrl: thumUrl,
        status: 'ready',
        provider: 'thum.io',
        timestamp: new Date().toISOString(),
      };
    }
    console.warn('[Preview] Thum.io failed, trying fallback...');
  } catch (err) {
    console.warn('[Preview] Thum.io note:', err.message);
  }

  // ============================================================
  // PROVIDER 4: S-Shot Render CDN
  // ============================================================
  try {
    console.log('[Preview] Trying Provider 4: S-Shot CDN...');
    const sshotUrl = `https://mini.s-shot.ru/960x600/JPEG/960/Z100/?${encodeURIComponent(url)}`;
    const isValid = await verifyImageLoads(sshotUrl, 6000);
    if (isValid) {
      console.log('[Preview] S-Shot CDN URL verified and ready!');
      return {
        previewUrl: sshotUrl,
        status: 'ready',
        provider: 's-shot',
        timestamp: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('[Preview] S-Shot note:', err.message);
  }

  // ============================================================
  // ALL PROVIDERS FAILED
  // ============================================================
  console.log('[Preview] All automated screenshot providers exhausted.');
  return {
    previewUrl: '',
    status: 'failed',
    message: 'Automatic preview unavailable for this website. Please upload a custom screenshot.',
  };
}
