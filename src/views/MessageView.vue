<template>
  <section class="page">
    <div class="page-header">
      <h1>消息中心</h1>
      <p>查看系统通知、收藏提醒和互动消息。</p>
    </div>

    <div class="message-list">
      <article class="message-card">
        <div class="message-icon system">📢</div>
        <div class="message-content">
          <h3>欢迎使用校园轻集市</h3>
          <p>你可以在这里发布二手商品、失物招领、拼单搭子和跑腿委托。</p>
          <span class="message-time">刚刚</span>
        </div>
      </article>

      <article class="message-card">
        <div class="message-icon tip">💡</div>
        <div class="message-content">
          <h3>功能提示</h3>
          <p>收藏的信息可以在个人中心中查看。</p>
          <span class="message-time">1 分钟前</span>
        </div>
      </article>

      <article class="message-card">
        <div class="message-icon favorite">⭐</div>
        <div class="message-content">
          <h3>收藏小贴士</h3>
          <p>在列表页点击"收藏"按钮即可将感兴趣的信息保存到个人中心。</p>
          <span class="message-time">2 分钟前</span>
        </div>
      </article>
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

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s;
}

.message-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.message-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 20px;
  flex-shrink: 0;
}

.message-icon.system {
  background: #eff6ff;
}

.message-icon.tip {
  background: #fef3c7;
}

.message-icon.favorite {
  background: #fce7f3;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-content h3 {
  margin: 0 0 6px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.message-content p {
  margin: 0 0 8px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}

.message-time {
  font-size: 12px;
  color: #9ca3af;
}
</style>
