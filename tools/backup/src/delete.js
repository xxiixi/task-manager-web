import { unlink } from 'fs/promises'
import { join, resolve, extname } from 'path'
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
 * 删除备份文件
 * @param {string} file - 备份文件名或路径
 * @param {string} dir - 备份文件目录
 */
export async function deleteBackup(file, dir = 'backups') {
  const spinner = ora('正在删除备份文件...').start()

  try {
    // 如果文件没有扩展名，添加 .json
    let filepath = file
    if (!extname(file)) {
      filepath = join(dir, `${file}.json`)
    } else if (!file.includes('/') && !file.includes('\\')) {
      filepath = join(dir, file)
    } else {
      filepath = resolve(file)
    }

    // 确认删除
    spinner.stop()
    const confirmed = await confirm(chalk.yellow(`确定要删除备份文件 "${filepath}" 吗？(y/n): `))
    
    if (!confirmed) {
      console.log(chalk.gray('已取消删除'))
      return
    }

    spinner.start('正在删除备份文件...')

    // 删除文件
    await unlink(filepath)

    spinner.succeed(chalk.green(`备份文件已删除: ${filepath}`))
  } catch (error) {
    spinner.fail(chalk.red('删除失败'))
    if (error.code === 'ENOENT') {
      console.error(chalk.red(`文件不存在: ${file}`))
    } else {
      console.error(chalk.red(error.message))
    }
    process.exit(1)
  }
}

