<template>
  <div class="task-item" :class="{ done: task.status === 'completed' }">
    <label>
      <input
        type="checkbox"
        :checked="task.status === 'completed'"
        @click="handleToggle"
      />
      <span class="check-button"></span>
      <span class="task-content">{{ task.title }}</span>
    </label>
    <button class="delete-btn" @click="handleDelete" :title="t.deleteTask">
      <span class="delete-icon">×</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { Task } from '../types/task'
import { useI18nStore } from '../stores/i18n'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggleStatus: [id: string]
  delete: [id: string]
}>()

const i18nStore = useI18nStore()
const { t } = storeToRefs(i18nStore)

const handleToggle = (e: Event) => {
  emit('toggleStatus', props.task.id)
}

const handleDelete = (e: Event) => {
  e.stopPropagation()
  emit('delete', props.task.id)
}
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.task-item {
  background: @card-bg;
  padding: @spacing-md;
  border-radius: @border-radius-md;
  color: @text-secondary;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all @transition-base;

  html.dark & {
    background: @card-bg-dark;
    color: @text-secondary-dark;
  }

  &:hover {
    box-shadow: @shadow-sm;

    .delete-btn {
      opacity: 1;
    }
  }

  label {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    flex: 1;

    .check-button {
      position: absolute;
      top: 0;
      left: 0;

      &::before,
      &::after {
        content: '';
        display: block;
        position: absolute;
        width: @font-size-lg;
        height: @font-size-lg;
        border-radius: 50%;
      }

      &::before {
        border: 1px solid @primary-color;
      }

      &::after {
        transition: @transition-base;
        background: @primary-color;
        transform: translate(1px, 1px) scale(0.8);
        opacity: 0;
      }
    }

    input {
      margin-right: @spacing-md;
      opacity: 0;
      width: @font-size-lg;
      height: @font-size-lg;
      cursor: pointer;

      &:checked + .check-button::after {
        opacity: 1;
      }
    }

    .task-content {
      margin-left: (@spacing-md + @font-size-lg);
      flex: 1;
    }
  }

  &.done {
    label .task-content {
      text-decoration: line-through;
      font-style: italic;
      color: @text-tertiary;

      html.dark & {
        color: @text-tertiary-dark;
      }
    }
  }

  .delete-btn {
    width: @spacing-lg;
    height: @spacing-lg;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: @text-tertiary;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all @transition-fast;
    opacity: 0;

    &:hover {
      background: @error-color;
      color: white;
      transform: scale(1.1);
    }

    .delete-icon {
      font-size: @font-size-lg;
      line-height: 1;
      font-weight: @font-weight-bold;
    }
  }
}
</style>

