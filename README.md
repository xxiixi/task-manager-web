# task-manager-web

使用 Vue3+TS+Less 开发的个人任务管理系统

## 功能特性

1. ✅ 任务增删改查、筛选及 Pinia 状态管理 + 本地持久化
2. ✅ Less 使用变量、嵌套
3. ✅ 用 NVM 管理 Node.js（v20.10.0）
4. ✅ 国际化，支持中英双语切换
5. ✅ 黑暗模式支持
6. ✅ 使用 Bootstrap Icons 图标库（按需导入）
7. ✅ 遵守前端编码指南代码规范

## Todo

1. 配套开发 Node.js 小工具：数据备份及恢复工具
2. 加分项：
    1. 使用three.js利用webgl渲染不同颜色的点云
    2. 使用paper.js在任意图片中间绘制一个五角星
    3. 舒服的UI，合理的产品逻辑

## 技术栈

- Vue 3 + TypeScript
- Pinia（状态管理）
- Vue Router
- Less（样式预处理器）
- Bootstrap Icons（图标库）

## Bootstrap Icons

项目使用 Bootstrap Icons 作为图标库，采用按需导入的方式。详细使用说明请参考 [Bootstrap Icons 使用文档](./docs/bootstrap-icons.md)。

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
