export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export const MAX_UPLOAD_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Validates file MIME type and size limits
 */
export function validateImageFile(file) {
  if (!file) {
    throw new Error('No file provided.');
  }

  if (file.size > MAX_UPLOAD_FILE_SIZE) {
    throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed limit of 10 MB.`);
  }

  const mimeType = (file.type || '').toLowerCase();
  const extension = (file.name || '').split('.').pop()?.toLowerCase();

  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(mimeType) && !allowedExtensions.includes(extension)) {
    throw new Error(`Unsupported file format "${mimeType || extension}". Only JPG, PNG, WebP, GIF, and SVG images are allowed.`);
  }

  return true;
}

/**
 * Strips executable scripts, event handlers, javascript: URIs, and dangerous elements from SVG markup.
 */
export function sanitizeSvg(svgContent) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');

    // Check for parse error
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid SVG markup format.');
    }

    const svgElement = doc.documentElement;
    if (svgElement.nodeName.toLowerCase() !== 'svg') {
      throw new Error('Document root is not an SVG element.');
    }

    // Dangerous elements to remove
    const forbiddenTags = [
      'script', 'foreignobject', 'iframe', 'object', 'embed', 
      'link', 'meta', 'style', 'audio', 'video', 'base', 'applet'
    ];

    forbiddenTags.forEach((tag) => {
      const elements = doc.querySelectorAll(tag);
      elements.forEach((el) => el.parentNode?.removeChild(el));
    });

    // Remove all inline event handlers (onload, onclick, etc.) and javascript: URIs across all nodes
    const allNodes = doc.querySelectorAll('*');
    allNodes.forEach((node) => {
      const attributes = Array.from(node.attributes);
      attributes.forEach((attr) => {
        const attrName = attr.name.toLowerCase();
        const attrValue = attr.value.trim().toLowerCase();

        // Remove any on* event handler
        if (attrName.startsWith('on')) {
          node.removeAttribute(attr.name);
        }

        // Remove dangerous href/src attributes containing javascript:, data:text/html, etc.
        if (
          (attrName === 'href' || attrName === 'xlink:href' || attrName === 'src') &&
          (attrValue.startsWith('javascript:') || attrValue.startsWith('data:text/html') || attrValue.startsWith('vbscript:'))
        ) {
          node.removeAttribute(attr.name);
        }
      });
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  } catch (err) {
    throw new Error('SVG sanitization failed: ' + err.message);
  }
}

export async function optimizeImage(fileOrBlob, maxWidth = 1600, maxHeight = 1000, quality = 0.85) {
  // Validate file bounds if File instance
  if (fileOrBlob instanceof File) {
    validateImageFile(fileOrBlob);
  }

  return new Promise((resolve, reject) => {
    // If SVG, sanitize markup before returning data URL
    if (fileOrBlob.type === 'image/svg+xml' || (fileOrBlob.name && fileOrBlob.name.endsWith('.svg'))) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const rawText = reader.result;
          const cleanSvg = sanitizeSvg(rawText);
          const encodedDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(cleanSvg)}`;
          resolve(encodedDataUrl);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsText(fileOrBlob);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(fileOrBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      
      let width = img.width;
      let height = img.height;

      // Scale down proportionally if larger than maximum bounds
      if (width > maxWidth || height > maxHeight) {
        if (width / maxWidth > height / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Enable smooth high-quality bicubic resampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Attempt to encode as image/webp; browser fallback to image/jpeg if webp not supported
      try {
        const webpDataUrl = canvas.toDataURL('image/webp', quality);
        resolve(webpDataUrl);
      } catch (e) {
        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(jpegDataUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for optimization.'));
    };

    img.src = url;
  });
}

/**
 * Converts a Data URL back to a File/Blob for cloud storage uploads
 */
export function dataUrlToFile(dataUrl, filename) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
