export interface ReviewMediaItem {
  type: 'image' | 'video';
  url: string;
}

/**
 * Safely parses review.images which can be a JSON array of strings or {type, url} objects
 */
export function parseReviewMedia(images: string | null | undefined): ReviewMediaItem[] {
  if (!images) return [];
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => {
          if (typeof item === 'string') {
            const isVid =
              item.startsWith('data:video') ||
              item.endsWith('.mp4') ||
              item.endsWith('.webm') ||
              item.endsWith('.mov');
            return { type: (isVid ? 'video' : 'image') as 'video' | 'image', url: item };
          }
          if (item && typeof item === 'object' && item.url) {
            const isVid =
              item.type === 'video' ||
              item.url.startsWith('data:video') ||
              item.url.endsWith('.mp4') ||
              item.url.endsWith('.webm');
            return {
              type: (isVid ? 'video' : 'image') as 'video' | 'image',
              url: item.url,
            };
          }
          return null;
        })
        .filter(Boolean) as ReviewMediaItem[];
    }
  } catch {
    if (typeof images === 'string' && images.trim().length > 0) {
      const isVid =
        images.startsWith('data:video') ||
        images.endsWith('.mp4') ||
        images.endsWith('.webm');
      return [{ type: isVid ? 'video' : 'image', url: images }];
    }
  }
  return [];
}

/**
 * Reads and optimizes an uploaded user photo or video into base64 data URL
 */
export async function processMediaFile(file: File): Promise<ReviewMediaItem> {
  const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(file.name);
  const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif)$/i.test(file.name);

  if (!isImage && !isVideo) {
    throw new Error('Please upload an image (JPG, PNG, WebP) or video (MP4, WebM, MOV) file.');
  }

  // 15MB limit for video, 12MB for image
  if (file.size > 15 * 1024 * 1024) {
    throw new Error('File size exceeds 15MB limit. Please choose a shorter video or smaller file.');
  }

  if (isVideo) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          type: 'video',
          url: reader.result as string,
        });
      };
      reader.onerror = () => reject(new Error('Failed to read video file.'));
      reader.readAsDataURL(file);
    });
  }

  // For images, optimize resolution to max 1200px for web fast loading
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ type: 'image', url: reader.result as string });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve({ type: 'image', url: compressedDataUrl });
      };
      img.onerror = () => {
        resolve({ type: 'image', url: reader.result as string });
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}
