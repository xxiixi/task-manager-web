<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/task'
import { useI18nStore } from '../stores/i18n'
import TaskAdd from '../components/TaskAdd.vue'
import TaskAddModal from '../components/TaskAddModal.vue'
import TaskList from '../components/TaskList.vue'
import TaskFilter from '../components/TaskFilter.vue'
import HeaderToolbar from '../components/HeaderToolbar.vue'
import TaskDetail from '../components/TaskDetail.vue'
import type { TaskStatus } from '../types/task'
import type { Task } from '../types/task'

const i18nStore = useI18nStore()
const { t } = storeToRefs(i18nStore)

const taskStore = useTaskStore()
const filter = ref<'all' | TaskStatus>('all')
const searchKeyword = ref('')
const selectedTask = ref<Task | null>(null)
const isAddModalOpen = ref(false)

// 筛选任务（支持状态筛选和关键词搜索）
const filteredTasks = computed(() => {
  return taskStore.filteredTasks({
    status: filter.value === 'all' ? undefined : filter.value,
    keyword: searchKeyword.value.trim() || undefined,
  })
})

// 切换任务状态（在 pending -> in-progress -> completed -> pending 之间循环）
const handleToggleStatus = (id: string) => {
  const task = taskStore.getTaskById(id)
  if (task) {
    const statusMap: Record<TaskStatus, TaskStatus> = {
      pending: 'in-progress',
      'in-progress': 'completed',
      completed: 'pending',
    }
    const newStatus = statusMap[task.status]
    taskStore.updateTask(id, { status: newStatus })
  }
}

// 删除任务
const handleDelete = (id: string) => {
  taskStore.deleteTask(id)
}

// 更新任务
const handleUpdate = (id: string, updates: { title: string; description?: string }) => {
  taskStore.updateTask(id, updates)
  // 更新详情页显示的任务数据
  if (selectedTask.value && selectedTask.value.id === id) {
    const updatedTask = taskStore.getTaskById(id)
    if (updatedTask) {
      selectedTask.value = updatedTask
    }
  }
}

// 切换筛选
const handleFilterChange = (value: 'all' | TaskStatus) => {
  filter.value = value
}

// 查看任务详情
const handleViewDetails = (id: string) => {
  const task = taskStore.getTaskById(id)
  if (task) {
    selectedTask.value = task
  }
}

// 关闭详情弹窗
const handleCloseDetail = () => {
  selectedTask.value = null
}

// 打开添加任务弹窗
const handleOpenAddModal = () => {
  isAddModalOpen.value = true
}

// 关闭添加任务弹窗
const handleCloseAddModal = () => {
  isAddModalOpen.value = false
}
</script>

<template>
  <main>
    <HeaderToolbar />
    <div class="container">
      <h1>{{ t?.title || 'Task Manager' }}</h1>
      <TaskAdd @open="handleOpenAddModal" />
      <div class="search-container">
        <input
          type="text"
          v-model="searchKeyword"
          :placeholder="t?.searchPlaceholder || '搜索任务...'"
          class="search-input"
        />
        <i class="bi bi-search search-icon"></i>
      </div>
      <TaskFilter :selected="filter" @change-filter="handleFilterChange" />
      <TaskList
        :tasks="filteredTasks"
        @toggle-status="handleToggleStatus"
        @delete="handleDelete"
        @view-details="handleViewDetails"
      />
    </div>
    <TaskDetail :task="selectedTask" @close="handleCloseDetail" @update="handleUpdate" />
    <TaskAddModal :is-open="isAddModalOpen" @close="handleCloseAddModal" />
  </main>
</template>

<style scoped lang="less">
@import '@/styles/variables.less';

main {
  width: 100vw;
  min-height: 100vh;
  display: grid;
  align-items: center;
  justify-items: center;
  background: var(--bg-color);
  transition: background-color @transition-base;
}

.container {
  width: 90%;
  max-width: 800px;
  min-width: 400px;
  height: 660px;
  box-shadow: @shadow-lg;
  border-radius: @border-radius-2xl;
  padding: 48px 28px;
  background-color: var(--bg-secondary);
  transition: background-color @transition-base;
}

h1 {
  margin: @spacing-lg 0;
  font-size: @font-size-2xl;
  color: var(--text-primary);
  text-align: center;
  transition: color @transition-base;
}

.search-container {
  position: relative;
  margin: @spacing-md 0;
  display: flex;
  align-items: center;

  .search-input {
    width: 100%;
    padding: 12px 40px 12px 16px;
    border-radius: @border-radius-xl;
    border: none;
    outline: none;
    box-shadow: @shadow-input;
    font-size: @font-size-md;
    background: var(--card-bg);
    color: var(--text-secondary);
    font-family: @font-family;
    transition: all @transition-base;

    &::placeholder {
      color: var(--text-tertiary);
    }

    &:focus {
      box-shadow: @shadow-md;
    }
  }

  .search-icon {
    position: absolute;
    right: 12px;
    color: var(--text-tertiary);
    font-size: @font-size-lg;
    pointer-events: none;
  }
}
</style>

