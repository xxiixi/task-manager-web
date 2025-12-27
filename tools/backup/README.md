# 任务管理器数据备份及恢复工具

这是一个用于备份和恢复任务管理器数据的 Node.js CLI 工具。

## 安装依赖

在 `tools/backup` 目录下运行：

```bash
npm install
# 或
pnpm install
```

## 使用方法

### 1. 备份数据

首先需要在前端应用中导出数据（点击右上角的导出按钮），然后使用工具进行备份：

```bash
# 方式1: 使用 --file 参数指定导出的 JSON 文件
npm run backup -- --file ~/Downloads/task-manager-export-2024-01-01T10-00-00.json

# 方式2: 将导出的文件重命名为 exported-data.json 并放在 backups/ 目录下
# 然后直接运行（无需参数）
npm run backup

# 指定输出目录
npm run backup -- --file exported.json --output ./my-backups

# 指定备份文件名
npm run backup -- --file exported.json --name my-backup-2024
```

### 2. 恢复数据

```bash
# 恢复指定备份文件
npm run restore -- backups/backup-2024-01-01T10-00-00.json

# 强制覆盖（跳过确认）
npm run restore -- backups/backup-2024-01-01T10-00-00.json --force
```

### 3. 列出所有备份

```bash
# 列出默认目录下的所有备份
npm run list

# 列出指定目录下的所有备份
npm run list -- --dir ./my-backups
```

### 4. 删除备份

```bash
# 删除指定备份文件
npm run delete -- backup-2024-01-01T10-00-00

# 或使用完整文件名
npm run delete -- backup-2024-01-01T10-00-00.json

# 或使用完整路径
npm run delete -- ./backups/backup-2024-01-01T10-00-00.json
```

## 工作流程

1. **备份流程**：
   - 在前端应用中点击"导出数据"按钮，下载 JSON 文件
   - 将导出的文件重命名为 `exported-data.json` 并放在 `backups/` 目录下
   - 运行 `npm run backup` 创建带时间戳的备份文件

2. **恢复流程**：
   - 运行 `npm run restore -- <备份文件路径>`
   - 工具会生成 `backups/restore-data.json` 文件
   - 在前端应用中点击"导入数据"按钮，选择 `restore-data.json` 文件完成恢复

## 备份文件格式

备份文件是 JSON 格式，包含以下字段：

```json
{
  "version": "1.0.0",
  "timestamp": 1704067200000,
  "date": "2024-01-01T10:00:00.000Z",
  "data": {
    "tasks": [...]
  }
}
```

## 注意事项

- 备份文件默认保存在 `backups/` 目录下
- 恢复操作会覆盖当前数据，请谨慎操作
- 建议定期备份重要数据

