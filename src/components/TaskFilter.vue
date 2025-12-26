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
  </div>
</template>

<script setup lang="ts">
import type { TaskStatus } from '@/types/task'

type FilterValue = 'all' | TaskStatus

const props = defineProps<{
  selected: FilterValue
}>()

const emit = defineEmits<{
  'change-filter': [value: FilterValue]
}>()

const filters = [
  { label: '全部', value: 'all' as FilterValue },
  { label: '待处理', value: 'pending' as FilterValue },
  { label: '进行中', value: 'in-progress' as FilterValue },
  { label: '已完成', value: 'completed' as FilterValue },
]
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.filters {
  display: flex;
  margin: 24px 2px;
  color: @filter-inactive;
  font-size: @font-size-sm;
}

.filters .filter {
  margin-right: 14px;
  transition: @transition-slow;
  cursor: pointer;
  user-select: none;
}

.filters .filter.active {
  color: @filter-active;
  transform: scale(1.2);
  font-weight: @font-weight-medium;
}
</style>

