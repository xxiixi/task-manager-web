<template>
  <div class="input-add-container">
    <div class="input-add">
      <input
        type="text"
        v-model="taskTitle"
        @keyup.enter="handleAddTask"
        :placeholder="placeholder"
      />
      <button @click="handleAddTask">
        +
      </button>
    </div>
    <div
      class="priority-tag"
      :class="`priority-${selectedPriority}`"
      @click="handleTogglePriority"
      :title="getPriorityTitle"
    >
      {{ getPriorityText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/task'
import { useI18nStore } from '../stores/i18n'
import type { TaskPriority } from '../types/task'

const taskStore = useTaskStore()
const i18nStore = useI18nStore()
const { t, locale } = storeToRefs(i18nStore)
const taskTitle = ref('')
const selectedPriority = ref<TaskPriority>('low')

const placeholder = computed(() => t.value.addTask + '...')

const getPriorityText = computed(() => {
  try {
    switch (selectedPriority.value) {
      case 'low':
        return t.value?.priorityNormal || (locale.value === 'zh-CN' ? '普通' : 'Normal')
      case 'medium':
        return t.value?.priorityImportant || (locale.value === 'zh-CN' ? '重要' : 'Important')
      case 'high':
        return t.value?.priorityUrgent || (locale.value === 'zh-CN' ? '紧急' : 'Urgent')
      default:
        return t.value?.priorityNormal || (locale.value === 'zh-CN' ? '普通' : 'Normal')
    }
  } catch (e) {
    // Fallback to default based on locale
    const isZh = locale.value === 'zh-CN'
    switch (selectedPriority.value) {
      case 'low':
        return isZh ? '普通' : 'Normal'
      case 'medium':
        return isZh ? '重要' : 'Important'
      case 'high':
        return isZh ? '紧急' : 'Urgent'
      default:
        return isZh ? '普通' : 'Normal'
    }
  }
})

const getPriorityTitle = computed(() => {
  try {
    if (t.value?.priorityNormal && t.value?.priorityImportant && t.value?.priorityUrgent) {
      return `${t.value.priorityNormal} / ${t.value.priorityImportant} / ${t.value.priorityUrgent}`
    }
  } catch (e) {
    // Fallback
  }
  return locale.value === 'zh-CN' ? '普通 / 重要 / 紧急' : 'Normal / Important / Urgent'
})

const handleTogglePriority = () => {
  const priorityMap: Record<TaskPriority, TaskPriority> = {
    low: 'medium',
    medium: 'high',
    high: 'low',
  }
  selectedPriority.value = priorityMap[selectedPriority.value]
}

const handleAddTask = () => {
  if (taskTitle.value.trim()) {
    taskStore.addTask({
      title: taskTitle.value.trim(),
      status: 'pending',
      priority: selectedPriority.value,
    })
    taskTitle.value = ''
    // 重置为默认优先级
    selectedPriority.value = 'low'
  }
}
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.input-add-container {
  display: flex;
  align-items: center;
  gap: @spacing-md;
}

.input-add {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;

  input {
    padding: 16px 52px 16px 18px;
    border-radius: @border-radius-3xl;
    border: none;
    outline: none;
    box-shadow: @shadow-input;
    width: 100%;
    font-size: @font-size-md;
    background: var(--card-bg);
    color: var(--text-secondary);
    font-family: @font-family;

    &::placeholder {
      color: var(--text-tertiary);
    }
  }

  button {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: linear-gradient(var(--primary-hover), var(--secondary-color));
    border: none;
    outline: none;
    color: white;
    position: absolute;
    right: 0;
    cursor: pointer;
    transition: transform @transition-fast;

    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

.priority-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border-radius: @border-radius-full;
  font-size: @font-size-sm;
  font-weight: @font-weight-medium;
  cursor: pointer;
  transition: all @transition-fast;
  white-space: nowrap;
  user-select: none;
  flex-shrink: 0;
  width: 80px;
  min-height: 32px;
  text-align: center;
  line-height: 1.2;
  box-sizing: border-box;

  &:hover {
    transform: scale(1.05);
    box-shadow: @shadow-sm;
  }

  &:active {
    transform: scale(0.95);
  }

  &.priority-low {
    background: var(--priority-low-bg);
    color: var(--priority-low-color);
  }

  &.priority-medium {
    background: var(--priority-medium-bg);
    color: var(--priority-medium-color);
  }

  &.priority-high {
    background: var(--priority-high-bg);
    color: var(--priority-high-color);
  }
}
</style>
