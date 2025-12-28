<template>
  <div class="star-drawer-page">
    <div class="image-container">
      <img src="/images/harvest-in-provence.jpg" alt="图片" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.star-drawer-page {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.image-container {
  max-width: 100%;
  max-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-container img {
  max-width: 100%;
  max-height: 100vh;
  object-fit: contain;
}
</style>

