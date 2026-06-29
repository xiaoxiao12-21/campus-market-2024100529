<template>
  <section class="page">
    <div class="page-header">
      <h1>个人中心</h1>
      <p>在这里管理你的个人信息、发布的内容、收藏和账户设置。</p>
    </div>
    <EmptyState text="个人中心功能正在开发中" />
  </section>
</template>

<script setup lang="ts">
import EmptyState from '../components/EmptyState.vue'
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.page-header h1 {
  margin: 0 0 8px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
}
</style>
