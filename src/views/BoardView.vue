<script setup lang="ts">
import { ElRow, ElCol, ElCard, ElStatistic, ElIcon, ElTable, ElTableColumn, ElProgress } from 'element-plus'
import { ShoppingCart, ChatDotRound, User, View, TrendCharts, Money } from '@element-plus/icons-vue'

// 模拟统计数据
const stats = [
  { title: '商品总数', value: 128, icon: ShoppingCart, color: '#409eff' },
  { title: '在售商品', value: 89, icon: TrendCharts, color: '#67c23a' },
  { title: '消息总数', value: 256, icon: ChatDotRound, color: '#e6a23c' },
  { title: '注册用户', value: 1024, icon: User, color: '#f56c6c' },
  { title: '今日浏览', value: 342, icon: View, color: '#909399' },
  { title: '成交金额', value: 12580, prefix: '¥', icon: Money, color: '#9b59b6' },
]

// 模拟热门分类
const hotCategories = [
  { name: '数码产品', count: 42, percent: 85 },
  { name: '书籍教材', count: 35, percent: 70 },
  { name: '生活用品', count: 25, percent: 50 },
  { name: '代步工具', count: 15, percent: 30 },
  { name: '服饰鞋包', count: 11, percent: 22 },
]

// 模拟最近成交
const recentDeals = [
  { id: 1, goods: '九成新iPad Pro 2022', price: 4200, buyer: '刘同学', time: '10分钟前' },
  { id: 2, goods: '高等数学教材', price: 15, buyer: '孙同学', time: '30分钟前' },
  { id: 3, goods: '罗技G304鼠标', price: 120, buyer: '钱同学', time: '1小时前' },
  { id: 4, goods: '小米手环7', price: 150, buyer: '冯同学', time: '2小时前' },
]
</script>

<template>
  <div class="board-page">
    <h1 class="page-title">数据看板</h1>

    <!-- 统计卡片 -->
    <ElRow :gutter="20" class="stats-row">
      <ElCol v-for="stat in stats" :key="stat.title" :span="8" :xs="12" :sm="8" :md="8" :lg="8">
        <ElCard class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: stat.color + '15', color: stat.color }">
              <ElIcon :size="28"><component :is="stat.icon" /></ElIcon>
            </div>
            <div class="stat-info">
              <ElStatistic :title="stat.title" :value="stat.value" :prefix="stat.prefix || ''" />
            </div>
          </div>
        </ElCard>
      </ElCol>
    </ElRow>

    <!-- 下方区域 -->
    <ElRow :gutter="20" class="bottom-row">
      <!-- 热门分类 -->
      <ElCol :span="12" :xs="24" :sm="24" :md="12">
        <ElCard class="section-card" shadow="hover">
          <template #header>
            <span class="card-title">热门分类</span>
          </template>
          <div class="category-list">
            <div v-for="cat in hotCategories" :key="cat.name" class="category-item">
              <div class="category-header">
                <span>{{ cat.name }}</span>
                <span class="category-count">{{ cat.count }} 件</span>
              </div>
              <ElProgress :percentage="cat.percent" :stroke-width="10" :show-text="false" />
            </div>
          </div>
        </ElCard>
      </ElCol>

      <!-- 最近成交 -->
      <ElCol :span="12" :xs="24" :sm="24" :md="12">
        <ElCard class="section-card" shadow="hover">
          <template #header>
            <span class="card-title">最近成交</span>
          </template>
          <ElTable :data="recentDeals" stripe style="width: 100%" size="small">
            <ElTableColumn prop="goods" label="商品" />
            <ElTableColumn prop="price" label="价格" width="80">
              <template #default="{ row }">
                <span style="color: #f56c6c; font-weight: bold">¥{{ row.price }}</span>
              </template>
            </ElTableColumn>
            <ElTableColumn prop="buyer" label="买家" width="90" />
            <ElTableColumn prop="time" label="时间" width="90" />
          </ElTable>
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped>
.board-page {
  padding: 24px 32px;
}

.page-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #303133;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  margin-bottom: 20px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.bottom-row {
  margin-top: 0;
}

.section-card {
  height: 100%;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #606266;
}

.category-count {
  color: #909399;
  font-size: 13px;
}
</style>
