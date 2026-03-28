# Canvas Generator 页面重构设计

日期：2025-03-28

## 概述
重构 canvas-generator 页面，将画布作为全屏底层，Chat 组件和工具栏作为浮动层覆盖在画布上。

## 当前状态
- ChatPanel 是左侧固定面板，有标题栏和底部快捷按钮
- Canvas 和 ChatPanel 并排布局（flex 布局）
- 工具栏有选择、撤销、重做三个按钮

## 目标设计

### 布局架构
```
┌─────────────────────────────────────────────┐
│  ┌───────────┐                              │
│  │ Chat      │                              │
│  │ (浮动层)  │                              │
│  │           │                              │
│  └───────────┘                              │
│                                             │
│              Canvas (底层全屏)               │
│                                             │
│         ┌──────────────┐                    │
│         │  工具栏       │                    │
│         │ (底部居中)    │                    │
│         └──────────────┘                    │
└─────────────────────────────────────────────┘
```

### 组件变更

#### 1. CanvasGeneratorPage
- 改为相对定位全屏容器
- 移除 flex 布局
- 三个子元素：Canvas（底层）、FloatingChat（浮动）、CanvasToolbar（浮动）

#### 2. FloatingChat（新组件）
**位置**：绝对定位 `left-4 top-4`
**尺寸**：宽度 380px，高度自适应（最大 600px）
**状态**：
- 默认展开
- 可收起为圆形浮动按钮
- 切换动画 300ms ease-in-out

**UI 简化**：
- 移除顶部标题栏（"AI 对话生成图片" + 状态）
- 移除底部三个快捷按钮（"生成场景图"等）
- 输入框区域简化：
  - 上传按钮融入输入框左侧（absolute 定位）
  - 输入框占满剩余空间
  - 发送按钮在右侧

**保留功能**：
- 消息历史列表
- 图片上传
- 消息发送
- 复制消息

#### 3. CanvasToolbar（修改）
**位置**：绝对定位 `bottom-4 left-1/2 -translate-x-1/2`
**按钮调整**：
- 移除：Undo、Redo
- 保留：Select（选择工具）
- 新增：Hand（抓手/拖拽画布工具）
- 当前激活工具有高亮样式

#### 4. Canvas（保持不变）
- 点阵背景
- 图片拖拽
- 选中状态

### 状态管理
- 现有 hooks 保持不变（useChat、useCanvas）
- 新增：Chat 展开/收起状态（可用 useState 或加入现有 store）
- 新增：当前激活工具状态（select/hand）

### 动画效果
1. Chat 收起/展开：高度/透明度过渡 300ms
2. 工具切换：按钮背景色过渡 200ms
3. 消息列表：保持现有滚动行为

### 响应式考虑
- 画布始终全屏
- Chat 在移动端可改为底部浮动（可选增强）

## 文件变更

### 新增
- `src/features/canvas-generator/components/FloatingChat.tsx`

### 修改
- `src/features/canvas-generator/components/CanvasGeneratorPage.tsx`
- `src/features/canvas-generator/components/CanvasToolbar.tsx`

### 删除（逻辑合并）
- `src/features/canvas-generator/components/ChatPanel.tsx`（功能合并到 FloatingChat）

## 实现优先级
1. 重构 CanvasGeneratorPage 布局结构
2. 创建 FloatingChat 组件（简化版）
3. 修改 CanvasToolbar（调整按钮）
4. 添加切换动画
5. 测试交互流程

## 风险与考虑
- 浮动层可能遮挡画布内容，需要可拖拽或最小化
- Chat 收起后需要明显的展开入口
- 工具状态需要视觉反馈（当前选中工具高亮）
