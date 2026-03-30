# Canvas Item 操作栏设计

**日期**: 2026-03-30

## 目标

在画布上选中 item 时，显示操作栏，支持删除和下载功能。

## 设计决策

### 位置
选中项内部顶部，半透明深色背景覆盖图片顶部区域。

### 按钮样式
图标 + 文字组合，白色文字，hover 时有背景高亮反馈。

## 实现方案

### 修改 CanvasItem 组件

在 `CanvasItem.tsx` 中，选中状态时渲染操作栏:

```tsx
// 选中时显示操作栏
{isSelected && tool === 'select' && (
  <div className="absolute top-0 left-0 right-0 bg-black/60 rounded-t-md p-1.5 flex gap-2 justify-center z-10">
    <button
      className="text-white text-xs hover:bg-white/20 rounded px-2 py-0.5 transition-colors"
      onClick={(e) => {
        e.stopPropagation()
        onDelete(item.id)
      }}
    >
      🗑️ 删除
    </button>
    <button
      className="text-white text-xs hover:bg-white/20 rounded px-2 py-0.5 transition-colors"
      onClick={(e) => {
        e.stopPropagation()
        onDownload(item.imageUrl)
      }}
    >
      ⬇️ 下载
    </button>
  </div>
)}
```

### Props 扩展

CanvasItem 需要新增两个回调:

```tsx
interface CanvasItemProps {
  // ... existing props
  onDelete: (id: string) => void
  onDownload: (imageUrl: string) => void
}
```

### Hook 扩展

`useCanvas.ts` 新增下载处理函数:

```tsx
const handleDownload = useCallback((imageUrl: string) => {
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = `canvas-item-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}, [])
```

### Canvas 组件传递回调

`Canvas.tsx` 从 hook 获取 `removeItem` 和 `handleDownload`，传递给 CanvasItem。

## 交互行为

| 操作 | 效果 |
|------|------|
| 点击删除 | 移除 item，自动取消选中 |
| 点击下载 | 下载图片到本地 |
| 点击操作栏外区域 | 不触发选中/取消选中（已通过 stopPropagation 处理） |

## 文件变更

| 文件 | 变更 |
|------|------|
| `CanvasItem.tsx` | 新增操作栏渲染，扩展 props |
| `Canvas.tsx` | 传递 onDelete 和 onDownload 回调 |
| `useCanvas.ts` | 新增 handleDownload 函数 |

## 不做

- 不添加更多操作按钮（后续可扩展）
- 不添加操作栏动画（保持简单）
- 不处理图片跨域下载限制（假设同源或已配置 CORS）