# PosterTool API Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the PosterTool's mock `setTimeout` + placeholder URL with real backend API integration, following FSD architecture and existing codebase patterns.

**Architecture:** The poster generation sends config params (prompt, aspectRatio, colorTone, style) plus an optional reference image file to `POST /api/creations/poster` via FormData. The response returns an `imageUrl`. UI layer uses a TanStack Query `useMutation` hook; API layer uses `apiClient` directly with FormData (same pattern as `materials/api.ts:uploadMaterial`). Types follow `XxxReq`/`XxxResp` convention.

**Tech Stack:** TypeScript, React, TanStack Query, ky (via `apiClient`), sonner (toast), Tailwind CSS

---

### Task 1: Add poster generation types

**Files:**
- Modify: `src/features/creations/types.ts:28`

**Step 1: Add request and response types**

Add to the end of `types.ts`:

```ts
export interface GeneratePosterReq {
  prompt: string
  aspectRatio: string
  colorTone: string
  style: string
}

export interface GeneratePosterResp {
  imageUrl: string
}
```

**Step 2: Verify types compile**

Run: `pnpm build`
Expected: Build succeeds with no type errors.

**Step 3: Commit**

```bash
git add src/features/creations/types.ts
git commit -m "feat: add poster generation request/response types"
```

---

### Task 2: Add poster API endpoint

**Files:**
- Modify: `src/features/creations/api.ts:1-17`

**Step 1: Add imports and API function**

Update `api.ts` — add imports for new types and `apiClient`, then add `generatePoster`:

```ts
import api, { apiClient } from '@/lib/api'
import type {
  GenerateImageReq,
  GenerateImageResp,
  GeneratePosterReq,
  GeneratePosterResp,
  GenerateTextReq,
  GenerateTextResp,
  OcrReq,
  OcrResp,
} from './types'

export const creationsApi = {
  generateText: (data: GenerateTextReq) => api.post<GenerateTextResp>('creations/text', data),

  generateImage: (data: GenerateImageReq) => api.post<GenerateImageResp>('creations/image', data),

  ocr: (data: OcrReq) => api.post<OcrResp>('creations/ocr', data),

  generatePoster: async (data: GeneratePosterReq, file?: File): Promise<GeneratePosterResp> => {
    const formData = new FormData()
    formData.append('prompt', data.prompt)
    formData.append('aspectRatio', data.aspectRatio)
    formData.append('colorTone', data.colorTone)
    formData.append('style', data.style)
    if (file) {
      formData.append('file', file)
    }
    const res = await apiClient.post('creations/poster', { body: formData })
    const json = await res.json<{ code: number; message: string; data: GeneratePosterResp }>()
    if (json.code !== 0) throw new Error(json.message)
    return json.data
  },
}
```

**Step 2: Verify types compile**

Run: `pnpm build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/features/creations/api.ts
git commit -m "feat: add generatePoster API with FormData upload"
```

---

### Task 3: Add useGeneratePoster mutation hook

**Files:**
- Modify: `src/features/creations/hooks/index.ts:1-25`

**Step 1: Add the mutation hook**

Update `hooks/index.ts` — add import for `GeneratePosterReq` and the new hook:

```ts
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { creationsApi } from '../api'
import type { GenerateImageReq, GeneratePosterReq, GenerateTextReq, OcrReq } from '../types'

export const creationsKeys = {
  all: ['creations'] as const,
}

export function useGenerateText() {
  return useMutation({
    mutationFn: (data: GenerateTextReq) => creationsApi.generateText(data),
  })
}

export function useGenerateImage() {
  return useMutation({
    mutationFn: (data: GenerateImageReq) => creationsApi.generateImage(data),
  })
}

export function useOcr() {
  return useMutation({
    mutationFn: (data: OcrReq) => creationsApi.ocr(data),
  })
}

export function useGeneratePoster() {
  return useMutation({
    mutationFn: ({ data, file }: { data: GeneratePosterReq; file?: File }) =>
      creationsApi.generatePoster(data, file),
    onError: (error: Error) => {
      toast.error(error.message || '海报生成失败')
    },
  })
}
```

**Step 2: Verify types compile**

