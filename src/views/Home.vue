
<template>
    <main>
      <HeaderToolbar />
      <div class="container">
        <div class="title-section">
          <h1>{{ t?.title || 'Task Manager' }}</h1>
          <TaskAdd @open="handleOpenAddModal" />
        </div>
        <div class="header-section">
          <div class="search-container">
            <input
              type="text"
              v-model="searchKeyword"
              :placeholder="t?.searchPlaceholder || '搜索任务...'"
              class="search-input"
            />
            <i class="bi bi-search search-icon"></i>
          </div>
          <TaskFilter
            :selected="filter"
            :selected-category="categoryFilter"
            :selected-sort="sortBy"
            @change-filter="handleFilterChange"
            @change-category="handleCategoryChange"
            @change-sort="handleSortChange"
          />
        </div>
        <div class="task-list-wrapper">
        <TaskList
          :tasks="filteredTasks"
          @toggle-status="handleToggleStatus"
          @delete="handleDelete"
          @view-details="handleViewDetails"
        />
        </div>
      </div>
      <TaskDetail
        :task="selectedTask"
        @close="handleCloseDetail"
        @update="handleUpdate"
        @toggle-status="handleToggleStatus"
      />
      <TaskAddModal :is-open="isAddModalOpen" @close="handleCloseAddModal" />
    </main>
  </template>
    
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
import type { TaskStatus, TaskCategory } from '../types/task'
import type { Task } from '../types/task'

const i18nStore = useI18nStore()
const { t } = storeToRefs(i18nStore)

const taskStore = useTaskStore()
const filter = ref<'all' | TaskStatus>('all')
const categoryFilter = ref<TaskCategory | 'all'>('all')
const sortBy = ref<'updatedTime' | 'createdTime'>('updatedTime')
const searchKeyword = ref('')
const selectedTask = ref<Task | null>(null)
const isAddModalOpen = ref(false)

// 筛选任务（支持状态筛选、分类筛选和关键词搜索）
const filteredTasks = computed(() => {
  let tasks = taskStore.filteredTasks({
    status: filter.value === 'all' ? undefined : filter.value,
    category: categoryFilter.value === 'all' ? undefined : categoryFilter.value,
    keyword: searchKeyword.value.trim() || undefined,
  })

  // 排序
  const sortedTasks = [...tasks]
  if (sortBy.value === 'updatedTime') {
    sortedTasks.sort((a, b) => b.updatedAt - a.updatedAt)
  } else if (sortBy.value === 'createdTime') {
    sortedTasks.sort((a, b) => b.createdAt - a.createdAt)
  }
  return sortedTasks
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
    // 更新详情页显示的任务数据
    if (selectedTask.value && selectedTask.value.id === id) {
      const updatedTask = taskStore.getTaskById(id)
      if (updatedTask) {
        selectedTask.value = updatedTask
      }
    }
  }
}

// 删除任务
const handleDelete = (id: string) => {
  taskStore.deleteTask(id)
}

// 更新任务
const handleUpdate = (id: string, updates: { title: string; description?: string; status?: TaskStatus; category?: TaskCategory }) => {
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

// 切换分类筛选
const handleCategoryChange = (value: TaskCategory | 'all') => {
  categoryFilter.value = value
}

// 切换排序
const handleSortChange = (value: 'updatedTime' | 'createdTime') => {
  sortBy.value = value
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
      max-width: 700px;
      min-width: 300px;
      height: 80vh;
      box-shadow: @shadow-lg;
      border-radius: @border-radius-2xl;
      padding: 25px 30px;
      background-color: var(--bg-secondary);
      transition: background-color @transition-base;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .title-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: @spacing-lg 0;
      flex-shrink: 0;
    }
    
    h1 {
      margin: 0;
      font-size: @font-size-2xl;
      color: var(--text-primary);
      text-align: left;
      transition: color @transition-base;
      flex: 1;
    }
    
    .header-section {
      flex-shrink: 0;
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
    
    .task-list-wrapper {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      min-height: 0;
      margin-top: @spacing-md;
    }
  </style>