# Creations Tools Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete functionality for TextTool, PosterTool, and OcrTool with mock interfaces, fix FSD violations, and verify via browser testing.

**Architecture:** Component → Hook → API → Mock. All tools follow the same FSD pattern. OcrTool currently violates FSD by calling `apiClient` directly - fix by routing through `useOcr` hook.

**Tech Stack:** TypeScript, React, TanStack Query, MSW (mocks), sonner (toast), Tailwind CSS

---

## File Structure

| File | Responsibility |
|------|----------------|
| `src/features/creations/types.ts` | Type definitions for API requests/responses |
| `src/features/creations/api.ts` | HTTP requests with FormData support for OCR |
| `src/features/creations/hooks/index.ts` | TanStack mutations with error handling |
| `src/features/creations/components/OcrTool.tsx` | OCR UI using hook (fix FSD violation) |
| `src/mocks/handlers/creations.ts` | MSW handlers with error scenarios |

---

### Task 1: Update OcrReq type to support file upload

**Files:**
- Modify: `src/features/creations/types.ts:21-24`

- [ ] **Step 1: Update OcrReq interface**

Change from:
```ts
export interface OcrReq {
  imageUrl: string
}
```

To:
```ts
export interface OcrReq {
  imageUrl?: string
  file?: File
}
```

- [ ] **Step 2: Verify types compile**

Run: `pnpm build`
Expected: Build succeeds with no type errors.

- [ ] **Step 3: Commit**

```bash
git add src/features/creations/types.ts
git commit -m "feat(creations): add file upload support to OcrReq type"
```

---

### Task 2: Update ocr API to support FormData upload

**Files:**
- Modify: `src/features/creations/api.ts:18`

- [ ] **Step 1: Add apiClient import**

Add `apiClient` to the import at line 1:
```ts
import api, { apiClient, unwrap } from '@/lib/api'
```

- [ ] **Step 2: Replace ocr method**

Replace the ocr method at line 18:
```ts
ocr: async (data: OcrReq): Promise<OcrResp> => {
  if (!data.file && !data.imageUrl) {
    throw new Error('请上传文件或提供图片地址')
  }

  if (data.file) {
    const formData = new FormData()
    formData.append('file', data.file)
    if (data.imageUrl) formData.append('imageUrl', data.imageUrl)
    const res = await apiClient.post('creations/ocr', { body: formData })
    return unwrap<OcrResp>(res)
  }

  const res = await apiClient.post('creations/ocr', { json: { imageUrl: data.imageUrl } })
  return unwrap<OcrResp>(res)
},
```

- [ ] **Step 3: Verify types compile**

Run: `pnpm build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/features/creations/api.ts
git commit -m "feat(creations): add FormData upload support to ocr API"
```

---

### Task 3: Add error handling to hooks

**Files:**
- Modify: `src/features/creations/hooks/index.ts:10-26`

- [ ] **Step 1: Update useGenerateText hook**

Replace `useGenerateText` (lines 10-13):
```ts
export function useGenerateText() {
  return useMutation({
    mutationFn: (data: GenerateTextReq) => creationsApi.generateText(data),
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : '文案生成失败'
      toast.error(message)
    },
  })
}
```

- [ ] **Step 2: Update useGenerateImage hook**

Replace `useGenerateImage` (lines 16-19):
```ts
export function useGenerateImage() {
  return useMutation({
    mutationFn: (data: GenerateImageReq) => creationsApi.generateImage(data),
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : '图片生成失败'
      toast.error(message)
    },
  })
}
```

- [ ] **Step 3: Update useOcr hook**

Replace `useOcr` (lines 22-25):
```ts
export function useOcr() {
  return useMutation({
    mutationFn: (data: OcrReq) => creationsApi.ocr(data),
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : '文字提取失败'
      toast.error(message)
    },
  })
}
```

- [ ] **Step 4: Update OcrReq import**

Update import at line 4 to include the new OcrReq type usage (no change needed if already imported correctly).

- [ ] **Step 5: Verify types compile**

Run: `pnpm build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/features/creations/hooks/index.ts
git commit -m "feat(creations): add onError toast handling to all mutation hooks"
```

---

### Task 4: Refactor OcrTool to use useOcr hook

**Files:**
- Modify: `src/features/creations/components/OcrTool.tsx`

- [ ] **Step 1: Update imports**

Remove `apiClient` and `unwrap` from imports (line 4):
```ts
// Remove: import { apiClient, unwrap } from '@/lib/api'
// Keep: import { cn } from '@/lib/utils'
```

Add `useOcr` import:
```ts
import { useOcr } from '../hooks'
```

Full updated imports (lines 1-8):
```ts
import { Copy, Download, FileUp, ScanText } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { useOcr } from '../hooks'
import { ToolHeader } from './ToolGrid'
```

Remove the OcrResp type import (no longer needed in component):
```ts
// Remove: import type { OcrResp } from '../types'
```

- [ ] **Step 2: Replace component state and hook usage**

Replace lines 14-19:
```ts
export function OcrTool({ onBack }: OcrToolProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ocr = useOcr()
  const isProcessing = ocr.isPending
```

