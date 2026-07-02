<template>
  <section class="page">
    <div class="page-header">
      <h1>拼单搭子</h1>
      <p>找搭子一起拼单、团购、组队，享受更优惠的价格和有趣的校园生活。</p>
    </div>

    <SearchBar
      v-model="keyword"
      placeholder="搜索标题、类型、地点或描述"
    />

    <LoadingState
      v-if="loading"
      text="正在加载拼单搭子信息..."
    />

    <ErrorState
      v-else-if="error"
      message="拼单搭子数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadGroupBuys"
    />

    <EmptyState
      v-else-if="filteredItems.length === 0"
      text="暂无符合条件的拼单搭子信息"
    />

    <div v-else class="list">
      <ItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.type"
        :location="item.location"
        :time="item.deadline"
        :image="item.image"
        :to="`/group-buy/${item.id}`"
      >
        <template #footer>
          <span class="progress">{{ item.currentCount }}/{{ item.targetCount }} 人</span>

          <button
            class="favorite-btn"
            :class="{ active: favoriteStore.isFavorite('groupBuy', Number(item.id)) }"
            @click.stop="handleToggleFavorite(item)"
          >
            {{ favoriteStore.isFavorite('groupBuy', Number(item.id)) ? '已收藏' : '收藏' }}
          </button>
        </template>
      </ItemCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import ItemCard from '../components/ItemCard.vue'
import EmptyState from '../components/EmptyState.vue'
import ErrorState from '../components/ErrorState.vue'
import LoadingState from '../components/LoadingState.vue'
import SearchBar from '../components/SearchBar.vue'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'
import { useFavoriteStore } from '../stores/favorite'
import { useToastStore } from '../stores/toast'

const favoriteStore = useFavoriteStore()
const toastStore = useToastStore()
const groupBuys = ref<GroupBuyItem[]>([])
const loading = ref(false)
const error = ref(false)
const keyword = ref('')

const filteredItems = computed(() => {
  const value = keyword.value.trim()

  if (!value) {
    return groupBuys.value
  }

  return groupBuys.value.filter((item) => {
    return (
      item.title.includes(value) ||
      item.type.includes(value) ||
      item.location.includes(value) ||
      item.description.includes(value)
    )
  })
})

function handleToggleFavorite(item: GroupBuyItem) {
  const added = favoriteStore.toggleFavorite({
    id: Number(item.id),
    type: 'groupBuy',
    title: item.title,
    description: item.description,
    location: item.location
  })
  toastStore.success(added ? '收藏成功' : '已取消收藏')
}

async function loadGroupBuys() {
  loading.value = true
  error.value = false

  try {
    const res = await getGroupBuys()
    groupBuys.value = res.data
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadGroupBuys()
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

.favorite-btn {
  margin-left: auto;
  border: none;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
  transition: all 0.2s;
}

.favorite-btn:hover {
  background: #e5e7eb;
}

.favorite-btn.active {
  background: #dbeafe;
  color: #2563eb;
}

.favorite-btn.active:hover {
  background: #bfdbfe;
}
</style>
