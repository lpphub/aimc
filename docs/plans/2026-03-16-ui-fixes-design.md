# UI Fixes Design

## 背景

三个 UI 问题需要修复：
1. 登录失败无提示
2. 创作中心页面布局与其他页面不一致
3. Sidebar 底部收起按钮需要移除

## 修复方案

### 1. 登录失败提示

**文件**: `src/features/auth/components/LoginForm.tsx`

**问题**: 登录失败时只有 `console.error`，用户看不到错误提示。

**方案**: 使用项目已有的 `sonner` 库添加 `toast.error()` 显示错误提示。

```typescript
import { toast } from 'sonner'

// handleFinish 函数中
catch (error) {
  toast.error('登录失败', {
    description: '请检查邮箱和密码是否正确'
  })
}
```

### 2. 创作中心页面布局

**文件**: `src/features/creation/components/Creation.tsx`

**问题**: 第58行有 `<div className='max-w-7xl mx-auto'>` 包裹，导致内容宽度受限，与 Home、AiTools 页面布局不一致。

**方案**: 移除 `max-w-7xl mx-auto` 包裹层，保持全屏布局。

### 3. 移除 Sidebar 收起按钮

**文件**: `src/shared/components/layout/Sidebar.tsx`

**问题**: 第126-151行有收起按钮，需要移除。

**方案**: 删除收起按钮代码块，只保留退出登录按钮。

## 变更文件

1. `src/features/auth/components/LoginForm.tsx` - 添加 toast 错误提示
2. `src/features/creation/components/Creation.tsx` - 移除布局包裹层
3. `src/shared/components/layout/Sidebar.tsx` - 删除收起按钮