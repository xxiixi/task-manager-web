<template>
  <div v-if="isOpen" class="task-add-overlay" @click.self="handleClose">
    <div class="task-add-modal">
      <div class="modal-header">
        <h2>{{ t.addTask }}</h2>
        <button class="close-btn" @click="handleClose" :title="t.close">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="modal-content">
        <div class="form-section">
          <label class="form-label">{{ t.taskTitle }}</label>
          <input
            ref="titleInputRef"
            v-model="taskTitle"
            type="text"
            class="form-input"
            :placeholder="t.taskTitle"
            @keyup.enter="handleSave"
            @keyup.esc="handleClose"
          />
        </div>

        <div class="form-section">
          <label class="form-label">{{ t.taskDescription }}</label>
          <textarea
            v-model="taskDescription"
            class="form-textarea"
            :placeholder="t.taskDescription"
            rows="4"
          ></textarea>
        </div>

        <div class="form-section">
          <label class="form-label">{{ t.taskPriority }}</label>
          <div class="priority-options">
            <button
              v-for="priority in priorityOptions"
              :key="priority.value"
              class="priority-option"
              :class="[
                `priority-${priority.value}`,
                { active: selectedPriority === priority.value }
              ]"
              @click="selectedPriority = priority.value"
            >
              {{ priority.label }}
            </button>
          </div>
        </div>
      </div>
      <div class="modal-actions">
        <button class="save-btn" @click="handleSave" :title="t.save">
          <i class="bi bi-check-lg"></i>
          <span>{{ t.save }}</span>
        </button>
        <button class="cancel-btn" @click="handleClose" :title="t.cancel">
          <i class="bi bi-x-lg"></i>
          <span>{{ t.cancel }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/task'
import { useI18nStore } from '../stores/i18n'
import type { TaskPriority } from '../types/task'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const taskStore = useTaskStore()
const i18nStore = useI18nStore()
const { t, locale } = storeToRefs(i18nStore)

const taskTitle = ref('')
const taskDescription = ref('')
const selectedPriority = ref<TaskPriority>('low')
const titleInputRef = ref<HTMLInputElement | null>(null)

const priorityOptions = computed(() => [
  { value: 'low' as TaskPriority, label: t.value.priorityNormal },
  { value: 'medium' as TaskPriority, label: t.value.priorityImportant },
  { value: 'high' as TaskPriority, label: t.value.priorityUrgent },
])

// 当弹窗打开时，聚焦到标题输入框
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    taskTitle.value = ''
    taskDescription.value = ''
    selectedPriority.value = 'low'
    nextTick(() => {
      titleInputRef.value?.focus()
    })
  }
})

const handleClose = () => {
  emit('close')
}

const handleSave = () => {
  const trimmedTitle = taskTitle.value.trim()
  if (trimmedTitle) {
    taskStore.addTask({
      title: trimmedTitle,
      description: taskDescription.value.trim() || undefined,
      status: 'pending',
      priority: selectedPriority.value,
    })
    handleClose()
  }
}
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.task-add-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: @z-index-modal;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.task-add-modal {
  background: var(--card-bg);
  border-radius: @border-radius-xl;
  width: 90%;
  max-width: 500px;
  box-shadow: @shadow-xl;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: @spacing-lg;
  border-bottom: 1px solid var(--border-color);

  h2 {
    margin: 0;
    font-size: @font-size-xl;
    color: var(--text-primary);
    font-weight: @font-weight-semibold;
  }

  .close-btn {
    width: 32px;
    height: 32px;
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
      background: var(--text-tertiary);
      color: white;
      transform: scale(1.1);
    }
  }
}

.modal-content {
  padding: @spacing-lg;
}

.form-section {
  margin-bottom: @spacing-lg;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: @font-size-sm;
  font-weight: @font-weight-medium;
  color: var(--text-tertiary);
  margin-bottom: @spacing-xs;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border-radius: @border-radius-md;
  border: 1px solid var(--border-color);
  outline: none;
  font-size: @font-size-md;
  font-family: @font-family;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  transition: all @transition-base;
  box-sizing: border-box;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.1);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
}

.form-input {
  font-weight: @font-weight-medium;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-size: @font-size-sm;
  line-height: @line-height-relaxed;
}

.priority-options {
  display: flex;
  gap: @spacing-sm;
}

.priority-option {
  flex: 1;
  padding: 10px 16px;
  border-radius: @border-radius-md;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: @font-size-sm;
  font-weight: @font-weight-medium;
  cursor: pointer;
  transition: all @transition-fast;

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-1px);
  }

  &.active {
    color: white;
  }

  &.priority-low.active {
    background: var(--priority-low-color);
    border-color: var(--priority-low-color);
  }

  &.priority-medium.active {
    background: var(--priority-medium-color);
    border-color: var(--priority-medium-color);
  }

  &.priority-high.active {
    background: var(--priority-high-color);
    border-color: var(--priority-high-color);
  }
}

.modal-actions {
  display: flex;
  gap: @spacing-sm;
  justify-content: flex-end;
  padding: @spacing-lg;
  border-top: 1px solid var(--border-color);
}

.save-btn,
.cancel-btn {
  display: flex;
  align-items: center;
  gap: @spacing-xs;
  padding: 10px 20px;
  border-radius: @border-radius-md;
  border: none;
  cursor: pointer;
  font-size: @font-size-md;
  font-weight: @font-weight-medium;
  transition: all @transition-fast;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  i {
    font-size: @font-size-lg;
  }
}

.save-btn {
  background: #f06292;
  color: white;

  &:hover {
    background: #e91e63;
  }
}

.cancel-btn {
  background: #9ca3af;
  color: white;

  &:hover {
    background: #ef4444;
  }
}
</style>

