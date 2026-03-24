# ToolGrid 卡片重写计划

## 目标

将 `ToolSelector` 重命名为 `ToolGrid`，并使用参考设计中的 glass-card + neon-glow 风格重写工具卡片。

## 影响范围

| 文件 | 操作 |
|------|------|
| `src/features/ai-tools/components/ToolSelector.tsx` | 删除（重命名） |
| `src/features/ai-tools/components/ToolGrid.tsx` | 新建（重写组件） |
| `src/features/ai-tools/components/index.ts` | 更新导出路径 |
| `src/features/ai-tools/index.ts` | 更新导出名 |
| `src/features/ai-tools/components/AiToolsPage.tsx` | 更新 import |
| `src/features/ai-tools/components/MarketingCopyTool.tsx` | 更新 import 路径 |
| `src/features/ai-tools/components/PosterTool.tsx` | 更新 import 路径 |
| `src/features/ai-tools/components/VideoTool.tsx` | 更新 import 路径 |

## 实现细节

### 1. 文件重命名

`ToolSelector.tsx` → `ToolGrid.tsx`，组件 `ToolSelector` → `ToolGrid`，`ToolHeader` 保留在同文件中。

### 2. ToolGrid 组件重写

#### 数据结构调整

每个工具新增 `label` 字段（底部标签文字）和 `accent` 字段（卡片主色调）：

```ts
interface ToolCard {
  id: string
  type: ToolType
  title: string
  description: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  accent: 'primary' | 'secondary'
}
```

工具数据：
- 营销文案 → `label: "Ecommerce Insight"`, `accent: 'primary'`
- 海报创作 → `label: "Visual Core"`, `accent: 'primary'`
- AI 视频 → `label: "Motion Engine"`, `accent: 'secondary'`

#### 卡片样式 (Tailwind v4)

不使用 shadcn Card 组件，用原生 `div` + Tailwind 类名实现 glass-card 效果。

**容器：**
```
group relative h-80 p-8 rounded-xl cursor-pointer overflow-hidden
flex flex-col justify-between
transition-all duration-500
```

**Glass 背景效果（Tailwind v4 任意值语法）：**
```
bg-[rgba(53,52,54,0.6)] backdrop-blur-[20px]
border-t border-primary-container/20
hover:shadow-[0_0_20px_rgba(0,242,255,0.15)]
```

**图标区域：**
- 尺寸：`w-12 h-12 rounded-lg`
- 背景：对应颜色 20% 透明度 → hover 时变为实色
- 图标颜色：对应颜色 → hover 时变为 `on-primary`

**内容区（左侧对齐）：**
- 标题：`text-2xl font-headline font-semibold text-white tracking-tight`
- 描述：`text-on-surface-variant text-sm leading-relaxed`

**底部栏（始终可见）：**
- 左侧：标签文字 `text-[10px] uppercase tracking-widest` + 对应颜色
- 右侧：`ArrowRight` 图标，hover 时 `translate-x-2`

**背景装饰：**
- 右下角放一个大号半透明图标（`opacity-5 group-hover:opacity-10`）

**第三张卡片特殊处理（视频）：**
- 额外 `bg-linear-to-br from-surface-container-high to-surface`
- 右侧半透明背景图

#### 网格布局

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
```

#### 工具卡片颜色映射

```ts
const accentStyles = {
  primary: {
    iconBg: 'bg-primary-container/20 group-hover:bg-primary-container',
    iconText: 'text-primary-container group-hover:text-on-primary',
    labelText: 'text-primary-fixed-dim',
    arrowText: 'text-primary',
    borderT: 'border-primary-container/20',
  },
  secondary: {
    iconBg: 'bg-secondary-container/20 group-hover:bg-secondary-container',
    iconText: 'text-secondary group-hover:text-white',
    labelText: 'text-secondary',
    arrowText: 'text-secondary',
    borderT: 'border-secondary-container/20',
  },
}
```

### 3. Tailwind v4 合规

- ✅ 使用 `@utility` 或纯 Tailwind 类名，不写 `@apply` 混合类
- ✅ 任意值用 `bg-[rgba(...)]` 语法
- ✅ 使用项目已有的 CSS 变量 token（`primary-container`, `on-surface-variant` 等）
- ✅ 动态类名组合用 `cn()`
- ✅ 不引入额外依赖

### 4. Import 更新清单

```
// AiToolsPage.tsx
- import { ToolSelector } from './ToolSelector'
+ import { ToolGrid } from './ToolGrid'

// components/index.ts
- export { ToolHeader, ToolSelector } from './ToolSelector'
+ export { ToolHeader, ToolGrid } from './ToolGrid'

// index.ts
- ToolSelector,
+ ToolGrid,

// MarketingCopyTool.tsx / PosterTool.tsx / VideoTool.tsx
- import { ToolHeader } from './ToolSelector'
+ import { ToolHeader } from './ToolGrid'
```

## 验证

1. `pnpm lint` — 无 lint 错误
2. `pnpm build` — 构建通过，无类型错误
