# 任务管理系统开发方案

## 一、项目概述

基于 Vue3 + TypeScript + Less 开发的个人任务管理系统，支持任务的增删改查、筛选、状态管理及本地持久化，并包含数据备份恢复工具。

## 二、技术栈

- **前端框架**: Vue 3.5+ (Composition API)
- **类型系统**: TypeScript 5.9+
- **状态管理**: Pinia 3.0+ + pinia-plugin-persistedstate
- **路由**: Vue Router 4.6+
- **样式**: Less 4.2+
- **构建工具**: Vite 7.2+
- **代码规范**: ESLint + Prettier + Commitlint
- **Node.js 版本**: v20.10.0 (通过 NVM 管理)
- **包管理器**: pnpm

## 三、核心功能实现方案

### 3.1 任务管理功能

#### 3.1.1 任务数据模型

```typescript
interface Task {
  id: string              // 唯一标识符 (UUID)
  title: string           // 任务标题
  description?: string    // 任务描述
  status: 'pending' | 'in-progress' | 'completed'  // 任务状态
  priority: 'low' | 'medium' | 'high'  // 优先级
  tags?: string[]         // 标签
  createdAt: number       // 创建时间戳
  updatedAt: number       // 更新时间戳
  dueDate?: number        // 截止日期时间戳
}
```

#### 3.1.2 Pinia Store 设计

**文件结构**: `src/stores/task.ts`

**功能模块**:
- `tasks`: 任务列表 (响应式数组)
- `addTask(task)`: 添加任务
- `updateTask(id, updates)`: 更新任务
- `deleteTask(id)`: 删除任务
- `toggleTaskStatus(id)`: 切换任务状态
- `getTaskById(id)`: 根据 ID 获取任务
- `filterTasks(filters)`: 筛选任务 (按状态、优先级、标签、日期范围)

**持久化配置**:
- 使用 `pinia-plugin-persistedstate` 自动持久化到 `localStorage`
- Key: `task-manager-storage`
- 序列化/反序列化处理

#### 3.1.3 筛选功能

**筛选条件**:
- 状态筛选: 全部 / 待办 / 进行中 / 已完成
- 优先级筛选: 全部 / 低 / 中 / 高
- 标签筛选: 多选标签
- 日期筛选: 今日 / 本周 / 本月 / 自定义范围
- 关键词搜索: 标题和描述全文搜索

**实现方式**:
- 使用 Pinia getter 实现计算属性筛选
- 支持多条件组合筛选

### 3.2 UI 组件设计

#### 3.2.1 组件结构

```
src/
├── components/
│   ├── TaskList.vue          # 任务列表组件
│   ├── TaskItem.vue          # 任务项组件
│   ├── TaskForm.vue          # 任务表单组件 (新增/编辑)
│   ├── TaskFilter.vue        # 筛选组件
│   ├── TaskStats.vue         # 任务统计组件
│   └── EmptyState.vue        # 空状态组件
├── views/
│   ├── HomeView.vue          # 主页视图
│   └── AboutView.vue         # 关于页面 (可选)
└── layouts/
    └── DefaultLayout.vue     # 默认布局
```

#### 3.2.2 UI 设计原则

- **现代化设计**: 采用卡片式布局，圆角、阴影、渐变等视觉效果
- **响应式布局**: 支持桌面端和移动端适配
- **交互友好**: 动画过渡、拖拽排序、批量操作
- **视觉层次**: 使用颜色、字体大小、间距建立清晰的信息层次

### 3.3 Less 样式方案

#### 3.3.1 变量定义

**文件**: `src/styles/variables.less`

```less
// 颜色变量
@primary-color: #6366f1;
@secondary-color: #8b5cf6;
@success-color: #10b981;
@warning-color: #f59e0b;
@error-color: #ef4444;

@bg-color: #f9fafb;
@card-bg: #ffffff;
@text-primary: #111827;
@text-secondary: #6b7280;
@border-color: #e5e7eb;

// 间距变量
@spacing-xs: 4px;
@spacing-sm: 8px;
@spacing-md: 16px;
@spacing-lg: 24px;
@spacing-xl: 32px;

// 字体变量
@font-size-xs: 12px;
@font-size-sm: 14px;
@font-size-md: 16px;
@font-size-lg: 18px;
@font-size-xl: 24px;

// 圆角变量
@border-radius-sm: 4px;
@border-radius-md: 8px;
@border-radius-lg: 12px;
```

#### 3.3.2 嵌套使用示例

**文件**: `src/components/TaskItem.vue`

```less
.task-item {
  padding: @spacing-md;
  background: @card-bg;
  border-radius: @border-radius-md;
  border: 1px solid @border-color;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .task-header {
    display: flex;
    align-items: center;
    gap: @spacing-sm;

    .task-title {
      font-size: @font-size-md;
      font-weight: 600;
      color: @text-primary;

      &.completed {
        text-decoration: line-through;
        color: @text-secondary;
      }
    }
  }

  .task-actions {
    display: flex;
    gap: @spacing-xs;

    button {
      padding: @spacing-xs @spacing-sm;
      border: none;
      border-radius: @border-radius-sm;
      cursor: pointer;

      &.primary {
        background: @primary-color;
        color: white;
      }
    }
  }
}
```

### 3.4 路由配置

**文件**: `src/router/index.ts`

```typescript
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
]
```

## 四、Node.js 数据备份恢复工具

### 4.1 工具功能

- **数据备份**: 将 localStorage 中的任务数据导出为 JSON 文件
- **数据恢复**: 从 JSON 文件导入任务数据到 localStorage
- **数据验证**: 导入前验证数据格式和完整性

