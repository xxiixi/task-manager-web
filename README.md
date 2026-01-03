# task-manager-web

使用 Vue3+TS+Less 开发的个人任务管理系统

## 功能特性

1. ✅ 任务增删改查、筛选及 Pinia 状态管理 + 本地持久化
2. ✅ Less 使用变量、嵌套
3. ✅ 用 NVM 管理 Node.js（v20.10.0）
4. ✅ 配套开发 Node.js 小工具：数据备份及恢复工具
5. ✅ 国际化，支持中英双语切换
6. ✅ 遵守前端编码指南代码规范
7. 加分项：
    1. 使用three.js利用webgl渲染不同颜色的点云，并实现颜色切换功能
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

## 数据备份与恢复

项目提供了完整的数据备份和恢复功能：

### 前端导出/导入

在应用右上角工具栏中，可以使用：

- **导出按钮（⬇️）**：将当前所有任务数据导出为 JSON 文件
- **导入按钮（⬆️）**：从 JSON 文件导入任务数据（会覆盖当前数据）

### Node.js 备份工具

项目包含一个完整的 Node.js CLI 工具用于管理备份文件。详细使用方法请参考 [备份工具文档](./tools/backup/README.md)。

快速开始：

```sh
# 进入备份工具目录
cd tools/backup

# 安装依赖
npm install

# 备份数据（需要先在前端导出 JSON 文件）
npm run backup -- --file ../path/to/exported-file.json

# 列出所有备份
npm run list

# 恢复备份
npm run restore -- backups/backup-2024-01-01T10-00-00.json

# 删除备份
npm run delete -- backup-2024-01-01T10-00-00
```

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

## TODO

- 已完成任务置底
- sorter可以根据状态排序
