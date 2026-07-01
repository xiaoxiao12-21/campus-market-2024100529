<template>
  <section class="page">
    <div class="page-header">
      <h1>二手交易</h1>
      <p>浏览同学发布的闲置物品，发现校园内的实用好物。</p>
    </div>

    <div v-if="loading" class="loading-state">加载中...</div>
    <div v-else-if="errorMsg" class="error-state">{{ errorMsg }}</div>
    <EmptyState v-else-if="trades.length === 0" text="暂无二手交易信息" />
    <div v-else class="list">
      <ItemCard
        v-for="item in trades"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.category"
        :location="item.location"
        :time="item.publishTime"
      >
        <template #footer>
          <strong>¥{{ item.price }}</strong>
          <span class="condition">{{ item.condition }}</span>

          <button class="favorite-btn" @click="favoriteStore.toggleFavorite({
            id: Number(item.id),
            type: 'trade',
            title: item.title,
            description: item.description,
            location: item.location
          })">
            {{ favoriteStore.isFavorite('trade', Number(item.id)) ? '已收藏' : '收藏' }}
          </button>
        </template>
      </ItemCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '../components/ItemCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { getTrades, type TradeItem } from '../api/trade'
import { useFavoriteStore } from '../stores/favorite'

const favoriteStore = useFavoriteStore()
const trades = ref<TradeItem[]>([])
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  try {
    const res = await getTrades()
    trades.value = res.data
  } catch (e) {
    errorMsg.value = '数据加载失败，请检查 Mock 服务器是否正常运行'
    console.error('加载二手交易数据失败：', e)
  } finally {
    loading.value = false
  }
})
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

.list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.condition {
  margin-left: 12px;
  color: #6b7280;
}

.favorite-btn {
  margin-left: auto;
  border: none;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
}

.favorite-btn:hover {
  background: #e5e7eb;
}

.loading-state,
.error-state {
  padding: 32px;
  text-align: center;
  background: #fff;
  border-radius: 12px;
}

.loading-state {
  color: #6b7280;
}

.error-state {
  color: #dc2626;
  border: 1px solid #fecaca;
  background: #fef2f2;
}
</style>
