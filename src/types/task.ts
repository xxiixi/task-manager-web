/**
 * 任务状态枚举
 */
export type TaskStatus = 'pending' | 'in-progress' | 'completed'

/**
 * 任务优先级枚举
 */
export type TaskPriority = 'low' | 'medium' | 'high'

/**
 * 任务数据模型
 */
export interface Task {
  /** 唯一标识符 */
  id: string
  /** 任务标题 */
  title: string
  /** 任务描述 */
  description?: string
  /** 任务状态 */
  status: TaskStatus
  /** 优先级 */
  priority: TaskPriority
  /** 标签 */
  tags?: string[]
  /** 创建时间戳 */
  createdAt: number
  /** 更新时间戳 */
  updatedAt: number
  /** 截止日期时间戳 */
  dueDate?: number
}

/**
 * 任务筛选条件
 */
export interface TaskFilters {
  /** 状态筛选 */
  status?: TaskStatus | 'all'
  /** 优先级筛选 */
  priority?: TaskPriority | 'all'
  /** 标签筛选 */
  tags?: string[]
  /** 关键词搜索 */
  keyword?: string
  /** 日期范围筛选 */
  dateRange?: {
    start?: number
    end?: number
  }
}