- [ ] **Step 3: Refactor handleFile callback**

Replace the `handleFile` function (lines 21-53):
```ts
const handleFile = useCallback(async (f: File) => {
  if (!f.type.startsWith('image/') && f.type !== 'application/pdf') {
    toast.error('仅支持 JPG、PNG、PDF 格式')
    return
  }
  if (f.size > 20 * 1024 * 1024) {
    toast.error('文件大小不能超过 20MB')
    return
  }

  setFile(f)
  setResult(null)

  const objectUrl = URL.createObjectURL(f)
  if (f.type.startsWith('image/')) {
    setPreviewUrl(objectUrl)
  } else {
    setPreviewUrl(null)
  }

  try {
    const data = await ocr.mutateAsync({ file: f })
    setResult(data.text)
    toast.success('文字提取完成')
  } catch {
    // Error handled by hook onError
  }
}, [ocr])
```

- [ ] **Step 4: Verify types compile**

Run: `pnpm build`
Expected: Build succeeds.

- [ ] **Step 5: Lint check**

Run: `pnpm lint`
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/features/creations/components/OcrTool.tsx
git commit -m "refactor(creations): use useOcr hook in OcrTool (fix FSD violation)"
```

---

### Task 5: Update mock handlers with error scenarios

**Files:**
- Modify: `src/mocks/handlers/creations.ts`

- [ ] **Step 1: Add random failure helper**

Add after line 14 (after `success` function):
```ts
const shouldFailRandomly = () => Math.random() < 0.1
```

- [ ] **Step 2: Update text handler with validation and error scenarios**

Replace the text handler (lines 17-28):
```ts
http.post<never, { prompt: string }, ApiResponse<GenerateTextResp>>(
  `${API_BASE}/creations/text`,
  async ({ request }) => {
    await delay(1500 + Math.random() * 1000)
    const { prompt } = await request.json()

    if (!prompt?.trim()) {
      return HttpResponse.json(
        { code: 400, message: '请输入提示词', data: null },
        { status: 400 }
      )
    }

    if (shouldFailRandomly()) {
      return HttpResponse.json(
        { code: 500, message: '服务暂时不可用，请重试', data: null },
        { status: 500 }
      )
    }

    return HttpResponse.json(
      success({
        content: `【产品核心文案】

基于您的输入: "${prompt}"

在瞬息万变的数字时代，我们重新定义了智能交互的边界。这不仅仅是一款产品，更是一次对未来生活方式的大胆预演。

【核心卖点】
• 零延迟响应，毫秒级处理能力
• 跨平台无缝同步，随时随地保持连接
• AI 驱动的个性化推荐引擎

【行动号召】
立即体验未来科技，开启您的智能生活新篇章。限量首发，尊享早鸟优惠。`,
      })
    )
  }
),
```

- [ ] **Step 3: Update image handler with validation and error scenarios**

Replace the image handler (lines 31-47):
```ts
http.post<
  never,
  { prompt: string; aspectRatio: string; engine?: string },
  ApiResponse<GenerateImageResp>
