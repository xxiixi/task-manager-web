import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Task, TaskStatus, TaskPriority, TaskFilters } from '@/types/task'

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

        // 优先级筛选
        if (filters.priority && filters.priority !== 'all') {
          result = result.filter((task) => task.priority === filters.priority)
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

        // 日期范围筛选
        if (filters.dateRange) {
          const { start, end } = filters.dateRange
          if (start) {
            result = result.filter((task) => !task.dueDate || task.dueDate >= start)
          }
          if (end) {
            result = result.filter((task) => !task.dueDate || task.dueDate <= end)
          }
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

    return {
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      getTaskById,
      filteredTasks,
      taskStats,
    }
  },
  {
    persist: {
      key: 'task-manager-storage',
      storage: localStorage,
    },
  }
)

