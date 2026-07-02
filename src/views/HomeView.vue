<template>
  <div class="home-page">
    <section class="hero">
      <h1>校园轻集市</h1>
      <p>欢迎来到校园轻集市，这里汇聚了二手交易、失物招领、拼单搭子、跑腿委托等校园生活信息。</p>
    </section>

    <section class="quick-entries">
      <RouterLink to="/trade" class="entry-card entry-card--trade">
        <span class="entry-icon">🛒</span>
        <span class="entry-title">二手交易</span>
        <span class="entry-desc">闲置好物流转</span>
      </RouterLink>
      <RouterLink to="/lost-found" class="entry-card entry-card--lost">
        <span class="entry-icon">🔍</span>
        <span class="entry-title">失物招领</span>
        <span class="entry-desc">帮助找回物品</span>
      </RouterLink>
      <RouterLink to="/group-buy" class="entry-card entry-card--group">
        <span class="entry-icon">👥</span>
        <span class="entry-title">拼单搭子</span>
        <span class="entry-desc">拼团优惠更多</span>
      </RouterLink>
      <RouterLink to="/errand" class="entry-card entry-card--errand">
        <span class="entry-icon">🏃</span>
        <span class="entry-title">跑腿委托</span>
        <span class="entry-desc">互助便捷生活</span>
      </RouterLink>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero {
  padding: 32px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.hero h1 {
  margin: 0 0 12px;
  font-size: 28px;
  font-weight: 700;
}

.hero p {
  margin: 0;
  font-size: 15px;
  opacity: 0.9;
  line-height: 1.6;
}

.quick-entries {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.entry-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  text-decoration: none;
  color: #333;
  transition: all 0.2s;
}

.entry-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.entry-icon {
  font-size: 36px;
}

.entry-title {
  font-size: 16px;
  font-weight: 600;
}

.entry-desc {
  font-size: 12px;
  color: #9ca3af;
}

.entry-card--trade:hover {
  border-color: #3b82f6;
}
.entry-card--lost:hover {
  border-color: #f59e0b;
}
.entry-card--group:hover {
  border-color: #10b981;
}
.entry-card--errand:hover {
  border-color: #ef4444;
}

@media (max-width: 768px) {
  .quick-entries {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
