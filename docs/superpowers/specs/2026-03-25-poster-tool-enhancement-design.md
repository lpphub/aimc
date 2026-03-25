# PosterTool 功能增强设计

日期：2026-03-25

## 概述

完善 `PosterTool` 组件的上传交互和生成结果展示功能。

## 需求

| 功能 | 方案 |
|------|------|
| 上传交互 | 选择文件后显示图片预览，支持删除清除 |
| 加载状态 | 简单加载动画，无百分比进度 |
| 结果展示 | 单图展示，显示返回的图片 URL |
| 下载功能 | 直接下载返回的 URL |

## 状态管理

新增以下状态：

```typescript
// 上传相关
const [uploadedFile, setUploadedFile] = useState<File | null>(null)
const [previewUrl, setPreviewUrl] = useState<string | null>(null)

// 生成结果
const [resultUrl, setResultUrl] = useState<string | null>(null)
```

移除 `progress` 状态。

## 上传交互

**选择前：**
- 显示虚线边框上传区域 + Plus 图标 + 提示文字

**选择后：**
- 隐藏上传区域
- 显示图片预览（居中、限制最大尺寸）
- 右上角显示删除按钮（点击清除选择）

**交互逻辑：**
1. 点击上传区域 → 触发文件选择
2. 选择文件后 → 生成预览 URL（`URL.createObjectURL`），存储文件
3. 点击删除按钮 → 清除文件和预览

## 生成结果展示

**生成中：**
- 显示加载动画（Spinner 或脉冲效果）

**生成完成后：**
- 预览区显示返回的图片（使用 `resultUrl`）
- 图片自适应容器，保持比例
- 保留四角装饰线

**操作按钮：**
- 下载按钮：点击触发下载 `resultUrl`
- 分享按钮：保持现有设计

## 组件结构

将预览区抽取为同文件内组件：

```typescript
interface PosterPreviewProps {
  isGenerating: boolean
  previewUrl: string | null
  resultUrl: string | null
  onDownload: () => void
  onShare: () => void
}

function PosterPreview({
  isGenerating,
  previewUrl,
  resultUrl,
  onDownload,
  onShare
}: PosterPreviewProps) {
  // 渲染逻辑：
  // 1. 生成中 → 加载动画
  // 2. 有结果 → 显示图片
  // 3. 有预览 → 显示预览图
  // 4. 默认 → 空状态提示
}
```

主组件 `PosterTool` 负责状态管理和事件处理，`PosterPreview` 负责 UI 渲染。

## 文件验证

上传前验证文件：
- 支持格式：PNG, JPG, WebP（MIME: `image/png`, `image/jpeg`, `image/webp`）
- 最大文件：10MB
- 验证失败 → `toast.error('提示信息')`

```typescript
const validateFile = (file: File): boolean => {
  const validTypes = ['image/png', 'image/jpeg', 'image/webp']
  if (!validTypes.includes(file.type)) {
    toast.error('仅支持 PNG, JPG, WebP 格式')
    return false
  }
  if (file.size > 10 * 1024 * 1024) {
    toast.error('文件大小不能超过 10MB')
    return false
  }
  return true
}
```

## 错误处理

| 场景 | 处理 |
|------|------|
| 文件类型错误 | toast.error 提示，不更新状态 |
| 文件过大 | toast.error 提示，不更新状态 |
| 生成失败 | toast.error 提示，重置为预览状态 |

## 内存管理

预览 URL 使用 `URL.createObjectURL` 创建，需要在组件卸载或文件清除时释放：

```typescript
useEffect(() => {
  return () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }
}, [previewUrl])
```

## 状态转换

| 操作 | 状态变化 |
|------|----------|
| 选择新文件（无结果） | 设置 previewUrl、uploadedFile |
| 选择新文件（有结果） | 清除 resultUrl，设置新 previewUrl |
| 点击删除 | 清除 previewUrl、uploadedFile、resultUrl |
| 生成完成 | 设置 resultUrl |
| 生成失败 | 重置为预览状态（保留 previewUrl） |

## 删除按钮样式

- 位置：预览图右上角
- 样式：圆形背景 `bg-background/80`，`w-8 h-8`
- 图标：`X` (lucide-react)
- 交互：hover 放大，点击缩小动画

## 下载实现

```typescript
const handleDownload = () => {
  if (!resultUrl) return
  const a = document.createElement('a')
  a.href = resultUrl
  a.download = 'poster.png'
  a.click()
}
```

## 预览图尺寸

- 最大宽度：100%（容器宽度）
- 最大高度：100%（容器高度）
- 保持原始宽高比（`object-contain`）

## 文件变更

| 文件 | 变更 |
|------|------|
| `src/features/creations/components/PosterTool.tsx` | 添加上传预览、结果展示、抽取 PosterPreview 组件 |

## 不在范围内

- 图片编辑功能（裁剪、调整）
- 多版本生成展示
- 历史记录面板
- 分享功能的具体实现
- API 集成（使用现有 mock 流程）