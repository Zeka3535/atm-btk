/** Сжатие фото для черновика/отправки отчёта (демо PWA) */

export const MAX_REPORT_PHOTOS = 3

const MAX_EDGE = 1280
const JPEG_Q = 0.72

/** Файл → JPEG data URL с ограничением длинной стороны */
export async function fileToReportDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith('image/') && file.type !== '') {
    throw new Error('Нужно изображение')
  }
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
    const w = Math.max(1, Math.round(bitmap.width * scale))
    const h = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Не удалось обработать фото')
    ctx.drawImage(bitmap, 0, 0, w, h)
    return canvas.toDataURL('image/jpeg', JPEG_Q)
  } finally {
    bitmap.close()
  }
}
