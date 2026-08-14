/**
 * iWAAT Digital Services - Website Screenshot Preview Engine
 * Robust, multi-provider pipeline for capturing real rendered client websites.
 */

/**
 * Normalizes input website URL to standard full HTTPS/HTTP URL
 * @param {string} inputUrl 
 * @returns {string}
 */
export function normalizeUrl(inputUrl) {
  if (!inputUrl) return '';
  let url = inputUrl.trim();
  if (url === '#' || url.startsWith('javascript:')) return url;
  
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
 * Verifies that an image URL actually loads valid image pixels in the browser
 * @param {string} imageUrl 
 * @param {number} timeoutMs 
 * @returns {Promise<boolean>}
 */
export async function verifyImageLoads(imageUrl, timeoutMs = 8000) {
  return new Promise((resolve) => {
    if (!imageUrl) return resolve(false);

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
        // Check natural dimensions to confirm not a 0-pixel broken image
        resolve(img.naturalWidth > 10 && img.naturalHeight > 10);
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

/**
 * Generates an actual website screenshot preview for a given URL
 * @param {string} rawUrl 
 * @returns {Promise<{ previewUrl: string, status: 'success' | 'failed', provider?: string, message?: string }>}
 */
export async function generateWebsitePreview(rawUrl) {
  const url = normalizeUrl(rawUrl);

  if (!url || url === '#' || !url.startsWith('http')) {
    return {
      previewUrl: '',
      status: 'failed',
      message: 'Website URL is invalid. Please enter a valid address (e.g. https://example.com).',
    };
  }

  // ============================================================
  // TIER 1: Microlink JSON API (High-Fidelity 1440x900 Screenshot)
  // ============================================================
  try {
    const mlApiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&viewport.width=1440&viewport.height=900&waitForTimeout=1000`;
    const res = await fetch(mlApiUrl);
    if (res.ok) {
      const json = await res.json();
      if (json.status === 'success' && json.data?.screenshot?.url) {
        const screenshotUrl = json.data.screenshot.url;
        const loads = await verifyImageLoads(screenshotUrl, 7000);
        if (loads) {
          return {
            previewUrl: screenshotUrl,
            status: 'success',
            provider: 'microlink',
            timestamp: new Date().toISOString(),
          };
        }
      }
    }
  } catch (err) {
    console.warn('[Preview Engine] Microlink JSON fetch failed, attempting CDN fallbacks...', err);
  }

  // ============================================================
  // TIER 2: WordPress mShots Service
  // ============================================================
  try {
    const mshotsUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1440&h=900`;
    const loads = await verifyImageLoads(mshotsUrl, 7000);
    if (loads) {
      return {
        previewUrl: mshotsUrl,
        status: 'success',
        provider: 'mshots',
        timestamp: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('[Preview Engine] WordPress mShots failed...', err);
  }

  // ============================================================
  // TIER 3: Thum.io Live Capture
  // ============================================================
  try {
    const thumUrl = `https://image.thum.io/get/width/1440/crop/900/noanimate/${url}`;
    const loads = await verifyImageLoads(thumUrl, 7000);
    if (loads) {
      return {
        previewUrl: thumUrl,
        status: 'success',
        provider: 'thum.io',
        timestamp: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('[Preview Engine] Thum.io capture failed...', err);
  }

  // ============================================================
  // TIER 4: S-Shot Live Render Engine
  // ============================================================
  try {
    const sshotUrl = `https://mini.s-shot.ru/1440x900/JPEG/1440/Z100/?${encodeURIComponent(url)}`;
    const loads = await verifyImageLoads(sshotUrl, 7000);
    if (loads) {
      return {
        previewUrl: sshotUrl,
        status: 'success',
        provider: 's-shot',
        timestamp: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('[Preview Engine] S-Shot capture failed...', err);
  }

  // If all providers fail: Never substitute unrelated stock photos
  return {
    previewUrl: '',
    status: 'failed',
    message: 'Unable to automatically capture this website. The website may block external screenshots. Please upload a screenshot manually.',
  };
}
