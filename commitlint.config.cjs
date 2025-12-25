module.exports = {
    extends: ['@commitlint/config-conventional'],
    parserPreset: {
      parserOpts: {
        headerPattern:
          /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})?\s*(\w+)(\(.+\))?:\s(.+)$/u,
        headerCorrespondence: ['emoji', 'type', 'scope', 'subject'],
      },
    },
    rules: {
      'type-enum': [
        2,
        'always',
        ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'release'],
      ],
    },
  }
  