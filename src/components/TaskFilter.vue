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
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { TaskStatus } from '../types/task'
import { useI18nStore } from '../stores/i18n'

type FilterValue = 'all' | TaskStatus

const props = defineProps<{
  selected: FilterValue
}>()

const emit = defineEmits<{
  'change-filter': [value: FilterValue]
}>()

const i18nStore = useI18nStore()
const { t } = storeToRefs(i18nStore)

const filters = computed(() => [
  { label: t.value.all, value: 'all' as FilterValue },
  { label: t.value.pending, value: 'pending' as FilterValue },
  { label: t.value.inProgress, value: 'in-progress' as FilterValue },
  { label: t.value.completed, value: 'completed' as FilterValue },
])
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

html.dark .filters {
  color: @text-tertiary-dark;
}

html.dark .filters .filter.active {
  color: @text-primary-dark;
}
</style>

