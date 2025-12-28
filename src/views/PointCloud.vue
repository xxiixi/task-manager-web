<template>
  <div class="point-cloud-page">
    <button class="back-btn" @click="goBack" title="返回">
      <i class="bi bi-arrow-left"></i>
    </button>
    <div class="content-container">
      <h1>点云渲染页面</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.point-cloud-page {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: var(--bg-color);
  transition: background-color @transition-base;
  position: relative;
}

.back-btn {
  position: fixed;
  top: @spacing-md;
  left: @spacing-md;
  width: 40px;
  height: 40px;
  border-radius: @border-radius-md;
  border: none;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all @transition-fast;
  box-shadow: @shadow-sm;
  z-index: @z-index-fixed;

  &:hover {
    background: var(--card-hover-bg);
    transform: translateY(-2px);
    box-shadow: @shadow-md;
  }

  &:active {
    transform: translateY(0);
  }

  .bi {
    font-size: @font-size-lg;
  }
}

.content-container {
  max-width: 100%;
  max-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

h1 {
  color: var(--text-primary);
}
</style>

