<template>
  <div class="header-toolbar">
    <button
      class="toolbar-btn"
      @click="handleExport"
      :title="exportTooltip"
    >
      <i class="bi bi-download"></i>
    </button>
    <button
      class="toolbar-btn"
      @click="handleImportClick"
      :title="importTooltip"
    >
      <i class="bi bi-upload"></i>
    </button>
    <input
      ref="fileInputRef"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileImport"
    />
    <button
      class="toolbar-btn"
      @click="handleToggleTheme"
      :title="themeTooltip"
    >
      <i class="bi" :class="isDark ? 'bi-sun' : 'bi-moon-stars'"></i>
    </button>
    <button
      class="toolbar-btn"
      @click="handleToggleLocale"
      :title="languageTooltip"
    >
      <i class="bi" :class="i18nStore.locale === 'zh-CN' ? 'bi-globe-americas' : 'bi-globe-central-south-asia'"></i>
    </button>
    <a
      class="toolbar-btn"
      href="https://github.com/xxiixi/task-manager-web"
      target="_blank"
      rel="noopener noreferrer"
      :title="githubTooltip"
    >
      <i class="bi bi-github"></i>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../stores/theme'
import { useI18nStore } from '../stores/i18n'
import { useTaskStore } from '../stores/task'
import type { Task } from '../types/task'

const themeStore = useThemeStore()
const i18nStore = useI18nStore()
const taskStore = useTaskStore()
const { t } = storeToRefs(i18nStore)
const { isDark } = storeToRefs(themeStore)

const fileInputRef = ref<HTMLInputElement | null>(null)

const languageTooltip = computed(() => {
  if (!t.value) return ''
  return i18nStore.locale === 'zh-CN' ? t.value.switchToEnglish : t.value.switchToChinese
})

const themeTooltip = computed(() => {
  if (!t.value) return ''
  return isDark.value ? t.value.lightMode : t.value.darkMode
})

const githubTooltip = computed(() => {
  return t.value?.github || 'GitHub'
})

const exportTooltip = computed(() => {
  return t.value?.exportData || '导出数据'
})

const importTooltip = computed(() => {
  return t.value?.importData || '导入数据'
})

const handleToggleTheme = () => {
  themeStore.toggleTheme()
}

const handleToggleLocale = () => {
  i18nStore.toggleLocale()
}

const handleExport = () => {
  try {
    taskStore.exportData()
    // 可以添加成功提示，这里简化处理
  } catch (error) {
    console.error('导出失败:', error)
    alert(t.value?.exportSuccess || '导出失败')
  }
}

const handleImportClick = () => {
  fileInputRef.value?.click()
}

const handleFileImport = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  try {
    // 确认导入
    const confirmed = confirm(t.value?.confirmImport || '导入数据将覆盖当前所有任务，确定要继续吗？')
    if (!confirmed) {
      // 清空文件选择
      if (fileInputRef.value) {
        fileInputRef.value.value = ''
      }
      return
    }

    // 读取文件内容
    const text = await file.text()
    const data = JSON.parse(text)

    // 处理不同的数据格式
    // 支持直接的任务数组或包含 tasks 字段的对象
    let tasks: Task[] = []
    if (Array.isArray(data)) {
      tasks = data
    } else if (data.tasks && Array.isArray(data.tasks)) {
      tasks = data.tasks
    } else if (data.data?.tasks && Array.isArray(data.data.tasks)) {
      // 支持备份工具生成的格式
      tasks = data.data.tasks
    } else {
      throw new Error('无效的数据格式')
    }

    // 导入数据
    taskStore.importData(tasks)
    
    alert(t.value?.importSuccess || '数据导入成功')
  } catch (error) {
    console.error('导入失败:', error)
    alert(t.value?.importError || `数据导入失败: ${error instanceof Error ? error.message : '未知错误'}`)
  } finally {
    // 清空文件选择，允许重复选择同一文件
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
}
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.header-toolbar {
  position: fixed;
  top: @spacing-md;
  right: @spacing-md;
  display: flex;
  gap: @spacing-sm;
  z-index: @z-index-fixed;
}

.toolbar-btn {
  width: 40px;
  height: 40px;
  border-radius: @border-radius-md;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all @transition-fast;
  text-decoration: none;
  box-shadow: @shadow-sm;

  &:hover {
    background: var(--card-hover-bg);
    transform: translateY(-2px);
    box-shadow: @shadow-md;
  }

  &:active {
    transform: translateY(0);
  }

  .bi {
    font-size: @font-size-lg;
  }
}
</style>

