#!/usr/bin/env node

import { program } from 'commander'
import { backup } from '../src/backup.js'
import { restore } from '../src/restore.js'
import { listBackups } from '../src/list.js'
import { deleteBackup } from '../src/delete.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

program
  .name('task-backup')
  .description('任务管理器数据备份及恢复工具')
  .version('1.0.0')

program
  .command('backup')
  .description('备份当前任务数据')
  .option('-o, --output <path>', '指定备份文件输出路径', 'backups')
  .option('-n, --name <name>', '指定备份文件名（不含扩展名）')
  .option('-f, --file <path>', '指定要备份的导出 JSON 文件路径')
  .action(async (options) => {
    await backup(options.output, options.name, options.file)
  })

program
  .command('restore')
  .description('从备份文件恢复数据')
  .argument('<file>', '备份文件路径')
  .option('-f, --force', '强制覆盖现有数据')
  .action(async (file, options) => {
    await restore(file, options.force)
  })

program
  .command('list')
  .description('列出所有备份文件')
  .option('-d, --dir <path>', '备份文件目录', 'backups')
  .action(async (options) => {
    await listBackups(options.dir)
  })

program
  .command('delete')
  .description('删除指定的备份文件')
  .argument('<file>', '备份文件名或路径')
  .option('-d, --dir <path>', '备份文件目录', 'backups')
  .action(async (file, options) => {
    await deleteBackup(file, options.dir)
  })

program.parse()

