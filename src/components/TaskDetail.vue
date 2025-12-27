<template>
  <div v-if="task" class="task-detail-overlay" @click.self="handleClose">
    <div class="task-detail-modal">
      <div class="task-detail-header">
        <h2>{{ t.taskDetails }}</h2>
        <div class="header-actions">
          <button v-if="!isEditing" class="edit-btn" @click="handleStartEdit" :title="t.editTask">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="close-btn" @click="handleClose" :title="t.close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>
      <div class="task-detail-content">
        <div class="detail-section">
          <label class="detail-label">{{ t.taskTitle }}</label>
          <input
            v-if="isEditing"
            ref="titleInputRef"
            v-model="editTitle"
            type="text"
            class="detail-input"
            @keyup.enter="handleSave"
            @keyup.esc="handleCancel"
          />
          <div v-else class="detail-value">{{ task.title }}</div>
        </div>

        <div class="detail-section">
          <label class="detail-label">{{ t.taskDescription }}</label>
          <textarea
            v-if="isEditing"
            v-model="editDescription"
            class="detail-textarea"
            rows="4"
          ></textarea>
          <div v-else class="detail-value description">
            {{ task.description || t.noDescription }}
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-section">
            <label class="detail-label">{{ t.taskStatus }}</label>
            <span class="status-tag" :class="`status-${task.status}`">
              {{ getStatusText }}
            </span>
          </div>

          <div class="detail-section">
            <label class="detail-label">{{ t.taskPriority }}</label>
            <span class="priority-tag" :class="`priority-${task.priority}`">
              {{ getPriorityText }}
            </span>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-section">
            <label class="detail-label">{{ t.createdAt }}</label>
            <div class="detail-value time">{{ formatDate(task.createdAt) }}</div>
          </div>

          <div class="detail-section">
            <label class="detail-label">{{ t.updatedAt }}</label>
            <div class="detail-value time">{{ formatDate(task.updatedAt) }}</div>
          </div>
        </div>

        <div class="detail-section" v-if="task.dueDate">
          <label class="detail-label">{{ t.dueDate }}</label>
          <div class="detail-value time">{{ formatDate(task.dueDate) }}</div>
        </div>

        <div class="detail-section" v-if="task.tags && task.tags.length > 0">
          <label class="detail-label">{{ t.tags }}</label>
          <div class="tags-container">
            <span v-for="tag in task.tags" :key="tag" class="tag-item">
              {{ tag }}
            </span>
          </div>
        </div>

        <div v-if="isEditing" class="edit-actions">
          <button class="save-btn" @click="handleSave" :title="t.save">
            <i class="bi bi-check-lg"></i>
            <span>{{ t.save }}</span>
          </button>
          <button class="cancel-btn" @click="handleCancel" :title="t.cancel">
            <i class="bi bi-x-lg"></i>
            <span>{{ t.cancel }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { Task } from '../types/task'
import { useI18nStore } from '../stores/i18n'

const props = defineProps<{
  task: Task | null
}>()

const emit = defineEmits<{
  close: []
  update: [id: string, updates: { title: string; description?: string }]
}>()

const i18nStore = useI18nStore()
const { t, locale } = storeToRefs(i18nStore)

const isEditing = ref(false)
const editTitle = ref('')
const editDescription = ref('')
const titleInputRef = ref<HTMLInputElement | null>(null)

// 当任务变化时，重置编辑状态
watch(() => props.task, () => {
  if (props.task) {
    editTitle.value = props.task.title
    editDescription.value = props.task.description || ''
    isEditing.value = false
  }
}, { immediate: true })

const getStatusText = computed(() => {
  if (!props.task) return ''
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

const getPriorityText = computed(() => {
  if (!props.task) return ''
  switch (props.task.priority) {
    case 'low':
      return t.value.priorityNormal
    case 'medium':
      return t.value.priorityImportant
    case 'high':
      return t.value.priorityUrgent
    default:
      return t.value.priorityNormal
  }
})

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const isZh = locale.value === 'zh-CN'
  
  if (isZh) {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } else {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}

const handleClose = () => {
  isEditing.value = false
  emit('close')
}

const handleStartEdit = () => {
  if (!props.task) return
  editTitle.value = props.task.title
  editDescription.value = props.task.description || ''
  isEditing.value = true
  nextTick(() => {
    titleInputRef.value?.focus()
    titleInputRef.value?.select()
  })
}

const handleSave = () => {
  if (!props.task) return
  const trimmedTitle = editTitle.value.trim()
  if (trimmedTitle) {
    emit('update', props.task.id, {
      title: trimmedTitle,
      description: editDescription.value.trim() || undefined,
    })
    isEditing.value = false
  }
}

const handleCancel = () => {
  if (!props.task) return
  editTitle.value = props.task.title
  editDescription.value = props.task.description || ''
  isEditing.value = false
}
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.task-detail-overlay {
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

.task-detail-modal {
  background: var(--card-bg);
  border-radius: @border-radius-xl;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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

.task-detail-header {
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

  .header-actions {
    display: flex;
    align-items: center;
    gap: @spacing-xs;
  }

  .edit-btn,
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
      transform: scale(1.1);
    }
  }

  .edit-btn {
    &:hover {
      background: var(--primary-color);
      color: white;
    }
  }

  .close-btn {
    &:hover {
      background: var(--text-tertiary);
      color: white;
    }
  }
}

.task-detail-content {
  padding: @spacing-lg;
}

.detail-section {
  margin-bottom: @spacing-lg;

  &:last-child {
    margin-bottom: 0;
  }
}

.detail-label {
  display: block;
  font-size: @font-size-sm;
  font-weight: @font-weight-medium;
  color: var(--text-tertiary);
  margin-bottom: @spacing-xs;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: @font-size-md;
  color: var(--text-secondary);
  line-height: @line-height-relaxed;

  &.description {
    white-space: pre-wrap;
    word-break: break-word;
    padding: @spacing-md;
    background: var(--bg-secondary);
    border-radius: @border-radius-md;
    min-height: 60px;
  }

  &.time {
    font-family: 'Monaco', 'Menlo', monospace;
    color: var(--text-primary);
  }
}

.detail-input,
.detail-textarea {
  width: 100%;
  padding: 8px 12px;
  border-radius: @border-radius-md;
  border: 1px solid var(--border-color);
  outline: none;
  font-size: @font-size-md;
  font-family: @font-family;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  transition: all @transition-base;

  &:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(233, 30, 99, 0.1);
  }

  &::placeholder {
    color: var(--text-tertiary);
  }
}

.detail-input {
  font-weight: @font-weight-medium;
}

.detail-textarea {
  resize: vertical;
  min-height: 100px;
  font-size: @font-size-sm;
  line-height: @line-height-relaxed;
}

.edit-actions {
  display: flex;
  gap: @spacing-sm;
  justify-content: flex-end;
  margin-top: @spacing-lg;
  padding-top: @spacing-lg;
  border-top: 1px solid var(--border-color);
}

.save-btn,
.cancel-btn {
  display: flex;
  align-items: center;
  gap: @spacing-xs;
  padding: 8px 16px;
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

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-lg;
  margin-bottom: @spacing-lg;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: @spacing-md;
  }
}

.status-tag,
.priority-tag {
  display: inline-block;
  padding: 6px 12px;
  border-radius: @border-radius-full;
  font-size: @font-size-sm;
  font-weight: @font-weight-medium;
  white-space: nowrap;
}

.status-tag {
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

.priority-tag {
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

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: @spacing-xs;
}

.tag-item {
  display: inline-block;
  padding: 4px 10px;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border-radius: @border-radius-sm;
  font-size: @font-size-sm;
  border: 1px solid var(--border-color);
}
</style>

