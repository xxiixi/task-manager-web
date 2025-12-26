import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore(
  'theme',
  () => {
    // 检查 localStorage 或系统偏好
    const getInitialTheme = (): boolean => {
      const saved = localStorage.getItem('theme')
      if (saved) {
        return saved === 'dark'
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    const isDark = ref<boolean>(getInitialTheme())

    // 监听变化并应用到 HTML
    watch(
      isDark,
      (dark) => {
        if (dark) {
          document.documentElement.classList.add('dark')
          localStorage.setItem('theme', 'dark')
        } else {
          document.documentElement.classList.remove('dark')
          localStorage.setItem('theme', 'light')
        }
      },
      { immediate: true }
    )

    const toggleTheme = () => {
      isDark.value = !isDark.value
    }

    return {
      isDark,
      toggleTheme
    }
  },
  {
    persist: true
  }
)

