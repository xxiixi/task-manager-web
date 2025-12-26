<template>
  <div class="input-add">
    <input
      type="text"
      v-model="taskTitle"
      @keyup.enter="handleAddTask"
      placeholder="添加新任务..."
    />
    <button @click="handleAddTask">
      <i class="plus"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores/task'
import type { TaskPriority } from '@/types/task'

const taskStore = useTaskStore()
const taskTitle = ref('')

const handleAddTask = () => {
  if (taskTitle.value.trim()) {
    taskStore.addTask({
      title: taskTitle.value.trim(),
      status: 'pending',
      priority: 'medium',
    })
    taskTitle.value = ''
  }
}
</script>

<style scoped lang="less">
@import '@/styles/variables.less';

.input-add {
  position: relative;
  display: flex;
  align-items: center;
}

.input-add input {
  padding: 16px 52px 16px 18px;
  border-radius: @border-radius-3xl;
  border: none;
  outline: none;
  box-shadow: @shadow-input;
  width: 100%;
  font-size: @font-size-md;
  color: @text-secondary;
  font-family: @font-family;
}

.input-add input::placeholder {
  color: @text-tertiary;
}

.input-add button {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: @gradient-primary;
  border: none;
  outline: none;
  color: white;
  position: absolute;
  right: 0px;
  cursor: pointer;
  transition: transform @transition-fast;
}

.input-add button:hover {
  transform: scale(1.05);
}

.input-add button:active {
  transform: scale(0.95);
}

/* 通过纯css实现加号 */
.input-add .plus {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(#fff, #fff), linear-gradient(#fff, #fff);
  background-size: 50% 2px, 2px 50%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>

