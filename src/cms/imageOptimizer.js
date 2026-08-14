/**
 * Client-Side Image Optimizer and WebP Converter
 * Compresses images before upload/storage to minimize latency and bandwidth.
 */

export async function optimizeImage(fileOrBlob, maxWidth = 1600, maxHeight = 1000, quality = 0.85) {
  return new Promise((resolve, reject) => {
    // If SVG, return as is
    if (fileOrBlob.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBlob);
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
