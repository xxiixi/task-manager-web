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
    taskCategory: '分类',
    searchPlaceholder: '搜索任务...',
    editTask: '编辑任务',
    save: '保存',
    cancel: '取消',
    editTitle: '编辑标题',
    editDescription: '编辑描述',
    viewDetails: '查看详情',
    taskDetails: '任务详情',
    taskTitle: '标题',
    taskDescription: '描述',
    taskStatus: '状态',
    createdAt: '创建时间',
    updatedAt: '更新时间',
    dueDate: '截止日期',
    createdAtPrefix: '创建于',
    updatedAtPrefix: '最后更新于',
    dueDatePrefix: '截止于',
    tags: '标签',
    noDescription: '无描述',
    noDueDate: '无截止日期',
    noTags: '无标签',
    close: '关闭',
    filterByCategory: '分类筛选',
    sortBy: '排序',
    sortByUpdatedTime: '最新修改时间',
    sortByCreatedTime: '添加时间',
    exportData: '导出数据',
    importData: '导入数据',
    exportSuccess: '数据导出成功',
    importSuccess: '数据导入成功',
    importError: '数据导入失败',
    confirmImport: '导入数据将覆盖当前所有任务，确定要继续吗？'
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
    taskCategory: 'Category',
    searchPlaceholder: 'Search tasks...',
    editTask: 'Edit Task',
    save: 'Save',
    cancel: 'Cancel',
    editTitle: 'Edit Title',
    editDescription: 'Edit Description',
    viewDetails: 'View Details',
    taskDetails: 'Task Details',
    taskTitle: 'Title',
    taskDescription: 'Description',
    taskStatus: 'Status',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    dueDate: 'Due Date',
    createdAtPrefix: 'Created on',
    updatedAtPrefix: 'Last updated on',
    dueDatePrefix: 'Due on',
    tags: 'Tags',
    noDescription: 'No description',
    noDueDate: 'No due date',
    noTags: 'No tags',
    close: 'Close',
    filterByCategory: ' Category',
    sortBy: 'Sort',
    sortByUpdatedTime: 'Last Updated',
    sortByCreatedTime: 'Created Time',
    exportData: 'Export Data',
    importData: 'Import Data',
    exportSuccess: 'Data exported successfully',
    importSuccess: 'Data imported successfully',
    importError: 'Failed to import data',
    confirmImport: 'Importing data will overwrite all current tasks. Are you sure you want to continue?'
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

