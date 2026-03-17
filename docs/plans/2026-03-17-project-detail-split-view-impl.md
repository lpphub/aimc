# 项目详情页左右分栏实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将项目详情页的 Tab 切换改为左右分栏布局，增强科技感视觉效果

**Architecture:** 修改 ProjectDetail.tsx 实现左右分栏，移除 MaterialsTab 中的筛选功能，增强卡片样式和背景

**Tech Stack:** React + TypeScript + Tailwind CSS

---

## Task 1: 修改 ProjectDetail.tsx - 左右分栏布局

**Files:**
- Modify: `src/features/project/components/ProjectDetail.tsx`

**Step 1: 移除 Tab 状态和相关逻辑**

修改 `src/features/project/components/ProjectDetail.tsx`:

```tsx
// 移除这一行:
const [activeTab, setActiveTab] = useState<'materials' | 'works'>('materials')

// 移除整个 tab 切换的按钮区域 (lines 112-143)
```

**Step 2: 添加左右分栏布局**

将 Card 内的条件渲染改为左右分栏:

```tsx
<Card className='h-[calc(100vh-350px)] bg-gradient-to-br from-gray-900/80 to-gray-900/50 border-gray-700/30 backdrop-blur-sm p-6'>
  <div className='flex h-full gap-6'>
    {/* 左侧 60% - 作品集 */}
    <div className='flex-[6] min-w-0'>
      <div className='flex items-center gap-2 mb-4'>
        <FolderOpen className='w-5 h-5 text-cyan-400' />
        <span className='text-lg font-medium text-white'>作品集</span>
        <span className='text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-400'>{works.length}</span>
      </div>
      <WorksTab works={works} onDelete={handleDeleteWork} />
    </div>

    {/* 分割线 */}
    <div className='w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent' />

    {/* 右侧 40% - 素材库 */}
    <div className='flex-[4] min-w-0'>
      <div className='flex items-center gap-2 mb-4'>
        <Layers className='w-5 h-5 text-teal-400' />
        <span className='text-lg font-medium text-white'>素材库</span>
        <span className='text-xs bg-gray-800 px-2 py-0.5 rounded-full text-gray-400'>{materials.length}</span>
      </div>
      <MaterialsTab
        materials={materials}
        onUpload={handleUploadMaterial}
        onDelete={handleDeleteMaterial}
      />
    </div>
  </div>
</Card>
```

**Step 3: 提交**

```bash
git add src/features/project/components/ProjectDetail.tsx
git commit -m "feat: add split view layout for project detail"
```

---

## Task 2: 修改 MaterialsTab.tsx - 移除筛选功能

**Files:**
- Modify: `src/features/project/components/MaterialsTab.tsx`

**Step 1: 移除 filter 状态**

```tsx
// 移除这些行:
const [filter, setFilter] = useState<'all' | 'text' | 'image' | 'video'>('all')
const filteredMaterials = materials.filter(m => filter === 'all' || m.type === filter)
```

**Step 2: 移除筛选按钮区域**

移除整个 `div className='flex gap-2'...` 按钮区域 (lines 43-78)

**Step 3: 修改渲染逻辑**

将 `filteredMaterials` 改为直接使用 `materials`:

```tsx
{filteredMaterials.length > 0 ?  // 改为 materials.length > 0
```

**Step 4: 提交**

```bash
git add src/features/project/components/MaterialsTab.tsx
git commit -m "feat: remove filter buttons from materials tab"
```

---

## Task 3: 增强卡片样式 - 更多网格+发光效果

**Files:**
- Modify: `src/features/project/components/MaterialsTab.tsx`
- Modify: `src/features/project/components/WorksTab.tsx`

**Step 1: MaterialsTab 网格调整**

将 grid 列数从 4 改为 5 或 6:

```tsx
<div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3'>
```

**Step 2: 增强卡片样式**

修改卡片 className 增加玻璃拟态和发光效果:

```tsx
className='group relative bg-gradient-to-br from-gray-900/60 to-gray-900/40 border border-gray-700/30 backdrop-blur-md rounded-lg overflow-hidden transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20'
```

**Step 3: WorksTab 同样调整**

应用相同的网格和卡片样式到 WorksTab.tsx

**Step 4: 提交**

```bash
git add src/features/project/components/MaterialsTab.tsx src/features/project/components/WorksTab.tsx
git commit -m "feat: enhance card styles with glassmorphism"
```

---

## Task 4: 增强背景渐变效果

**Files:**
- Modify: `src/features/project/components/ProjectDetail.tsx`

**Step 1: 增加更多渐变光晕**

修改背景层，增加更多动态光晕:

```tsx
<div className='absolute inset-0 overflow-hidden pointer-events-none'>
  <div className='absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse' />
  <div className='absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700' />
  <div className='absolute bottom-0 left-1/3 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse delay-1000' />
  <div className='absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-500/8 rounded-full blur-[100px] animate-pulse delay-2000' />
</div>
```

**Step 2: 提交**

```bash
git add src/features/project/components/ProjectDetail.tsx
git commit -m "feat: enhance background gradients"
```

---

## Task 5: 验证并测试

**Step 1: 运行开发服务器**

```bash
pnpm dev
```

**Step 2: 访问项目详情页**

验证：
- 左右分栏显示正常
- 作品集在左（60%），素材库在右（40%）
- 素材库无筛选按钮
- 背景有更多渐变光晕
- 卡片更小、更具科技感

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