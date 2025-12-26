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
import type { Task } from '@/types/task'
import { useI18nStore } from '@/stores/i18n'

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
  background: white;
  padding: 16px;
  border-radius: @border-radius-md;
  color: @text-secondary;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all @transition-base;
}

html.dark .task-item {
  background: @card-bg-dark;
  color: @text-secondary-dark;
}

.task-item:hover {
  box-shadow: @shadow-sm;
}

.task-item label {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 1;
}

.task-item.done label .task-content {
  text-decoration: line-through;
  font-style: italic;
  color: @text-tertiary;
}

html.dark .task-item.done label .task-content {
  color: @text-tertiary-dark;
}

/* 选中item的动画特效 */
.task-item label span.check-button {
  position: absolute;
  top: 0;
  left: 0;
}

.task-item label span.check-button::before,
.task-item label span.check-button::after {
  content: '';
  display: block;
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.task-item label span.check-button::before {
  border: 1px solid @primary-color;
}

.task-item label span.check-button::after {
  transition: 0.4s;
  background: @primary-color;
  transform: translate(1px, 1px) scale(0.8);
  opacity: 0;
}

.task-item input {
  margin-right: 16px;
  opacity: 0;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.task-item input:checked + span.check-button::after {
  opacity: 1;
}

.task-content {
  margin-left: 34px;
  flex: 1;
}

.delete-btn {
  width: 24px;
  height: 24px;
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
}

.task-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: @error-color;
  color: white;
  transform: scale(1.1);
}

.delete-icon {
  font-size: 20px;
  line-height: 1;
  font-weight: @font-weight-bold;
}
</style>