>(`${API_BASE}/creations/image`, async ({ request }) => {
  await delay(2000)
  const { prompt, aspectRatio } = await request.json()

  if (!prompt?.trim()) {
    return HttpResponse.json(
      { code: 400, message: '请输入提示词', data: null },
      { status: 400 }
    )
  }

  if (shouldFailRandomly()) {
    return HttpResponse.json(
      { code: 500, message: '服务暂时不可用，请重试', data: null },
      { status: 500 }
    )
  }

  const [w, h] = aspectRatio.split(':').map(Number)
  const width = 400
  const height = Math.round((width * h) / w)

  return HttpResponse.json(
    success({
      imageUrl: `https://picsum.photos/${width}/${height}?random=${Date.now()}`,
    })
  )
}),
```

- [ ] **Step 4: Update OCR handler for FormData support**

Replace the OCR handler (lines 49-61):
```ts
http.post<never, never, ApiResponse<OcrResp>>(
  `${API_BASE}/creations/ocr`,
  async ({ request }) => {
    await delay(1500)

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null

      if (!file) {
        return HttpResponse.json(
          { code: 400, message: '请上传文件', data: null },
          { status: 400 }
        )
      }

      return HttpResponse.json(
        success({
          text: `项目名称：极光边缘计算节点架构设计 (Project Aurora-Edge)

核心目标：构建可大规模部署的合成智能网络，实现低延迟数据提取与自动标注。

硬件需求：
  - Lumina NPU 系列核心处理器 x4
  - 高带宽内存存储系统 (64GB HBM3)
  - 超导液冷散热阵列

合规性：符合 ISO/IEC 42001 人工智能管理体系标准。

此文档包含机密数据，仅供内部架构委员会审阅。未经授权禁止分发或进行逆向工程分析。`,
          confidence: 0.97,
        })
      )
    }

    // JSON body path
    const { imageUrl } = await request.json<{ imageUrl?: string }>()

    if (!imageUrl) {
      return HttpResponse.json(
        { code: 400, message: '请提供图片地址', data: null },
        { status: 400 }
      )
    }

    if (shouldFailRandomly()) {
      return HttpResponse.json(
        { code: 500, message: '服务暂时不可用，请重试', data: null },
        { status: 500 }
      )
    }

    return HttpResponse.json(
      success({
        text: `项目名称：极光边缘计算节点架构设计 (Project Aurora-Edge)

核心目标：构建可大规模部署的合成智能网络，实现低延迟数据提取与自动标注。

硬件需求：
  - Lumina NPU 系列核心处理器 x4
  - 高带宽内存存储系统 (64GB HBM3)
  - 超导液冷散热阵列

合规性：符合 ISO/IEC 42001 人工智能管理体系标准。

此文档包含机密数据，仅供内部架构委员会审阅。未经授权禁止分发或进行逆向工程分析。`,
        confidence: 0.97,
      })
    )
  }
),
```

- [ ] **Step 5: Update poster handler with validation and error scenarios**

Replace the poster handler (lines 63-92):
```ts
http.post<never, never, ApiResponse<GeneratePosterResp>>(
  `${API_BASE}/creations/poster`,
  async ({ request }) => {
    await delay(2500)
    const formData = await request.formData()
    const prompt = formData.get('prompt') as string
    const aspectRatio = formData.get('aspectRatio') as string
    const colorTone = formData.get('colorTone') as string
    const style = formData.get('style') as string
    const file = formData.get('file') as File | null

    console.log('[Mock] Poster generation:', {
      prompt,
      aspectRatio,
      colorTone,
      style,
      hasFile: !!file,
    })

    if (!prompt?.trim()) {
      return HttpResponse.json(
        { code: 400, message: '请输入提示词', data: null },
        { status: 400 }
      )
    }

    if (shouldFailRandomly()) {
      return HttpResponse.json(
        { code: 500, message: '服务暂时不可用，请重试', data: null },
        { status: 500 }
      )
    }

    const [w, h] = aspectRatio.split(':').map(Number)
    const width = 400
    const height = Math.round((width * h) / w)

    return HttpResponse.json(
      success({
        imageUrl: `https://picsum.photos/${width}/${height}?random=${Date.now()}`,
      })
    )
  }
),
```

- [ ] **Step 6: Verify types compile**

Run: `pnpm build`
Expected: Build succeeds.

- [ ] **Step 7: Lint check**

Run: `pnpm lint`
Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add src/mocks/handlers/creations.ts
git commit -m "feat(mocks): add error scenarios and FormData support to creations handlers"
```

---

### Task 6: Run full verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run full build**

Run: `pnpm build`
Expected: Build completes successfully with no type errors.

- [ ] **Step 2: Run lint**

Run: `pnpm lint`
Expected: No lint errors.

- [ ] **Step 3: Verify FSD compliance**

Check that:
- `OcrTool.tsx` does NOT import from `@/lib/api` directly (uses hook)
- `creations/hooks/index.ts` imports from `../api` (same feature layer)
- `creations/api.ts` imports from `@/lib/api` (lib is lower layer, OK)
- No cross-feature imports exist
- No `any` types used

---

### Task 7: Browser testing with agent-browser

**Files:**
- None (testing only)

- [ ] **Step 1: Start dev server**

Run: `pnpm dev`
Wait for server to be ready at `http://localhost:5173`

- [ ] **Step 2: Test TextTool flow**

Navigate to creations page → select 营销文案 tool:
1. Click "开始生成" with empty form → verify error toast "请输入产品描述"
2. Fill in product description → click "开始生成" → verify loading state → verify content appears
3. Click copy button → verify "已复制到剪贴板" toast

- [ ] **Step 3: Test PosterTool flow**

Navigate back → select 海报创作 tool:
1. Verify "开始生成" button is disabled when prompt is empty
2. Fill in prompt → click "开始生成" → verify loading → verify image appears
3. Click on image → verify modal opens with full-size image
4. Click download button → verify file downloads

- [ ] **Step 4: Test OcrTool flow**

Navigate back → select 图片文字提取 tool:
1. Drag or select an image file → verify loading → verify extracted text appears
2. Select invalid file type (e.g., .txt) → verify error toast
3. Click copy button → verify "已复制到剪贴板" toast

- [ ] **Step 5: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: any fixes from browser testing"
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/features/creations/types.ts` | Add `file?: File` to `OcrReq` |
| `src/features/creations/api.ts` | Update `ocr` to support FormData upload |
| `src/features/creations/hooks/index.ts` | Add `onError` to `useGenerateText`, `useGenerateImage`, `useOcr` |
| `src/features/creations/components/OcrTool.tsx` | Refactor to use `useOcr` hook |
| `src/mocks/handlers/creations.ts` | Add error scenarios, update OCR for FormData |

**Data flow:** `OcrTool` → `useOcr` → `creationsApi.ocr` → `apiClient.post('creations/ocr')` → Mock

**FSD Compliance:** All layers respected. Components → Hooks → API → lib. No cross-feature imports.