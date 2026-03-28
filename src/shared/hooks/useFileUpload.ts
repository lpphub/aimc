import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export interface UseFileUploadOptions {
  /** 允许的文件类型，如 ['image/*', 'application/pdf'] */
  accept?: string[]
  /** 最大文件大小（字节），默认 20MB */
  maxSize?: number
  /** 上传延迟（毫秒），用于 UX 反馈，默认 800ms */
  uploadDelay?: number
  /** 是否生成预览 URL，默认 true */
  generatePreview?: boolean
  /** 是否支持多文件，默认 false */
  multiple?: boolean
  /** 自定义验证错误消息 */
  errorMessage?: {
    type?: string
    size?: string
  }
}

export interface FileUploadResult {
  file: File
  previewUrl: string | null
}

export interface UseFileUploadReturn {
  /** 当前选中的文件 */
  file: File | null
  /** 预览 URL（仅图片类型） */
  previewUrl: string | null
  /** 是否正在上传 */
  isUploading: boolean
  /** 文件输入 ref */
  fileInputRef: React.RefObject<HTMLInputElement | null>
  /** 选择文件（通过 input 或拖拽） */
  selectFile: (file: File) => Promise<boolean>
  /** 处理拖拽放置 */
  handleDrop: (e: React.DragEvent) => Promise<void>
  /** 清除当前文件 */
  clearFile: () => void
  /** 触发文件选择对话框 */
  openFilePicker: () => void
  /** 验证单个文件 */
  validateFile: (file: File) => boolean
}

const DEFAULT_ACCEPT = ['image/*', 'application/pdf']
const DEFAULT_MAX_SIZE = 20 * 1024 * 1024 // 20MB
const DEFAULT_UPLOAD_DELAY = 800

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const {
    accept = DEFAULT_ACCEPT,
    maxSize = DEFAULT_MAX_SIZE,
    uploadDelay = DEFAULT_UPLOAD_DELAY,
    generatePreview = true,
    errorMessage,
  } = options

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Cleanup blob URL on unmount or when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const validateFile = useCallback(
    (f: File): boolean => {
      // 类型验证
      const isValidType = accept.some(pattern => {
        if (pattern.endsWith('/*')) {
          const category = pattern.slice(0, -2)
          return f.type.startsWith(`${category}/`)
        }
        return f.type === pattern
      })

      if (!isValidType) {
        toast.error(errorMessage?.type ?? `仅支持 ${accept.join(', ')} 格式`)
        return false
      }

      // 大小验证
      if (f.size > maxSize) {
        const sizeMB = Math.round(maxSize / 1024 / 1024)
        toast.error(errorMessage?.size ?? `文件大小不能超过 ${sizeMB}MB`)
        return false
      }

      return true
    },
    [accept, maxSize, errorMessage]
  )

  const selectFile = useCallback(
    async (f: File): Promise<boolean> => {
      if (!validateFile(f)) return false

      // Revoke old URL before creating new one
      if (previewUrl) URL.revokeObjectURL(previewUrl)

      setFile(f)
      setIsUploading(true)

      // Simulate upload delay for UX feedback
      if (uploadDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, uploadDelay))
      }

      // Generate preview URL for images
      if (generatePreview && f.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(f)
        setPreviewUrl(objectUrl)
      } else {
        setPreviewUrl(null)
      }

      setIsUploading(false)
      return true
    },
    [validateFile, previewUrl, uploadDelay, generatePreview]
  )

  const handleDrop = useCallback(
    async (e: React.DragEvent): Promise<void> => {
      e.preventDefault()
      const f = e.dataTransfer.files[0]
      if (f) await selectFile(f)
    },
    [selectFile]
  )

  const clearFile = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setIsUploading(false)
  }, [previewUrl])

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return {
    file,
    previewUrl,
    isUploading,
    fileInputRef,
    selectFile,
    handleDrop,
    clearFile,
    openFilePicker,
    validateFile,
  }
}
