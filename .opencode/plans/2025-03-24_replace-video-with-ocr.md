# AI 视频 → 图片 OCR 替换计划

## 目标

删除 AI 视频工具，替换为图片 OCR 文字提取工具，按照用户提供的 OCR 页面设计实现。

## 设计要点（来自参考设计）

- **双栏布局**（左 7 / 右 5）：左侧上传区 + 状态栏，右侧结果面板
- **上传区**：拖拽/点击上传，支持 JPG/PNG/PDF，虚线边框 + 云上传图标
- **状态栏**：引擎状态 + AI 置信度进度条
- **结果面板**：行号 + 文本内容，hover 高亮，复制/下载按钮
- **底部**：导出结构化数据按钮
- **扫描线动画**：处理时的扫描效果

## 变更清单

### 1. `src/shared/types/work.ts`

- `WorkType` 新增 `'ocr'`（替换 `'video'`）
- `Template.type` 和 `CreationRecord.type` 中 `'video'` → `'ocr'`

```ts
export type WorkType = 'text' | 'image' | 'ocr'
```

### 2. `src/features/creations/types.ts`

- 删除 `GenerateVideoReq` / `GenerateVideoResp`
- 新增 OCR 类型：

```ts
export interface OcrReq {
  imageUrl: string
}

export interface OcrResp {
  text: string
  confidence: number
}
```

### 3. `src/features/creations/api.ts`

- 删除 `generateVideo` 端点
- 新增 `ocr` 端点

### 4. `src/features/creations/hooks/index.ts`

- 删除 `useGenerateVideo`
- 新增 `useOcr`（上传图片后调用 OCR API）

### 5. 删除 `src/features/creations/components/VideoTool.tsx`

### 6. 新建 `src/features/creations/components/OcrTool.tsx`

按参考设计实现，结构如下：

```
OcrTool
├── ToolHeader (title="图片文字提取", icon=ScanText)
└── flex gap-8 flex-1
    ├── 左侧 col-span-7
    │   ├── 上传区域 (虚线边框, 云上传图标, 拖拽/点击)
    │   └── 状态栏 (引擎状态 + 置信度进度条)
    └── 右侧 col-span-5
        ├── 结果面板头部 (复制/下载按钮)
        ├── 文本内容区 (行号 + hover 高亮 + custom-scrollbar)
        └── 底部 (导出按钮)
```

**上传交互**：
- 点击按钮触发 `<input type="file">`
- 支持拖拽 `onDragOver` / `onDrop`
- 上传后显示扫描线动画，模拟处理
- 调用 OCR API（当前 mock 返回示例文本）
- 展示提取结果，支持复制到剪贴板

**样式**：全部用 Tailwind v4 类名，复用项目已有 token。

### 7. `src/features/creations/components/ToolGrid.tsx`

- 导入替换：`Video` → `ScanText`（lucide-react）
- 工具卡片数据：video → ocr

```ts
{
  id: 'ocr',
  type: 'ocr',
  title: '图片文字提取',
  description: '精准识别并提取素材文字',
  label: 'Data Perception',
  icon: ScanText,
  accent: 'secondary',
}
```

### 8. `src/features/creations/components/CreationsPage.tsx`

- 删除 `VideoTool` import
- 新增 `OcrTool` import
- 条件分支 `'video'` → `'ocr'`，渲染 `<OcrTool>`

### 9. `src/features/creations/components/index.ts`

- `VideoTool` → `OcrTool`

### 10. `src/features/creations/index.ts`

- `VideoTool` → `OcrTool`

## 验证

1. `npx biome check src/` — 无 lint 错误
2. `pnpm build` — 构建通过
