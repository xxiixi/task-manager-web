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
          <label class="form-label">{{ t.taskCategory }}</label>
          <div class="category-options">
            <button
              v-for="category in categoryOptions"
              :key="category"
              class="category-option"
              :class="{ active: selectedCategory === category }"
              @click="selectedCategory = category"
            >
              {{ category }}
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
import type { TaskCategory } from '../types/task'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const taskStore = useTaskStore()
const i18nStore = useI18nStore()
const { t } = storeToRefs(i18nStore)

const taskTitle = ref('')
const taskDescription = ref('')
const selectedCategory = ref<TaskCategory>('😅')
const titleInputRef = ref<HTMLInputElement | null>(null)

// 预设的10个分类 emoji
const categoryOptions: TaskCategory[] = ['😅', '🤯', '🤩', '😶', '🥺', '‼️', '❓', '💗', '💡', '⏰']

// 当弹窗打开时，聚焦到标题输入框
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    taskTitle.value = ''
    taskDescription.value = ''
    selectedCategory.value = '😅'
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
      category: selectedCategory.value,
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

.category-options {
  display: flex;
  gap: @spacing-sm;
  flex-wrap: wrap;
}

.category-option {
  flex: 0 0 auto;
  width: 50px;
  height: 50px;
  padding: 0;
  border-radius: @border-radius-md;
  border: 2px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: @font-size-xl;
  cursor: pointer;
  transition: all @transition-fast;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-1px) scale(1.05);
  }

  &.active {
    border-color: var(--primary-color);
    background: var(--primary-color);
    transform: scale(1.1);
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
  background: var(--primary-hover);
  color: white;

  &:hover {
    background: var(--primary-active);
  }
}

.cancel-btn {
  background: var(--text-tertiary);
  color: white;

  &:hover {
    background: var(--error-color);
  }
}
</style>

