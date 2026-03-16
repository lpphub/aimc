# Pages 目录重构设计

## 背景

当前 `pages/` 目录下的业务页面（ProjectDetail、Creation、AiTools）应该按功能域划分到 `features/` 目录下，以符合项目的模块化架构。

## 目标

将业务页面移动到对应的功能域目录中：
- `ProjectDetail.tsx` → `features/project/components/`
- `Creation.tsx` → `features/creation/components/`
- `AiTools.tsx` → `features/ai-tools/components/`

保留入口页面在 `pages/` 目录：
- `Login.tsx` - 登录页
- `Home.tsx` - 首页

## 变更范围

### 新建文件

1. `src/features/project/components/ProjectDetail.tsx`
2. `src/features/creation/components/Creation.tsx`
3. `src/features/creation/index.ts`
4. `src/features/ai-tools/components/AiTools.tsx`
5. `src/features/ai-tools/index.ts`

### 删除文件

1. `src/pages/ProjectDetail.tsx`
2. `src/pages/Creation.tsx`
3. `src/pages/AiTools.tsx`

### 更新文件

1. `src/features/project/index.ts` - 添加 ProjectDetail 导出
2. `src/app/router/index.tsx` - 更新路由导入路径
3. `README.md` - 更新项目结构说明

## 最终结构

```
src/
├── pages/
│   ├── base/
│   │   ├── ErrorPage.tsx
│   │   └── index.ts
│   ├── Login.tsx
│   └── Home.tsx
├── features/
│   ├── auth/              # 保持不变
│   ├── project/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   ├── components/
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectDetail.tsx
│   │   └── index.ts
│   ├── creation/
│   │   ├── components/
│   │   │   └── Creation.tsx
│   │   └── index.ts
│   └── ai-tools/
│       ├── components/
│       │   └── AiTools.tsx
│       └── index.ts
```

## 风险评估

- **低风险**：仅移动文件位置，不改变组件逻辑
- **影响范围**：路由配置需要更新导入路径