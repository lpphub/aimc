# 卡片差异化样式实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为作品集和素材库的卡片增加类型差异化样式（图片、视频、文本用不同方式展示）

**Architecture:** 修改 WorksTab 和 MaterialsTab 组件中的卡片渲染逻辑，为每种类型设计独特的展示样式

**Tech Stack:** React + TypeScript + Tailwind CSS

---

## Task 1: 修改 WorksTab.tsx - 差异化卡片样式

**Files:**
- Modify: `src/features/project/components/WorksTab.tsx`

**Step 1: 修改图片卡片样式**

图片类型保持缩略图展示，增加样式细节：

```tsx
{work.type === 'image' && work.content ? (
  <div className='relative w-full aspect-square'>
    <img
      src={work.content}
      alt={work.prompt}
      className='w-full h-full object-cover rounded-t-lg'
    />
    <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
  </div>
) : work.type === 'video' && work.content ? (
```

**Step 2: 修改视频卡片样式**

视频添加播放按钮 overlay：

```tsx
{work.type === 'video' && work.content ? (
  <div className='relative w-full aspect-square'>
    <video src={work.content} className='w-full h-full object-cover rounded-t-lg' muted />
    <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
      <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
        <Play className='w-6 h-6 text-white ml-1' />
      </div>
    </div>
    <div className='absolute bottom-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white'>
      视频
    </div>
  </div>
) : (
```

**Step 3: 修改文本卡片样式**

文本使用纯文字 + 背景纹理：

```tsx
<div className='w-full aspect-square relative bg-gradient-to-br from-gray-800/50 to-gray-900/50'>
  <div className='absolute inset-0 opacity-10' style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '8px 8px' }} />
  <div className='absolute inset-0 flex items-center justify-center p-4'>
    <FileText className='w-12 h-12 text-blue-400/50' />
  </div>
</div>
```

**Step 4: 提交**

```bash
git add src/features/project/components/WorksTab.tsx
git commit -m "feat: add differentiated card styles in WorksTab"
```

---

## Task 2: 修改 MaterialsTab.tsx - 差异化卡片样式

**Files:**
- Modify: `src/features/project/components/MaterialsTab.tsx`

**Step 1: 应用相同的差异化样式**

复制 WorksTab 中的样式逻辑到 MaterialsTab：
- 图片：缩略图 + 渐变底层
- 视频：封面 + 播放按钮 overlay
- 文本：纯文字 + 点阵纹理背景

```tsx
// 图片
{material.type === 'image' && material.content ? (
  <div className='relative w-full aspect-square'>
    <img src={material.content} alt={material.name} className='w-full h-full object-cover rounded-t-lg' />
    <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent' />
  </div>
) : material.type === 'video' && material.content ? (

// 视频
<div className='relative w-full aspect-square'>
  <video src={material.content} className='w-full h-full object-cover rounded-t-lg' muted />
  <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
    <div className='w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center'>
      <Play className='w-6 h-6 text-white ml-1' />
    </div>
  </div>
</div>

// 文本
<div className='w-full aspect-square relative bg-gradient-to-br from-gray-800/50 to-gray-900/50'>
  <div className='absolute inset-0 opacity-10' style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '8px 8px' }} />
  <div className='absolute inset-0 flex items-center justify-center p-4'>
    <FileText className='w-12 h-12 text-blue-400/50' />
  </div>
</div>
```

**Step 2: 添加 Play 图标导入**

确认 lucide-react 中 Play 图标已导入（如果没有需要添加）

**Step 3: 提交**

```bash
git add src/features/project/components/MaterialsTab.tsx
git commit -m "feat: add differentiated card styles in MaterialsTab"
```

---

## Task 3: 验证并测试

**Step 1: 运行开发服务器**

```bash
pnpm dev
```

**Step 2: 访问项目详情页**

验证：
- 图片卡片显示缩略图 + 渐变底层
- 视频卡片显示封面 + 播放按钮
- 文本卡片显示点阵纹理背景 + 图标
- 三种类型视觉区分明显

**Step 3: 运行 lint**

```bash
pnpm lint
```

---

**Plan complete.**

两个执行选项：

1. **Subagent-Driven (本会话)** - 我分发子任务逐个执行，快速迭代
2. **Parallel Session (新会话)** - 在新会话中使用 executing-plans 批量执行

选择哪个？