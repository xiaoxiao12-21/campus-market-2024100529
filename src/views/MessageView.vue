<template>
  <section class="page">
    <div class="page-header">
      <h1>消息中心</h1>
      <p>这里将展示你的系统通知、聊天消息和互动提醒。</p>
    </div>
    <EmptyState text="暂无消息" />
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
