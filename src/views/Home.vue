<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTaskStore } from '@/stores/task'
import { useI18nStore } from '@/stores/i18n'
import TaskAdd from '@/components/TaskAdd.vue'
import TaskList from '@/components/TaskList.vue'
import TaskFilter from '@/components/TaskFilter.vue'
import HeaderToolbar from '@/components/HeaderToolbar.vue'
import type { TaskStatus } from '@/types/task'

const i18nStore = useI18nStore()
const { t } = storeToRefs(i18nStore)

const taskStore = useTaskStore()
const filter = ref<'all' | TaskStatus>('all')

// 筛选任务
const filteredTasks = computed(() => {
  switch (filter.value) {
    case 'completed':
      return taskStore.tasks.filter((task) => task.status === 'completed')
    case 'pending':
      return taskStore.tasks.filter((task) => task.status === 'pending')
    case 'in-progress':
      return taskStore.tasks.filter((task) => task.status === 'in-progress')
    default:
      return taskStore.tasks
  }
})

// 切换任务状态（简化为 pending 和 completed 之间的切换，类似 vue-todo-app）
const handleToggleStatus = (id: string) => {
  const task = taskStore.getTaskById(id)
  if (task) {
    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 'completed'
    taskStore.updateTask(id, { status: newStatus })
  }
}

// 删除任务
const handleDelete = (id: string) => {
  taskStore.deleteTask(id)
}

// 切换筛选
const handleFilterChange = (value: 'all' | TaskStatus) => {
  filter.value = value
}
</script>

<template>
  <main>
    <HeaderToolbar />
    <div class="container">
      <h1>{{ t?.title || 'Task Manager' }}</h1>
      <TaskAdd />
      <TaskFilter :selected="filter" @change-filter="handleFilterChange" />
      <TaskList
        :tasks="filteredTasks"
        @toggle-status="handleToggleStatus"
        @delete="handleDelete"
      />
    </div>
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
  background: @bg-color;
  transition: background-color @transition-base;
}

:global(.dark) main {
  background: @bg-color-dark;
}

.container {
  width: 60%;
  max-width: 400px;
  box-shadow: @shadow-lg;
  border-radius: @border-radius-2xl;
  padding: 48px 28px;
  background-color: @bg-secondary;
  transition: background-color @transition-base;
}

:global(.dark) .container {
  background-color: @bg-secondary-dark;
}

h1 {
  margin: 24px 0;
  font-size: @font-size-2xl;
  color: @text-primary;
  text-align: center;
  transition: color @transition-base;
}

:global(.dark) h1 {
  color: @text-primary-dark;
}
</style>