### 4.2 实现方案

**文件结构**:
```
tools/
├── backup.js          # 备份脚本
├── restore.js         # 恢复脚本
├── utils.js           # 工具函数
└── package.json       # 工具依赖配置
```

**使用方式**:
```bash
# 备份数据
node tools/backup.js --output ./backups/tasks-2024-01-01.json

# 恢复数据
node tools/restore.js --input ./backups/tasks-2024-01-01.json
```

**实现要点**:
- 使用 Node.js `fs` 模块读写文件
- 使用 `commander` 或 `yargs` 处理命令行参数
- 数据格式验证和错误处理
- 支持备份文件时间戳命名

## 五、加分项实现方案

### 5.1 Three.js 点云渲染

**功能**: 在任务管理页面中嵌入一个 3D 点云可视化组件

**实现方案**:
- 安装 `three` 依赖
- 创建 `PointCloudViewer.vue` 组件
- 使用 WebGL 渲染不同颜色的点云
- 点云数据可以基于任务数据生成 (例如: 每个任务对应一个点，颜色表示优先级)

**文件**: `src/components/PointCloudViewer.vue`

### 5.2 Paper.js 五角星绘制

**功能**: 在图片上传/展示功能中，使用 Paper.js 在图片中心绘制五角星

**实现方案**:
- 安装 `paper` 依赖
- 创建 `ImageStarOverlay.vue` 组件
- 支持图片上传或选择
- 使用 Paper.js 在 Canvas 上绘制五角星
- 五角星可以自定义颜色、大小、旋转角度

**文件**: `src/components/ImageStarOverlay.vue`

### 5.3 UI/UX 优化

**设计方向**:
- 采用现代扁平化设计风格
- 使用渐变色和微妙的阴影效果
- 流畅的动画过渡 (使用 Vue Transition)
- 响应式设计，适配各种屏幕尺寸
- 暗色模式支持 (可选)

**交互优化**:
- 拖拽排序任务
- 批量操作 (批量删除、批量修改状态)
- 快捷键支持 (Ctrl+N 新建任务等)
- 任务完成动画效果

## 六、开发规范

### 6.1 代码规范

- **ESLint**: 使用项目配置的 ESLint 规则
- **Prettier**: 使用项目配置的 Prettier 格式化规则
- **TypeScript**: 严格模式，所有组件和函数必须有类型定义
- **命名规范**:
  - 组件: PascalCase (如 `TaskItem.vue`)
  - 变量/函数: camelCase (如 `taskList`)
  - 常量: UPPER_SNAKE_CASE (如 `MAX_TASKS`)
  - 类型/接口: PascalCase (如 `Task`, `TaskStatus`)

### 6.2 Git 提交规范

遵循项目的 Commit Message Convention:
- 格式: `<emoji> <type>(<scope>): <subject>`
- 示例: `✨ feat(task): add task status filter`

### 6.3 文件组织规范

```
src/
├── api/              # API 接口 (如需要)
├── assets/           # 静态资源
│   ├── images/
│   └── fonts/
├── components/       # 公共组件
├── composables/      # 组合式函数
├── router/           # 路由配置
├── stores/           # Pinia stores
├── styles/           # 全局样式
│   ├── variables.less
│   ├── mixins.less
│   └── index.less
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
├── views/            # 页面视图
└── App.vue           # 根组件
```

## 七、开发计划

### 阶段一: 基础功能 (核心需求)
1. ✅ 项目初始化 (已完成)
2. ⏳ 配置 Pinia Store 和持久化
3. ⏳ 实现任务数据模型和类型定义
4. ⏳ 开发任务增删改查功能
5. ⏳ 实现筛选功能
6. ⏳ 基础 UI 组件开发

### 阶段二: 样式和优化
1. ⏳ Less 变量和嵌套样式实现
2. ⏳ UI 美化和响应式布局
3. ⏳ 动画和交互优化

### 阶段三: Node.js 工具
1. ⏳ 开发数据备份工具
2. ⏳ 开发数据恢复工具
3. ⏳ 工具测试和文档

### 阶段四: 加分项 (可选)
1. ⏳ Three.js 点云渲染组件
2. ⏳ Paper.js 五角星绘制组件
3. ⏳ 高级 UI/UX 优化

## 八、技术难点和解决方案

### 8.1 数据持久化
- **问题**: 确保 Pinia 状态正确持久化到 localStorage
- **解决**: 使用 `pinia-plugin-persistedstate`，配置正确的序列化选项

### 8.2 筛选性能
- **问题**: 大量任务数据时的筛选性能
- **解决**: 使用 Pinia getter 计算属性，利用 Vue 的响应式系统优化

### 8.3 类型安全
- **问题**: Vue 组件中的 TypeScript 类型推断
- **解决**: 使用 `<script setup lang="ts">`，定义明确的接口和类型

## 九、测试计划

### 9.1 功能测试
- 任务 CRUD 操作测试
- 筛选功能测试
- 数据持久化测试
- 备份恢复工具测试

### 9.2 兼容性测试
- 浏览器兼容性 (Chrome, Firefox, Safari, Edge)
- 响应式布局测试 (不同屏幕尺寸)

## 十、部署说明

### 10.1 开发环境
```bash
# 使用 NVM 切换到指定 Node.js 版本
nvm use 20.10.0

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 10.2 生产构建
```bash
# 类型检查
pnpm type-check

# 代码检查
pnpm lint

# 构建生产版本
pnpm build
```

## 十一、参考资料

- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/zh/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Less 官方文档](https://lesscss.org/)
- [Three.js 官方文档](https://threejs.org/)
- [Paper.js 官方文档](http://paperjs.org/)