Run: `pnpm build`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add src/features/creations/hooks/index.ts
git commit -m "feat: add useGeneratePoster mutation hook"
```

---

### Task 4: Refactor PosterTool to use real API hook

**Files:**
- Modify: `src/features/creations/components/PosterTool.tsx:265-407`

**Step 1: Add imports and wire up the hook**

Replace the `PosterTool` component function. The key changes:
- Import and call `useGeneratePoster` hook
- Store the selected `File` object in state (not just the preview URL)
- Replace `handleGenerate` mock with real API call via `mutateAsync`
- Handle error state from the mutation
- Pass `file` alongside config params

Full replacement for `PosterTool` function (starting at line 265):

```tsx
export function PosterTool({ onBack }: PosterToolProps) {
  const [config, setConfig] = useState<PosterConfig>({
    aspectRatio: '9:16',
    colorTone: colorTones[0].color,
    style: 'cyberpunk',
  })
  const [prompt, setPrompt] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generatePoster = useGeneratePoster()

  const isGenerating = generatePoster.isPending

  const validateFile = (f: File): boolean => {
    const validTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (!validTypes.includes(f.type)) {
      toast.error('仅支持 PNG, JPG, WebP 格式')
      return false
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error('文件大小不能超过 10MB')
      return false
    }
    return true
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!validateFile(f)) return

    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
    setResultUrl(null)
  }

  const handleDelete = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setResultUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('请输入提示词')
      return
    }

    setResultUrl(null)

    try {
      const result = await generatePoster.mutateAsync({
        data: {
          prompt: prompt.trim(),
          aspectRatio: config.aspectRatio,
          colorTone: config.colorTone,
          style: config.style,
        },
        file: file ?? undefined,
      })
      setResultUrl(result.imageUrl)
      toast.success('海报生成完成')
    } catch {
      // Error toast handled by hook onError
    }
  }

  const handleDownload = () => {
    if (!resultUrl) return
    const a = document.createElement('a')
    a.href = resultUrl
    a.download = 'poster.png'
    a.click()
  }

  const handleShare = () => {
    toast.info('分享功能开发中')
  }

  return (
    <div className='flex-1 flex flex-col px-8'>
      <ToolHeader title='海报创作' icon={Image} onBack={onBack} />

      <p className='text-muted-foreground text-sm leading-relaxed -mt-4 mb-8'>
        利用AI算力构建视觉创意。输入创意描述，配置参数，即刻获取高清专业级海报。
      </p>

      {/* Bento Grid */}
      <div className='grid grid-cols-12 gap-8 items-start'>
        {/* Left Config Panel */}
        <div className='col-span-12 lg:col-span-4'>
          <PosterConfigPanel
            config={config}
            onConfigChange={setConfig}
            prompt={prompt}
            onPromptChange={setPrompt}
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onDelete={handleDelete}
            fileInputRef={fileInputRef}
          />
        </div>

        {/* Right Preview & Actions */}
        <div className='col-span-12 lg:col-span-8 space-y-6'>
          <PosterPreview isGenerating={isGenerating} resultUrl={resultUrl} />

          {/* Actions */}
          <div className='flex flex-wrap gap-4 items-center'>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className='flex-1 bg-primary text-primary-foreground py-4 rounded-xl font-sans font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all'
            >
              <Bolt className='w-5 h-5' />
              {isGenerating ? '生成中...' : '开始生成'}
            </Button>
            <div className='flex gap-4 w-full sm:w-auto'>
              <Button
                variant='outline'
                disabled={!resultUrl}
                onClick={handleDownload}
                className='flex-1 sm:flex-none px-8 py-4 bg-surface-container-high border-border/20 text-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted'
              >
                <Download className='w-5 h-5' />
                下载
              </Button>
              <Button
                variant='outline'
                disabled={!resultUrl}
                onClick={handleShare}
                className='flex-1 sm:flex-none px-8 py-4 bg-surface-container-high border-border/20 text-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted'
              >
                <Share className='w-5 h-5' />
                分享
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify types compile**

Run: `pnpm build`
Expected: Build succeeds.

**Step 3: Lint check**

Run: `pnpm lint`
Expected: No errors.

**Step 4: Commit**

```bash
git add src/features/creations/components/PosterTool.tsx
git commit -m "feat: integrate PosterTool with real API via useGeneratePoster hook"
```

---

### Task 5: Verify full build and lint

**Files:**
- None (verification only)

**Step 1: Run full build**

Run: `pnpm build`
Expected: Build completes successfully with no type errors or warnings.

**Step 2: Run lint**

Run: `pnpm lint`
Expected: No lint errors.

**Step 3: Verify FSD compliance**

Check that:
- `PosterTool.tsx` does NOT import from `@/lib/api` directly (uses hook)
- `creations/hooks/index.ts` imports from `../api` (same feature layer)
- `creations/api.ts` imports from `@/lib/api` (lib is lower layer, OK)
- No cross-feature imports exist
- No `any` types used

**Step 4: Commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: lint/type fixes for poster tool integration"
```

---

### Summary of Changes

| File | Change |
|------|--------|
| `src/features/creations/types.ts` | Add `GeneratePosterReq`, `GeneratePosterResp` |
| `src/features/creations/api.ts` | Add `generatePoster` with FormData upload |
| `src/features/creations/hooks/index.ts` | Add `useGeneratePoster` mutation hook |
| `src/features/creations/components/PosterTool.tsx` | Replace mock with real API hook, add `file` state |

**Data flow:** `PosterTool` → `useGeneratePoster` → `creationsApi.generatePoster` → `apiClient.post('creations/poster', FormData)` → Backend

**FSD compliance:** All layers respected. Components → Hooks → API → lib. No cross-feature imports. No server data in Zustand.
