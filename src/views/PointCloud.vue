<template>
  <div class="point-cloud-page">
    <button class="back-btn" @click="goBack" title="返回">
      <i class="bi bi-arrow-left"></i>
    </button>
    <div ref="containerRef" class="canvas-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../stores/theme'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const router = useRouter()
const containerRef = ref<HTMLDivElement | null>(null)
const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationId: number
let points: THREE.Points | null = null

// ==================== PCD文件解析 ====================
const parsePCD = async (url: string): Promise<{ positions: Float32Array; colors: Float32Array }> => {
  const response = await fetch(url)
  const text = await response.text()
  const lines = text.split('\n')
  
  // 解析头部信息
  let dataStartIndex = 0
  let pointCount = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('POINTS')) {
      pointCount = parseInt(line.split(' ')[1])
    }
    if (line === 'DATA ascii') {
      dataStartIndex = i + 1
      break
    }
  }
  
  const positions = new Float32Array(pointCount * 3)
  const colors = new Float32Array(pointCount * 3)
  
  // 解析点数据并计算边界框
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  
  for (let i = 0; i < pointCount; i++) {
    const parts = lines[dataStartIndex + i].trim().split(/\s+/)
    const x = parseFloat(parts[0])
    const y = parseFloat(parts[1])
    const z = parseFloat(parts[2])
    
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    minZ = Math.min(minZ, z)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
    maxZ = Math.max(maxZ, z)
  }
  
  // 计算中心点和范围
  const centerX = (minX + maxX) / 2
  const centerY = (minY + maxY) / 2
  const centerZ = (minZ + maxZ) / 2
  const rangeX = maxX - minX
  const rangeY = maxY - minY
  const rangeZ = maxZ - minZ
  const maxRange = Math.max(rangeX, rangeY, rangeZ)
  
  // ==================== 颜色计算（HSV彩虹渐变） ====================
  for (let i = 0; i < pointCount; i++) {
    const x = positions[i * 3]
    const y = positions[i * 3 + 1]
    const z = positions[i * 3 + 2]
    
    const distX = (x - centerX) / maxRange
    const distY = (y - centerY) / maxRange
    const distZ = (z - centerZ) / maxRange
    const normalizedY = (y - minY) / rangeY
    const distance = Math.sqrt(distX * distX + distY * distY + distZ * distZ)
    
    // HSV颜色空间：基于高度和距离
    const hue = (normalizedY * 0.7 + distance * 0.3) % 1.0
    const saturation = 0.7 + distance * 0.3
    const value = 0.6 + normalizedY * 0.4
    
    // HSV转RGB
    const c = value * saturation
    const x_hue = c * (1 - Math.abs(((hue * 6) % 2) - 1))
    const m = value - c
    
    let r = 0, g = 0, b = 0
    const hueInt = Math.floor(hue * 6)
    if (hueInt === 0) { r = c; g = x_hue; b = 0 }
    else if (hueInt === 1) { r = x_hue; g = c; b = 0 }
    else if (hueInt === 2) { r = 0; g = c; b = x_hue }
    else if (hueInt === 3) { r = 0; g = x_hue; b = c }
    else if (hueInt === 4) { r = x_hue; g = 0; b = c }
    else { r = c; g = 0; b = x_hue }
    
    colors[i * 3] = r + m
    colors[i * 3 + 1] = g + m
    colors[i * 3 + 2] = b + m
  }
  
  return { positions, colors }
}

// ==================== Three.js场景初始化 ====================
const initThree = async (): Promise<() => void> => {
  if (!containerRef.value) return () => {}
  
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  
  // 场景、相机、渲染器
  scene = new THREE.Scene()
  scene.background = new THREE.Color(isDark.value ? 0x1e1e28 : 0xf0f0f0)
  camera = new THREE.PerspectiveCamera(75, width / height, 0.001, 1000)
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  containerRef.value.appendChild(renderer.domElement)
  
  // 控制器和光源
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  
  scene.add(new THREE.AmbientLight(0xffffff, 0.6))
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)
  
  // ==================== 点云加载和设置 ====================
  try {
    const { positions, colors } = await parsePCD('/pointclouds/cat.pcd')
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    const material = new THREE.PointsMaterial({
      size: 0.001,
      vertexColors: true,
      sizeAttenuation: true
    })
    
    points = new THREE.Points(geometry, material)
    
    // 移动到原点并旋转
    geometry.computeBoundingBox()
    const center = geometry.boundingBox!.getCenter(new THREE.Vector3())
    points.position.sub(center)
    points.rotateX(-Math.PI / 2) // 让猫头朝向观察者
    scene.add(points)
    
    // ==================== 坐标轴和相机设置 ====================
    geometry.computeBoundingBox()
    const newBox = geometry.boundingBox!
    const size = newBox.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const distance = maxDim * 1.5
    
    // 计算旋转后的世界坐标中心
    const localCenter = new THREE.Vector3()
    newBox.getCenter(localCenter)
    points.updateMatrixWorld(true)
    const worldCenter = localCenter.clone().applyMatrix4(points.matrixWorld)
    
    // 添加坐标轴
    const axesHelper = new THREE.AxesHelper(maxDim * 0.1)
    axesHelper.position.copy(worldCenter)
    scene.add(axesHelper)
    
    // 相机初始位置：Y轴旋转45度，向上偏移
    const angle = Math.PI / 4
    camera.position.set(
      distance * Math.sin(angle),
      distance * 0.3,
      distance * Math.cos(angle)
    )
    controls.target.copy(worldCenter)
    controls.update()
  } catch (error) {
    console.error('加载点云失败:', error)
  }
  
  // ==================== 动画循环和资源管理 ====================
  const animate = () => {
    animationId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }
  animate()
  
  const handleResize = () => {
    if (!containerRef.value) return
    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
  window.addEventListener('resize', handleResize)
  
  return () => {
    window.removeEventListener('resize', handleResize)
    if (animationId) cancelAnimationFrame(animationId)
    if (renderer) renderer.dispose()
    if (containerRef.value && renderer?.domElement) {
      containerRef.value.removeChild(renderer.domElement)
    }
  }
}

// 监听主题变化，更新背景色
watch(isDark, (newValue) => {
  if (scene) {
    scene.background = new THREE.Color(newValue ? 0x1e1e28 : 0xf0f0f0)
  }
})

const goBack = () => {
  router.push('/')
}

let cleanup: (() => void) | null = null

onMounted(async () => {
  cleanup = await initThree()
})

onUnmounted(() => {
  if (cleanup) {
    cleanup()
  }
})
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

.canvas-container {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
</style>

