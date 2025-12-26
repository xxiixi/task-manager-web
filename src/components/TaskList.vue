<template>
  <div class="task-list">
    <TaskListItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @toggle-status="handleToggleStatus"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import TaskListItem from './TaskListItem.vue'
import type { Task } from '../types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  toggleStatus: [id: string]
  delete: [id: string]
}>()

const handleToggleStatus = (id: string) => {
  emit('toggleStatus', id)
}

const handleDelete = (id: string) => {
  emit('delete', id)
}
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.task-list {
  display: grid;
  row-gap: 14px;
}
</style>

