import { readdir, stat } from 'fs/promises'
import { join, extname } from 'path'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

/**
 * 列出所有备份文件
 * @param {string} dir - 备份文件目录
 */
export async function listBackups(dir = 'backups') {
  try {
    const files = await readdir(dir)
    const backupFiles = files.filter(file => extname(file) === '.json')

    if (backupFiles.length === 0) {
      console.log(chalk.yellow(`目录 ${dir} 中没有找到备份文件`))
      return
    }

    console.log(chalk.cyan(`\n找到 ${backupFiles.length} 个备份文件:\n`))

    for (const file of backupFiles) {
      try {
        const filepath = join(dir, file)
        const stats = await stat(filepath)
        const { readFile } = await import('fs/promises')
        const content = JSON.parse(await readFile(filepath, 'utf-8'))
        
        const taskCount = content.data?.tasks?.length || 0
        const date = content.date || stats.mtime.toISOString()
        const size = (stats.size / 1024).toFixed(2)

        console.log(chalk.white(`  📦 ${file}`))
        console.log(chalk.gray(`     时间: ${date}`))
        console.log(chalk.gray(`     任务: ${taskCount} 个`))
        console.log(chalk.gray(`     大小: ${size} KB\n`))
      } catch (error) {
        console.log(chalk.yellow(`  ⚠️  ${file} (无法读取文件信息)\n`))
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(chalk.yellow(`目录 ${dir} 不存在`))
    } else {
      console.error(chalk.red(`列出备份文件失败: ${error.message}`))
      process.exit(1)
    }
  }
}

