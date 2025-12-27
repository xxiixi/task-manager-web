<template>
  <div class="task-item" :class="{ done: task.status === 'completed' }" @click="handleViewDetails">
    <div class="task-main">
      <span
        class="status-tag"
        :class="`status-${task.status}`"
        @click.stop="handleToggle"
        :title="getStatusTitle"
      >
        {{ getStatusText }}
      </span>
      <div class="task-content-wrapper">
        <span class="task-content">
          {{ task.title }}
        </span>
        <span class="task-date">{{ formatDate(task.updatedAt) }}</span>
      </div>
    </div>
    <div class="action-buttons">
      <button class="delete-btn" @click.stop="handleDelete" :title="t.deleteTask">
        <span class="delete-icon">×</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { Task } from '../types/task'
import { useI18nStore } from '../stores/i18n'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggleStatus: [id: string]
  delete: [id: string]
  viewDetails: [id: string]
}>()

const i18nStore = useI18nStore()
const { t, locale } = storeToRefs(i18nStore)

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const isZh = locale.value === 'zh-CN'
  
  if (isZh) {
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } else {
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}

const getStatusText = computed(() => {
  switch (props.task.status) {
    case 'pending':
      return t.value.pending
    case 'in-progress':
      return t.value.inProgress
    case 'completed':
      return t.value.completed
    default:
      return t.value.pending
  }
})

const getStatusTitle = computed(() => {
  return `${t.value.pending} / ${t.value.inProgress} / ${t.value.completed}`
})

const handleToggle = (e: Event) => {
  e.stopPropagation()
  emit('toggleStatus', props.task.id)
}

const handleDelete = (e: Event) => {
  e.stopPropagation()
  emit('delete', props.task.id)
}

const handleViewDetails = () => {
  emit('viewDetails', props.task.id)
}
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.task-item {
  background: var(--card-bg);
  padding: @spacing-md;
  border-radius: @border-radius-md;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all @transition-base;
  cursor: pointer;

  &:hover {
    box-shadow: @shadow-sm;
    transform: translateY(-1px);
  }

  .task-main {
    display: flex;
    align-items: center;
    flex: 1;
    gap: @spacing-md;

    .status-tag {
      display: inline-block;
      padding: 6px 12px;
      border-radius: @border-radius-full;
      font-size: @font-size-sm;
      font-weight: @font-weight-medium;
      cursor: pointer;
      transition: all @transition-fast;
      white-space: nowrap;
      user-select: none;
      flex-shrink: 0;
      width: 100px;
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

      &.status-pending {
        background: var(--status-pending-bg);
        color: var(--status-pending-color);
      }

      &.status-in-progress {
        background: var(--status-in-progress-bg);
        color: var(--status-in-progress-color);
      }

      &.status-completed {
        background: var(--status-completed-bg);
        color: var(--status-completed-color);
      }
    }

  .task-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: @spacing-xs;
    min-width: 0;
  }

  .task-content {
    cursor: pointer;
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      opacity: 0.8;
    }
  }

  .task-date {
    font-size: @font-size-xs;
    color: var(--text-tertiary);
    font-family: 'Monaco', 'Menlo', monospace;
  }
}

&.done {
  .task-main .task-content {
    text-decoration: line-through;
    font-style: italic;
    color: var(--text-tertiary);
  }
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: @spacing-xs;
}

.delete-btn {
  width: @spacing-lg;
  height: @spacing-lg;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all @transition-fast;

  &:hover {
    transform: scale(1.1);
    background: var(--error-color);
    color: white;
  }

  .delete-icon {
    font-size: @font-size-lg;
    line-height: 1;
    font-weight: @font-weight-bold;
  }
}
}
</style>

