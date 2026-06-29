<template>
  <section class="page">
    <div class="page-header">
      <h1>拼单搭子</h1>
      <p>找搭子一起拼单、团购、组队，享受更优惠的价格和有趣的校园生活。</p>
    </div>

    <div v-if="loading" class="loading-state">加载中...</div>
    <div v-else-if="errorMsg" class="error-state">{{ errorMsg }}</div>
    <EmptyState v-else-if="groupBuys.length === 0" text="暂无拼单团购信息" />
    <div v-else class="list">
      <ItemCard
        v-for="item in groupBuys"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.type"
        :location="item.location"
        :time="item.deadline"
      >
        <template #footer>
          <span class="progress">{{ item.currentCount }}/{{ item.targetCount }} 人</span>
        </template>
      </ItemCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ItemCard from '../components/ItemCard.vue'
import EmptyState from '../components/EmptyState.vue'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'

const groupBuys = ref<GroupBuyItem[]>([])
const loading = ref(true)
const errorMsg = ref('')

onMounted(async () => {
  try {
    const res = await getGroupBuys()
    groupBuys.value = res.data
  } catch (e) {
    errorMsg.value = '数据加载失败，请检查 Mock 服务器是否正常运行'
    console.error('加载拼单团购数据失败：', e)
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

.progress {
  color: #059669;
  font-weight: 500;
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
