<template>
  <div class="filters">
    <span
      v-for="filter in filters"
      :key="filter.value"
      @click="$emit('change-filter', filter.value)"
      class="filter"
      :class="{ active: selected === filter.value }"
    >
      {{ filter.label }}
    </span>
    <div class="category-filter-wrapper" ref="categoryFilterRef">
      <span
        class="filter category-filter-btn"
        @click="toggleCategoryDropdown"
      >
        <i class="bi bi-funnel-fill"></i>
        {{ t.filterByCategory }}
      </span>
      <div v-if="showCategoryDropdown" class="category-dropdown">
        <div
          class="category-option"
          :class="{ active: selectedCategory === 'all' }"
          @click="selectCategory('all')"
        >
          {{ t.all }}
        </div>
        <div
          v-for="category in usedCategories"
          :key="category"
          class="category-option"
          :class="{ active: selectedCategory === category }"
          @click="selectCategory(category)"
        >
          {{ category }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import type { TaskStatus, TaskCategory } from '../types/task'
import { useI18nStore } from '../stores/i18n'
import { useTaskStore } from '../stores/task'

type FilterValue = 'all' | TaskStatus

const props = defineProps<{
  selected: FilterValue
  selectedCategory?: TaskCategory | 'all'
}>()

const emit = defineEmits<{
  'change-filter': [value: FilterValue]
  'change-category': [value: TaskCategory | 'all']
}>()

const i18nStore = useI18nStore()
const { t } = storeToRefs(i18nStore)

const taskStore = useTaskStore()
const showCategoryDropdown = ref(false)
const categoryFilterRef = ref<HTMLElement | null>(null)
const selectedCategory = computed(() => props.selectedCategory || 'all')

// 获取已使用的分类（去重）
const usedCategories = computed(() => {
  const categories = new Set<TaskCategory>()
  taskStore.tasks.forEach((task) => {
    categories.add(task.category)
  })
  return Array.from(categories).sort()
})

const filters = computed(() => [
  { label: t.value.all, value: 'all' as FilterValue },
  { label: t.value.pending, value: 'pending' as FilterValue },
  { label: t.value.inProgress, value: 'in-progress' as FilterValue },
  { label: t.value.completed, value: 'completed' as FilterValue },
])

const toggleCategoryDropdown = () => {
  showCategoryDropdown.value = !showCategoryDropdown.value
}

const closeCategoryDropdown = () => {
  showCategoryDropdown.value = false
}

const selectCategory = (category: TaskCategory | 'all') => {
  emit('change-category', category)
  closeCategoryDropdown()
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (categoryFilterRef.value && !categoryFilterRef.value.contains(target)) {
    closeCategoryDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.filters {
  display: flex;
  align-items: center;
  margin: @spacing-lg @spacing-xs;
  color: var(--filter-inactive);
  font-size: @font-size-sm;

  .filter {
    margin-right: (@spacing-sm + @spacing-xs);
    transition: @transition-slow;
    cursor: pointer;
    user-select: none;

    &:hover:not(.active) {
      color: var(--filter-active);
      transform: scale(1.1);
      opacity: 0.8;
    }

    &.active {
      color: var(--filter-active);
      transform: scale(1.2);
      font-weight: @font-weight-medium;
    }
  }

  .category-filter-wrapper {
    position: relative;
    margin-left: auto;

    .category-filter-btn {
      display: inline-flex;
      align-items: center;
      gap: @spacing-xs;
      padding: @spacing-xs @spacing-sm;
      border-radius: @border-radius-md;
      background: var(--card-bg);
      border: 1px solid var(--border-color);

      i {
        font-size: @font-size-sm;
      }

      &:hover {
        background: var(--card-hover-bg);
        border-color: var(--border-hover);
      }
    }

    .category-dropdown {
      position: absolute;
      top: calc(100% + @spacing-xs);
      right: 0;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: @border-radius-md;
      box-shadow: @shadow-lg;
      min-width: 80px;
      max-height: 300px;
      overflow-y: auto;
      z-index: @z-index-dropdown;
      padding: @spacing-xs;

      .category-option {
        padding: @spacing-sm;
        cursor: pointer;
        transition: all @transition-fast;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: @font-size-xl;
        min-height: 44px;
        border-radius: @border-radius-sm;
        margin-bottom: @spacing-xs;

        &:last-child {
          margin-bottom: 0;
        }

        &:hover:not(.active) {
          background: var(--card-hover-bg);
        }

        &.active {
          background: var(--bg-secondary);
          border: 2px solid var(--primary-color);
        }

        &:first-child {
          font-size: @font-size-sm;
          color: var(--text-secondary);
          font-weight: @font-weight-normal;
          min-height: 36px;

          &.active {
            background: var(--bg-secondary);
            border: 2px solid var(--primary-color);
            color: var(--text-primary);
          }
        }
      }
    }
  }
}
</style>

