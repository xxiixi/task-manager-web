import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore(
  'theme',
  () => {
    // 应用主题到 HTML
    const applyTheme = (dark: boolean) => {
      if (typeof document !== 'undefined') {
        const html = document.documentElement
        if (dark) {
          html.classList.add('dark')
          html.setAttribute('data-theme', 'dark')
        } else {
          html.classList.remove('dark')
          html.setAttribute('data-theme', 'light')
        }
      }
    }

    // 检查 localStorage 或系统偏好
    const getInitialTheme = (): boolean => {
      // 检查持久化插件的存储（pinia-plugin-persistedstate 使用 'theme' 作为 key）
      const persisted = localStorage.getItem('theme')
      if (persisted) {
        try {
          const parsed = JSON.parse(persisted)
          if (parsed?.isDark !== undefined) {
            const dark = parsed.isDark
            // 立即应用主题
            applyTheme(dark)
            return dark
          }
        } catch {
          // 如果解析失败，忽略
        }
      }
      // 如果没有保存的值，使用系统偏好
      if (typeof window !== 'undefined' && window.matchMedia) {
        const dark = window.matchMedia('(prefers-color-scheme: dark)').matches
        applyTheme(dark)
        return dark
      }
      applyTheme(false)
      return false
    }
    
    const isDark = ref<boolean>(getInitialTheme())

    // 监听变化并应用到 HTML
    watch(
      () => isDark.value,
      (dark) => {
        applyTheme(dark)
      },
      { immediate: false }
    )

    const toggleTheme = () => {
      const newValue = !isDark.value
      isDark.value = newValue
      // 确保立即应用
      applyTheme(newValue)
    }

    return {
      isDark,
      toggleTheme
    }
  },
  {
    persist: {
      key: 'theme',
      storage: localStorage,
    }
  }
)

