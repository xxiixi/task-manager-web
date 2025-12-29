import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
// @ts-ignore
import type { Task, TaskStatus, TaskCategory, TaskFilters } from '@/types/task'

export const useTaskStore = defineStore(
  'task',
  () => {
    // 任务列表
    const tasks = ref<Task[]>([])

    /**
     * 添加任务
     */
    function addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      tasks.value.push(newTask)
      return newTask
    }

    /**
     * 更新任务
     */
    function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) {
      const taskIndex = tasks.value.findIndex((task) => task.id === id)
      if (taskIndex !== -1) {
        const existingTask = tasks.value[taskIndex]
        tasks.value[taskIndex] = {
          ...existingTask,
          ...updates,
          updatedAt: Date.now(),
        } as Task
        return tasks.value[taskIndex]
      }
      return null
    }

    /**
     * 删除任务
     */
    function deleteTask(id: string) {
      const taskIndex = tasks.value.findIndex((task) => task.id === id)
      if (taskIndex !== -1) {
        tasks.value.splice(taskIndex, 1)
        return true
      }
      return false
    }

    /**
     * 切换任务状态
     */
    function toggleTaskStatus(id: string) {
      const task = tasks.value.find((t) => t.id === id)
      if (task) {
        const statusMap: Record<TaskStatus, TaskStatus> = {
          pending: 'in-progress',
          'in-progress': 'completed',
          completed: 'pending',
        }
        updateTask(id, { status: statusMap[task.status] })
        return true
      }
      return false
    }

    /**
     * 根据 ID 获取任务
     */
    function getTaskById(id: string): Task | undefined {
      return tasks.value.find((task) => task.id === id)
    }

    /**
     * 筛选任务
     */
    const filteredTasks = computed(() => {
      return (filters: TaskFilters) => {
        let result = [...tasks.value]

        // 状态筛选
        if (filters.status && filters.status !== 'all') {
          result = result.filter((task) => task.status === filters.status)
        }

        // 分类筛选
        if (filters.category && filters.category !== 'all') {
          result = result.filter((task) => task.category === filters.category)
        }

        // 标签筛选
        if (filters.tags && filters.tags.length > 0) {
          result = result.filter((task) => {
            return task.tags?.some((tag) => filters.tags!.includes(tag))
          })
        }

        // 关键词搜索
        if (filters.keyword) {
          const keyword = filters.keyword.toLowerCase()
          result = result.filter(
            (task) =>
              task.title.toLowerCase().includes(keyword) ||
              task.description?.toLowerCase().includes(keyword)
          )
        }

        return result
      }
    })

    /**
     * 获取任务统计信息
     */
    const taskStats = computed(() => {
      const total = tasks.value.length
      const pending = tasks.value.filter((t) => t.status === 'pending').length
      const inProgress = tasks.value.filter((t) => t.status === 'in-progress').length
      const completed = tasks.value.filter((t) => t.status === 'completed').length

      return {
        total,
        pending,
        inProgress,
        completed,
      }
    })

    /**
     * 导出任务数据
     */
    function exportData() {
      const data = {
        tasks: tasks.value,
      }
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      link.href = url
      link.download = `task-manager-export-${timestamp}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    /**
     * 导入任务数据
     */
    function importData(importedTasks: Task[]) {
      // 验证数据格式
      if (!Array.isArray(importedTasks)) {
        throw new Error('无效的数据格式：任务数据必须是数组')
      }

      // 验证每个任务的必要字段
      for (const task of importedTasks) {
        if (!task.id || !task.title || !task.status || !task.category) {
          throw new Error('无效的数据格式：任务缺少必要字段')
        }
      }

      // 清空现有任务并导入新任务
      tasks.value = importedTasks
    }

    return {
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      getTaskById,
      filteredTasks,
      taskStats,
      exportData,
      importData,
    }
  },
  {
    persist: {
      key: 'task-manager-storage',
      storage: localStorage,
    },
  }
)

