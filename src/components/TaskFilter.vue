<template>
  <div class="filters">
    <div class="filter-group">
      <div class="filter-tabs">
        <span
          v-for="filter in filters"
          :key="filter.value"
          @click="$emit('change-filter', filter.value)"
          class="filter"
          :class="{ active: selected === filter.value }"
        >
          {{ filter.label }}
        </span>
      </div>
    </div>
    <div class="action-buttons">
      <div class="search-container">
        <input
          type="text"
          :value="searchKeyword"
          @input="handleSearchInput"
          :placeholder="t.searchPlaceholder || '搜索任务...'"
          class="search-input"
        />
        <i class="bi bi-search search-icon"></i>
      </div>
      <div class="sort-wrapper" ref="sortFilterRef">
        <span
          class="filter sort-btn"
          @click="toggleSortDropdown"
        >
          <i class="bi bi-sort-down"></i>
          {{ t.sortBy }}
        </span>
        <div v-if="showSortDropdown" class="sort-dropdown">
          <div
            class="sort-option"
            :class="{ active: selectedSort === 'updatedTime' }"
            @click="selectSort('updatedTime')"
          >
            {{ t.sortByUpdatedTime }}
          </div>
          <div
            class="sort-option"
            :class="{ active: selectedSort === 'createdTime' }"
            @click="selectSort('createdTime')"
          >
            {{ t.sortByCreatedTime }}
          </div>
        </div>
      </div>
      <div class="category-filter-wrapper" ref="categoryFilterRef">
      <span
        class="filter category-filter-btn"
        @click="toggleCategoryDropdown"
      >
        <i class="bi bi-funnel"></i>
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
  selectedSort?: 'updatedTime' | 'createdTime'
  searchKeyword?: string
}>()

const emit = defineEmits<{
  'change-filter': [value: FilterValue]
  'change-category': [value: TaskCategory | 'all']
  'change-sort': [value: 'updatedTime' | 'createdTime']
  'change-search': [value: string]
}>()

const i18nStore = useI18nStore()
const { t } = storeToRefs(i18nStore)

const taskStore = useTaskStore()
const showCategoryDropdown = ref(false)
const showSortDropdown = ref(false)
const categoryFilterRef = ref<HTMLElement | null>(null)
const sortFilterRef = ref<HTMLElement | null>(null)
const selectedCategory = computed(() => props.selectedCategory || 'all')
const selectedSort = computed(() => props.selectedSort || 'createdTime')

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
  if (showCategoryDropdown.value) {
    showSortDropdown.value = false
  }
}

const closeCategoryDropdown = () => {
  showCategoryDropdown.value = false
}

const selectCategory = (category: TaskCategory | 'all') => {
  emit('change-category', category)
  closeCategoryDropdown()
}

const toggleSortDropdown = () => {
  showSortDropdown.value = !showSortDropdown.value
  if (showSortDropdown.value) {
    showCategoryDropdown.value = false
  }
}

const closeSortDropdown = () => {
  showSortDropdown.value = false
}

const selectSort = (sort: 'updatedTime' | 'createdTime') => {
  emit('change-sort', sort)
  closeSortDropdown()
}

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('change-search', target.value)
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (categoryFilterRef.value && !categoryFilterRef.value.contains(target)) {
    closeCategoryDropdown()
  }
  if (sortFilterRef.value && !sortFilterRef.value.contains(target)) {
    closeSortDropdown()
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
  align-items: flex-start;
  flex-direction: column;
  gap: @spacing-xs;
  margin: 0 @spacing-sm;
  color: var(--filter-inactive);
  font-size: @font-size-sm;

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: @spacing-sm;
    flex: 1;
    position: relative;
    width: 100%;
  }
  
  .filter-tabs {
    display: flex;
    align-items: center;
    position: relative;
    padding-bottom: @spacing-xs;
    margin-left: -@spacing-sm;
    margin-right: -@spacing-sm;
    padding-left: @spacing-sm;
    padding-right: @spacing-sm;
    
    &::before {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--border-color);
    }

    .filter {
      padding: @spacing-sm @spacing-md;
      background: transparent;
      border: none;
      border-radius: 0;
      transition: all @transition-base;
      cursor: pointer;
      user-select: none;
      color: var(--filter-inactive);
      position: relative;
      white-space: nowrap;

      &::after {
        content: '';
        position: absolute;
        bottom: -(@spacing-xs + 1px);
        left: 0;
        right: 0;
        height: 2px;
        background: var(--filter-active-underline);
        opacity: 0;
        transform: scaleX(0);
        transform-origin: left;
        transition: opacity @transition-base, transform @transition-base;
      }

      &:hover:not(.active) {
        color: var(--filter-active);
        transition: color @transition-fast;
      }

      &.active {
        color: var(--filter-active);
        transition: color @transition-base;

        &::after {
          opacity: 1;
          transform: scaleX(1);
        }
      }
    }
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: @spacing-sm;
    width: 100%;
    margin-top: @spacing-sm;
  }

  .search-container {
    position: relative;
    display: flex;
    align-items: center;
    margin-right: auto;

    .search-input {
      padding: 8px 32px 8px 12px;
      border-radius: @border-radius-md;
      border: 1px solid var(--border-color);
      outline: none;
      box-shadow: @shadow-input;
      font-size: @font-size-sm;
      background: var(--card-bg);
      color: var(--text-secondary);
      font-family: @font-family;
      transition: all @transition-base;

      &::placeholder {
        color: var(--text-tertiary);
      }

      &:focus {
        box-shadow: @shadow-md;
        border-color: var(--border-hover);
      }
    }

    .search-icon {
      position: absolute;
      right: 10px;
      color: var(--text-tertiary);
      font-size: @font-size-sm;
      pointer-events: none;
    }
  }

  .sort-wrapper {
    position: relative;

    .sort-btn {
      display: inline-flex;
      align-items: center;
      gap: @spacing-xs;
      padding: @spacing-xs @spacing-sm;
      border-radius: @border-radius-md;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: all @transition-base;

      i {
        font-size: @font-size-sm;
      }

      &:hover {
        background: var(--card-hover-bg);
        border-color: var(--border-hover);
      }
    }

    .sort-dropdown {
      position: absolute;
      top: calc(100% + @spacing-xs);
      left: 0;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: @border-radius-md;
      box-shadow: @shadow-lg;
      min-width: 140px;
      z-index: @z-index-dropdown;
      padding: @spacing-xs;

      .sort-option {
        padding: @spacing-sm;
        cursor: pointer;
        transition: all @transition-fast;
        border-radius: @border-radius-sm;
        font-size: @font-size-sm;
        color: var(--text-primary);

        &:hover:not(.active) {
          background: var(--card-hover-bg);
        }

        &.active {
          background: var(--bg-secondary);
          color: var(--primary-color);
          font-weight: @font-weight-medium;
        }
      }
    }
  }

  .category-filter-wrapper {
    position: relative;

    .category-filter-btn {
      display: inline-flex;
      align-items: center;
      gap: @spacing-xs;
      padding: @spacing-xs @spacing-sm;
      border-radius: @border-radius-md;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: all @transition-base;

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

