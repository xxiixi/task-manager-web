# 五角星绘制功能实现步骤

## 实现步骤

1. **安装 paper.js 库**
   - 使用 `pnpm add paper` 安装 paper.js 绘图库

2. **创建 Canvas 元素**
   - 在 Vue 组件中使用 `<canvas>` 元素替代 `<img>` 标签
   - 通过 `ref` 获取 canvas DOM 引用

3. **加载图片并设置 Canvas 尺寸**
   - 创建 `Image` 对象加载图片
   - 图片加载完成后，将 canvas 尺寸设置为图片尺寸

4. **初始化 paper.js**
   - 使用 `paper.setup(canvas)` 初始化 paper.js
   - 将图片作为 `Raster` 对象绘制到 canvas 上作为背景

5. **计算五角星位置和大小**
   - 中心位置：图片宽度/2 和 高度/2
   - 大小：取图片宽度和高度的较小值的 1/3

6. **绘制五角星**
   - 使用 `paper.Path.Star` 创建五角星路径
   - 设置 5 个顶点、内外半径、填充颜色和描边
   - paper.js 会自动更新视图，无需手动调用绘制方法

7. **清理资源**
   - 在组件卸载时清理 paper.js 项目

## 技术要点

- 使用 paper.js 的 `Path.Star` API 创建五角星
- 图片加载使用 `onload` 事件确保图片加载完成后再绘制
- Canvas 尺寸与图片尺寸一致，保证清晰度
- 五角星居中显示在图片中心位置

