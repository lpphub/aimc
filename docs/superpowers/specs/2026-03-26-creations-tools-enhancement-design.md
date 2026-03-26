# Creations Tools Enhancement Design

> **Goal:** Complete functionality for TextTool, PosterTool, and OcrTool with mock interfaces, fix FSD violations, and verify via browser testing.

## Architecture Overview

**Data Flow (FSD Compliant):**

```
Component → Hook → API → Mock/Backend
```

All three tools follow the same pattern:

| Layer | File | Responsibility |
|-------|------|----------------|
| Component | `*Tool.tsx` | UI state, user interactions, render |
| Hook | `hooks/index.ts` | TanStack mutation, error/success handling |
| API | `api.ts` | HTTP request, response unwrapping |
| Mock | `mocks/handlers/creations.ts` | MSW handlers with delays |

**Key Changes:**
- `TextTool`: Hook gets `onError` toast (no component change needed)
- `PosterTool`: Already complete ✓ (download uses `fetch` + `blob`)
- `OcrTool`: Component uses `useOcr` hook; API supports FormData upload

## Hook Layer Changes

**Goal:** All hooks have consistent error handling with toast notifications.

**Current state:**
- `useGenerateText` - no error handling
- `useGenerateImage` - no error handling
- `useOcr` - no error handling
- `useGeneratePoster` - has `onError` with toast ✓

**Changes to `hooks/index.ts`:**

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

export function useGenerateImage() {
  return useMutation({
    mutationFn: (data: GenerateImageReq) => creationsApi.generateImage(data),
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : '图片生成失败'
      toast.error(message)
    },
  })
}

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

## API Layer Changes

**Goal:** OcrTool needs FormData upload for file-based OCR.

**Changes to `types.ts`:**

```ts
export interface OcrReq {
  imageUrl?: string  // Optional: remote URL
  file?: File        // Optional: local file upload
}
```

**Changes to `api.ts`:**

```ts
ocr: async (data: OcrReq): Promise<OcrResp> => {
  if (data.file) {
    // FormData upload for local files
    const formData = new FormData()
    formData.append('file', data.file)
    if (data.imageUrl) formData.append('imageUrl', data.imageUrl)
    const res = await apiClient.post('creations/ocr', { body: formData })
    return unwrap<OcrResp>(res)
  }
  // JSON body for URL-based OCR
  return api.post<OcrResp>('creations/ocr', { imageUrl: data.imageUrl })
}
```

**Hook signature (consistent with other hooks):**
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

## Component Layer Changes

### TextTool

**Change:** None in component - hook now handles error toast automatically.

### PosterTool

**Change:** None - already complete. Download uses `fetch` + `blob` for cross-origin images.

### OcrTool

**Change:** Refactor to use `useOcr` hook instead of direct `apiClient` call.

**Why:** Current implementation violates FSD by calling `apiClient` directly in component. Should go through hook layer.

```ts
// Remove direct apiClient import
// Add hook usage
const ocr = useOcr()
const isProcessing = ocr.isPending

// Replace handleFile logic
const handleFile = async (f: File) => {
  // validation...
  setFile(f)
  setPreviewUrl(objectUrl)

  try {
    const result = await ocr.mutateAsync({ file: f })
    setResult(result.text)
    toast.success('文字提取完成')
  } catch {
    // Error handled by hook onError
  }
}
```

## Mock Layer Changes

**Goal:** Realistic E2E simulation with error scenarios.

**Enhanced handlers for all endpoints:**

| Scenario | Behavior |
|----------|----------|
| Happy path | Realistic delay (1.5-2.5s), valid response |
| Empty input | 400 error, "请输入提示词" message |
| Random failure | 10% chance of 500 error (configurable) |

**Mock implementation pattern:**

```ts
const shouldFailRandomly = () => Math.random() < 0.1

http.post(`${API_BASE}/creations/text`, async ({ request }) => {
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

  return HttpResponse.json(success({ content: '...' }))
})
```

**OCR mock update:** Support both FormData and JSON body.

```ts
http.post(`${API_BASE}/creations/ocr`, async ({ request }) => {
  await delay(1500)

  let file: File | null = null

  const contentType = request.headers.get('content-type') || ''
  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData()
    file = formData.get('file') as File | null
  }

  if (!file) {
    return HttpResponse.json(
      { code: 400, message: '请上传文件', data: null },
      { status: 400 }
    )
  }

  return HttpResponse.json(success({ text: '...', confidence: 0.97 }))
})
```

## Browser Test Scenarios

After implementation, verify with agent-browser:

1. **TextTool**
   - Submit empty form → see "请输入提示词" error
   - Submit valid form → see loading spinner → see generated content
   - Copy button works

2. **PosterTool**
   - Submit without prompt → button disabled
   - Submit with prompt → see loading → see generated image
   - Click image → modal opens
   - Download button → file downloads successfully

3. **OcrTool**
   - Drag/drop or select file → see loading → see extracted text
   - Invalid file type → see error toast
   - Copy button works

## Summary of Changes

| File | Change |
|------|--------|
| `src/features/creations/types.ts` | Add `file?: File` to `OcrReq` |
| `src/features/creations/hooks/index.ts` | Add `onError` to `useGenerateText`, `useGenerateImage`, `useOcr` |
| `src/features/creations/api.ts` | Update `ocr` to support FormData upload |
| `src/features/creations/components/OcrTool.tsx` | Refactor to use `useOcr` hook |
| `src/mocks/handlers/creations.ts` | Add error scenarios, update OCR for FormData |

**FSD Compliance:** All layers respected. Components → Hooks → API → lib. No cross-feature imports. No server data in Zustand.