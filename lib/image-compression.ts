/**
 * Compresses an image file to a specified maximum width/height and quality.
 * @param file The image file to compress
 * @param maxWidth The maximum width of the output image (default: 800px)
 * @param quality The quality of the JPEG output (0-1, default: 0.8)
 * @returns A Promise that resolves to the compressed Blob
 */
export async function compressImage(
  file: File,
  maxWidth = 800,
  quality = 0.8
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = () => {
      const canvas = document.createElement('canvas')
      let width = image.width
      let height = image.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('Failed to get canvas context'))
        return
      }

      ctx.drawImage(image, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Compression failed'))
          }
        },
        'image/jpeg',
        quality
      )
    }
    image.onerror = (error) => reject(error)
  })
}
