import { readFileSync, writeFileSync } from 'fs'

const msgPath = process.argv[2]
let msg = readFileSync(msgPath, 'utf8')

// 如果已经有 emoji，就不重复加
if (/^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u.test(msg)) {
  process.exit(0)
}

const EMOJI_MAP = {
  feat: '✨',
  fix: '🦋',
  docs: '📖',
  style: '🔮',
  refactor: '🧚🏻',
  perf: '⚡️',
  test: '📟',
  chore: '🧩',
  release: '🚀',
}

const match = msg.match(/^(\w+)(\(.+\))?:\s/)
if (!match) process.exit(0)

const type = match[1]
const emoji = EMOJI_MAP[type]

if (!emoji) process.exit(0)

// 注入 emoji
msg = `${emoji} ${msg}`
writeFileSync(msgPath, msg, 'utf8')
