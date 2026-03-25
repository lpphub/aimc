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

## 文件变更

| 文件 | 变更 |
|------|------|
| `src/features/creations/components/PosterTool.tsx` | 添加上传预览、结果展示、抽取 PosterPreview 组件 |

## 不在范围内

- 图片编辑功能（裁剪、调整）
- 多版本生成展示
- 历史记录面板
- 分享功能的具体实现