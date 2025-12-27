import { readFile, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import chalk from 'chalk'
import ora from 'ora'
import readline from 'readline'

/**
 * 从用户输入获取确认
 */
function confirm(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
    })
  })
}

/**
 * 恢复任务数据
 * @param {string} file - 备份文件路径
 * @param {boolean} force - 是否强制覆盖
 */
export async function restore(file, force = false) {
  const spinner = ora('正在恢复数据...').start()

  try {
    // 解析文件路径
    const filepath = resolve(file)
    
    // 读取备份文件
    const backupData = JSON.parse(await readFile(filepath, 'utf-8'))
    
    // 验证备份文件格式
    if (!backupData.data || !backupData.data.tasks) {
      throw new Error('无效的备份文件格式')
    }

    // 显示备份信息
    spinner.stop()
    console.log(chalk.cyan('\n备份文件信息:'))
    console.log(chalk.gray(`  文件路径: ${filepath}`))
    console.log(chalk.gray(`  备份时间: ${backupData.date || '未知'}`))
    console.log(chalk.gray(`  任务数量: ${backupData.data.tasks.length}`))
    
    // 如果不是强制模式，询问确认
    if (!force) {
      const confirmed = await confirm(chalk.yellow('\n是否恢复此备份？这将覆盖当前数据 (y/n): '))
      if (!confirmed) {
        console.log(chalk.gray('已取消恢复'))
        return
      }
    }

    spinner.start('正在恢复数据...')

    // 生成恢复后的数据文件（前端导入时会读取此文件）
    const restorePath = join(process.cwd(), 'backups', 'restore-data.json')
    await writeFile(restorePath, JSON.stringify(backupData.data, null, 2), 'utf-8')

    spinner.succeed(chalk.green('恢复数据已准备完成'))
    console.log(chalk.gray(`  恢复文件: ${restorePath}`))
    console.log(chalk.yellow('  请在前端使用"导入数据"功能，选择此文件完成恢复'))
    console.log(chalk.gray(`  或者手动将文件内容复制到前端应用中`))
  } catch (error) {
    spinner.fail(chalk.red('恢复失败'))
    console.error(chalk.red(error.message))
    process.exit(1)
  }
}

