# Bootstrap Icons 使用文档

## 概述

本项目使用 [Bootstrap Icons](https://icons.getbootstrap.com/) 作为图标库，采用按需导入的方式，仅导入使用的图标。

## 安装

```bash
pnpm add bootstrap-icons
```

## 导入方式

在 `src/main.ts` 中导入 Bootstrap Icons 的 CSS 文件：

```typescript
import 'bootstrap-icons/font/bootstrap-icons.css'
```

**注意**：虽然导入了整个 CSS 文件，但 Vite 在生产构建时会进行 tree-shaking，只打包实际使用的图标字体，因此不会影响最终打包体积。

## 使用方法

在 Vue 组件中使用 Bootstrap Icons：

```vue
<template>
  <i class="bi bi-icon-name"></i>
</template>
```

### 示例

```vue
<!-- 月亮图标（黑暗模式） -->
<i class="bi bi-moon"></i>

<!-- 太阳图标（浅色模式） -->
<i class="bi bi-sun"></i>

<!-- GitHub 图标 -->
<i class="bi bi-github"></i>

<!-- 翻译图标 -->
<i class="bi bi-translate"></i>

<!-- 地球图标 -->
<i class="bi bi-globe"></i>
```

## 当前使用的图标

项目中当前使用的 Bootstrap Icons：

- `bi-moon` - 月亮图标（用于黑暗模式切换按钮）
- `bi-sun` - 太阳图标（用于浅色模式切换按钮）
- `bi-github` - GitHub 图标（用于 GitHub 跳转按钮）
- `bi-translate` - 翻译图标（用于中文语言标识）
- `bi-globe` - 地球图标（用于英文语言标识）

## 添加新图标

1. 在 [Bootstrap Icons 官网](https://icons.getbootstrap.com/) 查找需要的图标
2. 在组件中使用 `<i class="bi bi-icon-name"></i>` 格式
3. 无需额外配置，图标会自动包含在构建中

## 样式定制

可以通过 CSS 自定义图标样式：

```less
.bi {
  font-size: 18px;
  color: @text-primary;
  
  &:hover {
    color: @primary-color;
  }
}
```

## 参考资源

- [Bootstrap Icons 官网](https://icons.getbootstrap.com/)
- [Bootstrap Icons GitHub](https://github.com/twbs/icons)
- [图标列表](https://icons.getbootstrap.com/#icons)

