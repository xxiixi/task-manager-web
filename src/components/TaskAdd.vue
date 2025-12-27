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
  padding: 10px 20px;
  border-radius: @border-radius-full;
  border: 1.5px solid var(--primary-color);
  background: var(--primary-color-bg);
  color: var(--primary-color);
  font-size: @font-size-sm;
  font-weight: @font-weight-medium;
  cursor: pointer;
  transition: all @transition-base;
  box-shadow: 0 2px 4px var(--primary-color-shadow-light);
  white-space: nowrap;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  i {
    font-size: @font-size-md;
    transition: transform @transition-base;
  }

  // 背景渐变动画层
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    opacity: 0;
    transition: opacity @transition-base;
    z-index: -1;
  }

  &:hover {
    color: white;
    border-color: var(--primary-hover);
    background: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--primary-color-shadow-strong);

    &::before {
      opacity: 1;
    }

    i {
      transform: rotate(90deg);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px var(--primary-color-shadow-medium);
  }
}
</style>
