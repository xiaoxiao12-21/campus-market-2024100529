<template>
  <section class="page">
    <div class="page-header">
      <h1>发布信息</h1>
      <p>在这里发布你的二手商品、失物招领、团购拼单或跑腿任务信息。</p>
    </div>
    <div class="coming-soon">
      <p>🚧 发布功能正在开发中，敬请期待...</p>
    </div>
  </section>
</template>

<script setup lang="ts">
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

.coming-soon {
  padding: 60px 24px;
  text-align: center;
  background: #fff;
  border-radius: 12px;
  color: #6b7280;
  font-size: 16px;
}
</style>
