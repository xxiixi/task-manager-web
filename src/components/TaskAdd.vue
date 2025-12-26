<template>
  <div class="input-add">
    <input
      type="text"
      v-model="taskTitle"
      @keyup.enter="handleAddTask"
      :placeholder="placeholder"
    />
    <button @click="handleAddTask">
      <i class="plus"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useI18nStore } from '@/stores/i18n'
import type { TaskPriority } from '@/types/task'

const taskStore = useTaskStore()
const i18nStore = useI18nStore()
const { t } = i18nStore
const taskTitle = ref('')

const placeholder = computed(() => t.addTask + '...')

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

:global(.dark) .input-add input {
  background: @card-bg-dark;
  color: @text-secondary-dark;
}

:global(.dark) .input-add input::placeholder {
  color: @text-tertiary-dark;
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

