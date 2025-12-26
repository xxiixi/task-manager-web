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
import { storeToRefs } from 'pinia'
import { useTaskStore } from '../stores/task'
import { useI18nStore } from '../stores/i18n'

const taskStore = useTaskStore()
const i18nStore = useI18nStore()
const { t } = storeToRefs(i18nStore)
const taskTitle = ref('')

const placeholder = computed(() => t.value.addTask + '...')

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

  input {
    padding: 16px 52px 16px 18px;
    border-radius: @border-radius-3xl;
    border: none;
    outline: none;
    box-shadow: @shadow-input;
    width: 100%;
    font-size: @font-size-md;
    background: var(--card-bg);
    color: var(--text-secondary);
    font-family: @font-family;

    &::placeholder {
      color: var(--text-tertiary);
    }
  }

  button {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: linear-gradient(var(--primary-hover), var(--secondary-color));
    border: none;
    outline: none;
    color: white;
    position: absolute;
    right: 0;
    cursor: pointer;
    transition: transform @transition-fast;

    &:hover {
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }

    .plus {
      display: block;
      width: 100%;
      height: 100%;
      background: linear-gradient(white, white), linear-gradient(white, white);
      background-size: 50% 2px, 2px 50%;
      background-position: center;
      background-repeat: no-repeat;
    }
  }
}
</style>
