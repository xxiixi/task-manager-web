import { readFile, mkdir, writeFile } from 'fs/promises'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import ora from 'ora'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 从导出的 JSON 文件读取数据
 * @param {string} filePath - 导出文件路径（可选）
 */
async function readLocalStorageData(filePath) {
  // 如果提供了文件路径，直接使用
  if (filePath) {
    const resolvedPath = resolve(filePath)
    try {
      const data = await readFile(resolvedPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      throw new Error(`无法读取文件: ${resolvedPath}\n${error.message}`)
    }
  }
  
  // 否则尝试从默认位置读取
  const exportPath = join(process.cwd(), 'backups', 'exported-data.json')
  
  try {
    const data = await readFile(exportPath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    throw new Error(
      `无法读取导出的数据文件: ${exportPath}\n` +
      `请先在前端使用导出功能下载 JSON 文件，然后：\n` +
      `1. 将文件重命名为 exported-data.json 并放在 backups/ 目录下，或\n` +
      `2. 使用 --file 参数指定文件路径`
    )
  }
}

/**
 * 备份任务数据
 * @param {string} outputDir - 备份文件输出目录
 * @param {string} name - 备份文件名（可选）
 * @param {string} file - 导出的 JSON 文件路径（可选）
 */
export async function backup(outputDir = 'backups', name, file) {
  const spinner = ora('正在备份数据...').start()

  try {
    // 读取导出的数据
    const data = await readLocalStorageData(file)
    
    // 确保输出目录存在
    await mkdir(outputDir, { recursive: true })

    // 生成备份文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = name 
      ? `${name}.json` 
      : `backup-${timestamp}.json`
    const filepath = join(outputDir, filename)

    // 创建备份数据对象（包含元数据）
    const backupData = {
      version: '1.0.0',
      timestamp: Date.now(),
      date: new Date().toISOString(),
      data: data
    }

    // 写入备份文件
    await writeFile(filepath, JSON.stringify(backupData, null, 2), 'utf-8')

    spinner.succeed(chalk.green(`备份成功: ${filepath}`))
    console.log(chalk.gray(`  任务数量: ${data.tasks?.length || 0}`))
    console.log(chalk.gray(`  备份时间: ${backupData.date}`))
  } catch (error) {
    spinner.fail(chalk.red('备份失败'))
    console.error(chalk.red(error.message))
    process.exit(1)
  }
}

