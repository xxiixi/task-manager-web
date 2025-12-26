import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

type Locale = 'zh-CN' | 'en-US'

const translations = {
  'zh-CN': {
    title: '任务管理器',
    addTask: '添加任务',
    all: '全部',
    pending: '待办',
    inProgress: '进行中',
    completed: '已完成',
    deleteTask: '删除任务',
    darkMode: '黑暗模式',
    lightMode: '浅色模式',
    language: '语言',
    switchToEnglish: '切换到 English',
    switchToChinese: '切换到 中文',
    github: 'GitHub',
    priorityNormal: '普通',
    priorityImportant: '重要',
    priorityUrgent: '紧急'
  },
  'en-US': {
    title: 'Task Manager',
    addTask: 'Add Task',
    all: 'All',
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    deleteTask: 'Delete Task',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    switchToEnglish: 'Switch to English',
    switchToChinese: 'Switch to Chinese',
    github: 'GitHub',
    priorityNormal: 'Normal',
    priorityImportant: 'Important',
    priorityUrgent: 'Urgent'
  }
}

export const useI18nStore = defineStore(
  'i18n',
  () => {
    const getInitialLocale = (): Locale => {
      const saved = localStorage.getItem('locale')
      if (saved && (saved === 'zh-CN' || saved === 'en-US')) {
        return saved as Locale
      }
      // 默认使用浏览器语言
      const browserLang = navigator.language
      return browserLang.startsWith('zh') ? 'zh-CN' : 'en-US'
    }
    
    const locale = ref<Locale>(getInitialLocale())

    const t = computed(() => translations[locale.value])

    const toggleLocale = () => {
      locale.value = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
      localStorage.setItem('locale', locale.value)
    }

    return {
      locale,
      t,
      toggleLocale
    }
  },
  {
    persist: true
  }
)

