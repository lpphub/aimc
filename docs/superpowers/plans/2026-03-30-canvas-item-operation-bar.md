# Canvas Item 操作栏实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在画布选中 item 时显示操作栏，支持删除和下载

**Architecture:** 在 CanvasItem 内部顶部渲染操作栏，通过 props 接收回调函数，hook 层提供下载处理

**Tech Stack:** React, Tailwind CSS, Zustand

---

## 文件结构

| 文件 | 变更类型 | 职责 |
|------|----------|------|
| `src/features/generator/hooks/useCanvas.ts` | 修改 | 新增 handleDownload 函数 |
| `src/features/generator/components/CanvasItem.tsx` | 修改 | 新增操作栏渲染和 props |
| `src/features/generator/components/Canvas.tsx` | 修改 | 传递回调给 CanvasItem |

---

### Task 1: useCanvas 新增下载函数

**Files:**
- Modify: `src/features/generator/hooks/useCanvas.ts`

- [ ] **Step 1: 新增 handleDownload 函数**

在 `useCanvas.ts` 中添加下载处理函数:

```typescript
const handleDownload = useCallback((imageUrl: string) => {
  const link = document.createElement('a')
  link.href = imageUrl
  link.download = `canvas-item-${Date.now()}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}, [])
```

- [ ] **Step 2: 在 return 中导出 handleDownload**

修改 return 对象:

```typescript
return {
  items,
  selectedId,
  handleAddImage,
  handleDrag,
  selectItem,
  removeItem,
  handleDownload, // 新增
}
```

- [ ] **Step 3: 验证构建通过**

Run: `pnpm build`
Expected: PASS (无类型错误)

- [ ] **Step 4: Commit**

```bash
git add src/features/generator/hooks/useCanvas.ts
git commit -m "feat(generator): add handleDownload to useCanvas hook"
```

---

### Task 2: CanvasItem 新增操作栏

**Files:**
- Modify: `src/features/generator/components/CanvasItem.tsx`

- [ ] **Step 1: 扩展 CanvasItemProps 接口**

添加两个回调 props:

```typescript
interface CanvasItemProps {
  item: CanvasItemType
  isSelected: boolean
  onDrag: (id: string, x: number, y: number) => void
  onSelect: (id: string) => void
  tool?: 'select' | 'hand'
  onDelete: (id: string) => void // 新增
  onDownload: (imageUrl: string) => void // 新增
}
```

- [ ] **Step 2: 更新组件参数解构**

```typescript
export const CanvasItem = memo(function CanvasItem({
  item,
  isSelected,
  onDrag,
  onSelect,
  tool = 'select',
  onDelete, // 新增
  onDownload, // 新增
}: CanvasItemProps) {
```

- [ ] **Step 3: 渲染操作栏**

在组件 return 的 div 内，img 之前添加操作栏:

```tsx
{/* 选中时显示操作栏 */}
{isSelected && tool === 'select' && (
  <div className="absolute top-0 left-0 right-0 bg-black/60 rounded-t-md p-1.5 flex gap-2 justify-center z-10">
    <button
      className="text-white text-xs hover:bg-white/20 rounded px-2 py-0.5 transition-colors"
      onClick={e => {
        e.stopPropagation()
        onDelete(item.id)
      }}
    >
      🗑️ 删除
    </button>
    <button
      className="text-white text-xs hover:bg-white/20 rounded px-2 py-0.5 transition-colors"
      onClick={e => {
        e.stopPropagation()
        onDownload(item.imageUrl)
      }}
    >
      ⬇️ 下载
    </button>
  </div>
)}
```

- [ ] **Step 4: 验证构建通过**

Run: `pnpm build`
Expected: PASS (无类型错误)

- [ ] **Step 5: Commit**

```bash
git add src/features/generator/components/CanvasItem.tsx
git commit -m "feat(generator): add operation bar to CanvasItem with delete and download"
```

---

### Task 3: Canvas 传递回调

**Files:**
- Modify: `src/features/generator/components/Canvas.tsx`

- [ ] **Step 1: 从 hook 获取 handleDownload**

修改 useCanvas 调用:

```typescript
const { items, selectedId, handleDrag, selectItem, removeItem, handleDownload } = useCanvas()
```

- [ ] **Step 2: 传递回调给 CanvasItem**

修改 CanvasItem 渲染:

```tsx
{items.map(item => (
  <CanvasItem
    key={item.id}
    item={item}
    isSelected={selectedId === item.id}
    onDrag={handleDrag}
    onSelect={selectItem}
    tool={tool}
    onDelete={removeItem} // 新增
    onDownload={handleDownload} // 新增
  />
))}
```

- [ ] **Step 3: 验证构建通过**

Run: `pnpm build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/features/generator/components/Canvas.tsx
git commit -m "feat(generator): pass onDelete and onDownload callbacks to CanvasItem"
```

---

### Task 4: 最终验证

- [ ] **Step 1: 启动开发服务器验证功能**

Run: `pnpm dev`
Manual test:
1. 打开画布页面
2. 选中一个 item
3. 验证操作栏显示在 item 内部顶部
4. 点击删除按钮验证 item 被移除
5. 点击下载按钮验证图片下载

- [ ] **Step 2: 确认所有变更已提交**

Run: `git status`
Expected: clean working tree