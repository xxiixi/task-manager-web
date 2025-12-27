<template>
  <button class="add-task-btn" @click="handleOpenModal">
    <i class="bi bi-plus-lg"></i>
    <span>{{ t.addTask }}</span>
  </button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18nStore } from '../stores/i18n'

const emit = defineEmits<{
  open: []
}>()

const i18nStore = useI18nStore()
const { t } = storeToRefs(i18nStore)

const handleOpenModal = () => {
  emit('open')
}
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.add-task-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: @spacing-xs;
  width: 100%;
  padding: 16px;
  border-radius: @border-radius-xl;
  border: none;
  background: linear-gradient(var(--primary-hover), var(--secondary-color));
  color: white;
  font-size: @font-size-md;
  font-weight: @font-weight-medium;
  cursor: pointer;
  transition: all @transition-fast;
  box-shadow: @shadow-input;

  i {
    font-size: @font-size-lg;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: @shadow-md;
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
