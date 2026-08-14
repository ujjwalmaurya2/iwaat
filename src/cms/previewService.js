/**
 * Website Screenshot & Preview Generator Engine
 * Fetches actual live rendering of client websites via reliable multi-service fallback.
 */

export function normalizeUrl(inputUrl) {
  if (!inputUrl) return '';
  let url = inputUrl.trim();
  if (url === '#' || url.startsWith('javascript:')) return url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

export async function verifyImageLoads(imageUrl, timeoutMs = 8000) {
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
        resolve(true);
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
 * Generate real website preview screenshot
 * @param {string} rawUrl 
 * @returns {Promise<{ previewUrl: string, status: 'success' | 'failed', message?: string }>}
 */
export async function generateWebsitePreview(rawUrl) {
  const url = normalizeUrl(rawUrl);

  if (!url || url === '#' || !url.startsWith('http')) {
    return {
      previewUrl: '',
      status: 'failed',
      message: 'Please enter a valid website URL starting with https:// or http://',
    };
  }

  // Attempt Provider 1: Microlink API Live Screenshot
  try {
    const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
    const works = await verifyImageLoads(microlinkUrl, 6000);
    if (works) {
      return {
        previewUrl: microlinkUrl,
        status: 'success',
        provider: 'microlink',
        timestamp: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('[Preview Engine] Microlink provider failed, falling back to mShots...', err);
  }

  // Attempt Provider 2: WordPress mShots Service
  try {
    const mshotsUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=800`;
    const works = await verifyImageLoads(mshotsUrl, 6000);
    if (works) {
      return {
        previewUrl: mshotsUrl,
        status: 'success',
        provider: 'mshots',
        timestamp: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('[Preview Engine] mShots provider failed...', err);
  }

  // Attempt Provider 3: Thum.io Live Capture
  try {
    const thumUrl = `https://image.thum.io/get/width/1200/crop/800/${url}`;
    const works = await verifyImageLoads(thumUrl, 6000);
    if (works) {
      return {
        previewUrl: thumUrl,
        status: 'success',
        provider: 'thum.io',
        timestamp: new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('[Preview Engine] Thum.io provider failed...', err);
  }

  // If all automatic screenshot services fail:
  return {
    previewUrl: '',
    status: 'failed',
    message: 'Automatic preview unavailable for this URL. Please upload a custom screenshot.',
  };
}
