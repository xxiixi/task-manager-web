<template>
  <div class="header-toolbar">
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
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../stores/theme'
import { useI18nStore } from '../stores/i18n'

const themeStore = useThemeStore()
const i18nStore = useI18nStore()
const { t } = storeToRefs(i18nStore)
const { isDark } = storeToRefs(themeStore)

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

const handleToggleTheme = () => {
  themeStore.toggleTheme()
}

const handleToggleLocale = () => {
  i18nStore.toggleLocale()
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
  background: @bg-secondary;
  color: @text-primary;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all @transition-fast;
  text-decoration: none;
  box-shadow: @shadow-sm;

  &:hover {
    background: @card-hover-bg;
    transform: translateY(-2px);
    box-shadow: @shadow-md;
  }

  &:active {
    transform: translateY(0);
  }

  .bi {
    font-size: 18px;
  }
}

// 黑暗模式样式
html.dark .toolbar-btn {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}
</style>

