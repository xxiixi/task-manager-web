<template>
  <button class="add-task-btn" @click="handleOpenModal">
    <i class="bi bi-plus-lg"></i>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  open: []
}>()

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
  width: 70px;
  height: 70px;
  padding: 0;
  border-radius: 50%;
  border: 1.5px solid var(--primary-color);
  background: color-mix(in srgb, var(--primary-color) 30%, transparent);
  color: var(--primary-color);
  cursor: pointer;
  transition: all @transition-base;
  box-shadow: 0 2px 4px var(--primary-color-shadow-light);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;

  i {
    font-size: 35px;
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
    transform: scale(1.05);
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
