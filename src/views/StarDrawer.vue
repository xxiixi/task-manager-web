<template>
  <div class="star-drawer-page">
    <button class="back-btn" @click="goBack" title="返回">
      <i class="bi bi-arrow-left"></i>
    </button>
    <div class="canvas-container">
      <canvas ref="canvasRef" id="star-canvas"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import paper from 'paper'

const router = useRouter()
const canvasRef = ref<HTMLCanvasElement | null>(null)

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const img = new Image()
  img.src = '/images/harvest-in-provence.jpg'

  img.onload = () => {
    // 设置 canvas 尺寸为图片尺寸
    canvas.width = img.width
    canvas.height = img.height

    // 初始化 paper.js
    paper.setup(canvas)

    // 将图片绘制到 canvas 上作为背景
    const raster = new paper.Raster(img)
    raster.position = new paper.Point(img.width / 2, img.height / 2)

    // 计算五角星的中心位置（图片中心）
    const centerX = img.width / 2
    const centerY = img.height / 2

    // 计算五角星的大小（取图片宽度和高度的较小值的 1/5）
    const starSize = Math.min(img.width, img.height) / 5

    // 创建五角星路径：两个同心圆交替取点
    const star = new paper.Path.Star({
      center: [centerX, centerY],
      points: 5,
      radius1: starSize,
      radius2: starSize / 2,
      fillColor: '#FFD700',
      strokeColor: '#FFA500',
      strokeWidth: 2
    })
  }
})

onUnmounted(() => {
  // 清理 paper.js
  if (paper.project) {
    paper.project.clear()
  }
})
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.star-drawer-page {
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

.canvas-container {
  max-width: 100%;
  max-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: @shadow-lg;
}

#star-canvas {
  max-width: 100%;
  max-height: 100vh;
  display: block;
}
</style>

