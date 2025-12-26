# Less 样式指南

## 目录

1. [Less 简介](#less-简介)
2. [变量（Variables）](#变量variables)
3. [嵌套（Nesting）](#嵌套nesting)
4. [混合（Mixins）](#混合mixins)
5. [函数（Functions）](#函数functions)
6. [项目中的使用规范](#项目中的使用规范)
7. [最佳实践](#最佳实践)

---

## Less 简介

Less 是一种 CSS 预处理器，它扩展了 CSS 语言，增加了变量、嵌套、混合、函数等特性，让 CSS 更易维护和扩展。

### 为什么使用 Less？

- **变量**：统一管理颜色、尺寸等值，便于主题切换
- **嵌套**：更直观的层级结构，减少重复代码
- **混合**：复用样式代码块
- **函数**：进行颜色计算、单位转换等操作

---

## 变量（Variables）

### 基本语法

使用 `@` 符号定义变量：

```less
@primary-color: #b382f9;
@spacing-md: 16px;
@font-size-lg: 18px;
```

### 使用变量

```less
.button {
  background-color: @primary-color;
  padding: @spacing-md;
  font-size: @font-size-lg;
}
```

### 变量作用域

- 变量可以在任何地方定义
- 变量有作用域，子作用域可以覆盖父作用域
- 推荐在 `variables.less` 中集中定义全局变量

### 项目中的变量文件

项目中的变量定义在 `src/styles/variables.less`，包括：

- **颜色变量**：主色调、背景色、文字色、边框色等
- **间距变量**：`@spacing-xs` 到 `@spacing-2xl`
- **字体变量**：字体大小、字重、行高
- **圆角变量**：`@border-radius-sm` 到 `@border-radius-full`
- **阴影变量**：`@shadow-sm` 到 `@shadow-xl`
- **过渡动画**：`@transition-fast`、`@transition-base`、`@transition-slow`
- **Z-index 层级**：`@z-index-dropdown` 到 `@z-index-tooltip`

### 示例：使用变量

```less
// ❌ 不好的写法（硬编码）
.card {
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
}

// ✅ 好的写法（使用变量）
.card {
  background: @card-bg;
  padding: @spacing-md;
  border-radius: @border-radius-md;
}
```

---

## 嵌套（Nesting）

### 基本语法

Less 允许嵌套选择器，让代码结构更清晰：

```less
// ❌ 传统 CSS（平铺）
.card {
  background: white;
}
.card .header {
  font-size: 18px;
}
.card .header .title {
  color: #333;
}
.card:hover {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

// ✅ Less 嵌套写法
.card {
  background: white;
  
  .header {
    font-size: 18px;
    
    .title {
      color: #333;
    }
  }
  
  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
}
```

### `&` 符号

`&` 代表父选择器，常用于伪类和伪元素：

```less
.button {
  background: @primary-color;
  
  // & 代表 .button
  &:hover {
    background: @primary-hover;
  }
  
  &:active {
    background: @primary-active;
  }
  
  // & 也可以用于修改类名
  &.disabled {
    opacity: 0.5;
  }
  
  // 生成 .button-icon
  &-icon {
    width: 20px;
  }
}
```

编译后的 CSS：

```css
.button {
  background: #b382f9;
}
.button:hover {
  background: #c0a5f3;
}
.button:active {
  background: #9d6ff0;
}
.button.disabled {
  opacity: 0.5;
}
.button-icon {
  width: 20px;
}
```

### 嵌套示例

```less
.task-item {
  background: @card-bg;
  padding: @spacing-md;
  border-radius: @border-radius-md;
  
  // 嵌套子元素
  label {
    display: flex;
    align-items: center;
    
    .task-content {
      margin-left: @spacing-md;
      color: @text-primary;
    }
  }
  
  // 使用 & 处理伪类和状态
  &:hover {
    box-shadow: @shadow-sm;
    
    .delete-btn {
      opacity: 1;
    }
  }
  
  // 使用 & 处理修饰类
  &.done {
    .task-content {
      text-decoration: line-through;
      color: @text-tertiary;
    }
  }
  
  // 嵌套媒体查询
  @media (max-width: 768px) {
    padding: @spacing-sm;
  }
}
```

### 嵌套的使用场景

嵌套在以下情况下特别有用：

#### 1. **样式化组件及其子元素** ⭐ 最常用

当你需要为组件内的子元素写样式时，使用嵌套可以清晰地表达层级关系：

```less
// ✅ 使用嵌套：清晰表达 .card 和 .card-header 的关系
.card {
  background: @card-bg;
  padding: @spacing-md;
  
  .card-header {
    font-size: @font-size-lg;
    margin-bottom: @spacing-md;
    
    .title {
      color: @text-primary;
      font-weight: @font-weight-bold;
    }
  }
  
  .card-body {
    color: @text-secondary;
  }
}

// ❌ 不使用嵌套：看不出层级关系
.card {
  background: @card-bg;
  padding: @spacing-md;
}
.card .card-header {
  font-size: @font-size-lg;
}
.card .card-header .title {
  color: @text-primary;
}
```

**实际项目示例：**

```less
// TaskListItem.vue 中的实际应用
.task-item {
  background: @card-bg;
  
  label {
    display: flex;
    
    .task-content {
      margin-left: @spacing-md;
    }
  }
  
  .delete-btn {
    opacity: 0;
  }
}
```

#### 2. **处理伪类和伪元素** ⭐ 必须使用 `&`

伪类（`:hover`、`:active`、`:focus`）和伪元素（`::before`、`::after`）必须使用 `&` 符号：

```less
// ✅ 使用嵌套和 &
.button {
  background: @primary-color;
  
  &:hover {
    background: @primary-hover;
    transform: translateY(-2px);
  }
  
  &:active {
    background: @primary-active;
    transform: translateY(0);
  }
  
  &:focus {
    outline: 2px solid @primary-color;
  }
  
  &::before {
    content: '';
    position: absolute;
  }
}

// ❌ 不使用嵌套：需要重复写 .button
.button {
  background: @primary-color;
}
.button:hover {
  background: @primary-hover;
}
.button:active {
  background: @primary-active;
}
```

**实际项目示例：**

```less
// HeaderToolbar.vue 中的实际应用
.toolbar-btn {
  background: @bg-secondary;
  
  &:hover {
    background: @card-hover-bg;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
}
```

#### 3. **处理状态类和修饰类** ⭐ 常用

当元素有多个状态（如 `.active`、`.disabled`、`.done`）时：

```less
// ✅ 使用嵌套和 &
.task-item {
  background: @card-bg;
  
  &.done {
    opacity: 0.6;
    
    .task-content {
      text-decoration: line-through;
    }
  }
  
  &.active {
    border: 2px solid @primary-color;
  }
  
  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}

// ❌ 不使用嵌套：需要重复写选择器
.task-item {
  background: @card-bg;
}
.task-item.done {
  opacity: 0.6;
}
.task-item.done .task-content {
  text-decoration: line-through;
}
```

**实际项目示例：**

```less
// TaskListItem.vue 中的实际应用
.task-item {
  &.done {
    label .task-content {
      text-decoration: line-through;
      color: @text-tertiary;
    }
  }
}
```

#### 4. **处理父元素状态影响子元素** ⭐ 常用

当父元素的状态（如 `:hover`）需要影响子元素时：

```less
// ✅ 使用嵌套：清晰表达父子关系
.task-item {
  .delete-btn {
    opacity: 0;
    transition: opacity @transition-fast;
  }
  
  &:hover {
    box-shadow: @shadow-sm;
    
    .delete-btn {
      opacity: 1; // 父元素 hover 时显示删除按钮
    }
  }
}

// ❌ 不使用嵌套：需要分开写，关系不清晰
.task-item .delete-btn {
  opacity: 0;
}
.task-item:hover {
  box-shadow: @shadow-sm;
}
.task-item:hover .delete-btn {
  opacity: 1;
}
```

**实际项目示例：**

```less
// TaskListItem.vue 中的实际应用
.task-item {
  .delete-btn {
    opacity: 0;
  }
  
  &:hover .delete-btn {
    opacity: 1;
  }
}
```

#### 5. **处理上下文选择器** ⭐ 常用

当需要根据父级元素（如 `html.dark`）改变样式时：

```less
// ✅ 使用嵌套：清晰表达上下文关系
.container {
  background: @bg-secondary;
  color: @text-primary;
  
  html.dark & {
    background: @bg-secondary-dark;
    color: @text-primary-dark;
  }
}

// 或者更清晰的写法
.container {
  background: @bg-secondary;
  color: @text-primary;
}

html.dark .container {
  background: @bg-secondary-dark;
  color: @text-primary-dark;
}

// ❌ 不使用嵌套：需要重复写选择器
.container {
  background: @bg-secondary;
}
html.dark .container {
  background: @bg-secondary-dark;
}
```

**实际项目示例：**

```less
// Home.vue 中的实际应用
main {
  background: @bg-color;
  
  html.dark & {
    background: @bg-color-dark;
  }
}
```

#### 6. **媒体查询** ⭐ 推荐使用

响应式设计时，将媒体查询嵌套在相关选择器中：

```less
// ✅ 使用嵌套：媒体查询和元素样式在一起
.card {
  padding: @spacing-md;
  
  @media (max-width: 768px) {
    padding: @spacing-sm;
  }
  
  @media (max-width: 480px) {
    padding: @spacing-xs;
  }
}

// ❌ 不使用嵌套：媒体查询分散，难以维护
.card {
  padding: @spacing-md;
}
@media (max-width: 768px) {
  .card {
    padding: @spacing-sm;
  }
}
```

#### 7. **生成 BEM 风格的类名** ⭐ 特殊用法

使用 `&` 生成 BEM（Block Element Modifier）风格的类名：

```less
// ✅ 使用 & 生成 BEM 类名
.button {
  &__icon {
    width: 20px;
  }
  
  &--primary {
    background: @primary-color;
  }
  
  &--large {
    padding: @spacing-lg;
  }
}

// 编译后生成：
// .button__icon
// .button--primary
// .button--large
```

### 什么时候不需要嵌套？

以下情况**不需要**使用嵌套：

#### 1. **独立的、不相关的样式**

```less
// ✅ 不需要嵌套：这些是独立的样式
.header {
  background: @bg-color;
}

.footer {
  background: @bg-color-dark;
}

.sidebar {
  width: 200px;
}

// ❌ 不需要这样嵌套（它们没有关系）
.page {
  .header { }
  .footer { }
  .sidebar { }
}
```

#### 2. **全局样式或工具类**

```less
// ✅ 不需要嵌套：这些是全局工具类
.text-center {
  text-align: center;
}

.mt-md {
  margin-top: @spacing-md;
}

.flex {
  display: flex;
}
```

#### 3. **简单的单层样式**

```less
// ✅ 简单样式，不需要嵌套
.title {
  font-size: @font-size-xl;
  color: @text-primary;
}

// ❌ 过度嵌套（只有一个属性）
.container {
  .title {
    font-size: @font-size-xl;
  }
}
```

### 嵌套使用决策树

```
需要写样式吗？
  ├─ 是 → 这个样式是某个元素的子元素吗？
  │        ├─ 是 → 使用嵌套 ✅
  │        └─ 否 → 需要处理伪类/伪元素吗？
  │                 ├─ 是 → 使用嵌套 + & ✅
  │                 └─ 否 → 需要处理状态类吗？
  │                          ├─ 是 → 使用嵌套 + & ✅
  │                          └─ 否 → 不需要嵌套 ❌
  └─ 否 → 不需要嵌套 ❌
```

### 总结：嵌套的使用原则

1. ✅ **有层级关系时使用嵌套**：父元素和子元素
2. ✅ **处理伪类/伪元素时使用嵌套**：必须用 `&`
3. ✅ **处理状态类时使用嵌套**：`.active`、`.disabled` 等
4. ✅ **父元素状态影响子元素时使用嵌套**：`:hover` 显示子元素
5. ✅ **响应式设计时使用嵌套**：媒体查询
6. ❌ **独立样式不需要嵌套**：没有关系的样式分开写
7. ❌ **简单样式不需要嵌套**：单层样式直接写

---

## 混合（Mixins）

### 基本语法

混合类似于函数，可以复用样式代码块：

```less
// 定义混合
.border-radius(@radius: 8px) {
  border-radius: @radius;
}

// 使用混合
.button {
  .border-radius(12px);
}

.card {
  .border-radius(); // 使用默认值 8px
}
```

### 带参数的混合

```less
// 定义带参数的混合
.flex-center(@direction: row) {
  display: flex;
  flex-direction: @direction;
  align-items: center;
  justify-content: center;
}

// 使用
.container {
  .flex-center();
}

.vertical-container {
  .flex-center(column);
}
```

### 项目中的混合示例

可以在 `variables.less` 或新建 `mixins.less` 中定义常用混合：

```less
// 文本省略（单行）
.text-ellipsis() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 文本省略（多行）
.text-ellipsis-multi(@lines: 2) {
  display: -webkit-box;
  -webkit-line-clamp: @lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// 清除浮动
.clearfix() {
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}

// 使用示例
.task-title {
  .text-ellipsis();
}

.task-description {
  .text-ellipsis-multi(3);
}
```

---

## 函数（Functions）

Less 提供了许多内置函数，用于颜色操作、数学计算等：

### 颜色函数

```less
@primary-color: #b382f9;

// 变亮
.button {
  background: lighten(@primary-color, 10%);
}

// 变暗
.button-dark {
  background: darken(@primary-color, 10%);
}

// 透明度
.overlay {
  background: fade(@primary-color, 50%);
}

// 混合颜色
.mixed {
  background: mix(@primary-color, @secondary-color, 50%);
}
```

### 数学函数

```less
@base-size: 16px;

// 计算
.container {
  width: percentage(2/3); // 66.66667%
  padding: round(@base-size * 1.5); // 24px
  margin: ceil(@base-size * 0.75); // 12px
}
```

### 字符串函数

```less
@class-name: 'button';

// 转义
.@{class-name} {
  // 生成 .button
}
```

---

## 项目中的使用规范

### 1. 导入变量

在每个组件的 `<style>` 标签中，首先导入变量文件：

```vue
<style scoped lang="less">
@import '@/styles/variables.less';

// 你的样式代码
</style>
```

### 2. 使用变量而非硬编码

```less
// ❌ 不好的写法
.button {
  padding: 16px;
  border-radius: 8px;
  color: #414873;
}

// ✅ 好的写法
.button {
  padding: @spacing-md;
  border-radius: @border-radius-md;
  color: @text-primary;
}
```

### 3. 使用嵌套组织代码

```less
// ❌ 不好的写法（平铺）
.task-item {
  background: white;
}
.task-item:hover {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.task-item .delete-btn {
  opacity: 0;
}
.task-item:hover .delete-btn {
  opacity: 1;
}

// ✅ 好的写法（嵌套）
.task-item {
  background: white;
  
  &:hover {
    box-shadow: @shadow-sm;
    
    .delete-btn {
      opacity: 1;
    }
  }
  
  .delete-btn {
    opacity: 0;
  }
}
```

### 4. 处理黑暗模式

项目使用 `html.dark` 类来切换黑暗模式，建议使用嵌套：

```less
// ✅ 推荐的写法（嵌套）
.container {
  background: @bg-secondary;
  color: @text-primary;
  
  html.dark & {
    background: @bg-secondary-dark;
    color: @text-primary-dark;
  }
}

// 或者使用 & 符号
.container {
  background: @bg-secondary;
  color: @text-primary;
}

html.dark .container {
  background: @bg-secondary-dark;
  color: @text-primary-dark;
}
```

---

## 最佳实践

### 1. 变量命名规范

- 使用有意义的名称：`@primary-color` 而不是 `@color1`
- 使用统一的命名前缀：`@spacing-*`、`@font-size-*`、`@border-radius-*`
- 使用语义化名称：`@text-primary` 而不是 `@text-color-1`

### 2. 嵌套深度控制

- 建议嵌套深度不超过 3-4 层
- 过深的嵌套会影响可读性和性能

```less
// ❌ 嵌套过深
.container {
  .header {
    .title {
      .icon {
        .svg {
          // 太深了！
        }
      }
    }
  }
}

// ✅ 合理的嵌套
.container {
  .header-title {
    .icon {
      // 更清晰
    }
  }
}
```

### 3. 使用 `&` 符号

- 伪类和伪元素必须使用 `&`
- 修饰类（如 `.active`、`.disabled`）使用 `&`
- 避免不必要的 `&` 使用

```less
// ✅ 正确使用 &
.button {
  &:hover { }
  &:active { }
  &.disabled { }
  &-icon { }
}

// ❌ 不必要的 &
.button {
  & .icon { } // 应该直接写 .icon
}
```

### 4. 组织样式文件

```
src/styles/
├── variables.less    # 全局变量
├── mixins.less      # 混合（可选）
└── index.less       # 全局样式
```

### 5. 组件样式结构

```less
@import '@/styles/variables.less';

.component-name {
  // 1. 布局属性
  display: flex;
  position: relative;
  
  // 2. 尺寸属性
  width: 100%;
  padding: @spacing-md;
  
  // 3. 外观属性
  background: @card-bg;
  border-radius: @border-radius-md;
  color: @text-primary;
  
  // 4. 状态和交互
  &:hover {
    // ...
  }
  
  // 5. 子元素
  .child-element {
    // ...
  }
  
  // 6. 修饰类
  &.modifier {
    // ...
  }
  
  // 7. 媒体查询
  @media (max-width: 768px) {
    // ...
  }
}
```

---

## 实际改进示例

### 示例 1：改进 TaskListItem.vue

**当前写法（部分平铺）：**

```less
.task-item {
  background: white;
}

html.dark .task-item {
  background: @card-bg-dark;
}

.task-item:hover {
  box-shadow: @shadow-sm;
}

.task-item label {
  // ...
}
```

**改进后的写法（使用嵌套）：**

```less
.task-item {
  background: white;
  
  html.dark & {
    background: @card-bg-dark;
  }
  
  &:hover {
    box-shadow: @shadow-sm;
  }
  
  label {
    // ...
  }
}
```

### 示例 2：改进 TaskAdd.vue

**当前写法：**

```less
.input-add input {
  // ...
}

html.dark .input-add input {
  // ...
}
```

**改进后的写法：**

```less
.input-add {
  input {
    // ...
    
    html.dark & {
      // ...
    }
  }
}
```

---

## 总结

1. **始终使用变量**：颜色、尺寸、间距等都应该使用变量
2. **合理使用嵌套**：让代码结构更清晰，但不要嵌套过深
3. **善用 `&` 符号**：处理伪类、修饰类等情况
4. **保持一致性**：遵循项目的样式规范
5. **定期重构**：随着项目发展，优化样式代码结构

---

## 参考资源

- [Less 官方文档](https://lesscss.org/)
- [Less 中文文档](https://less.bootcss.com/)
- 项目变量文件：`src/styles/variables.less`

