<template>
  <section class="page">
    <div class="page-header">
      <h1>失物招领</h1>
      <p>帮助同学们找回丢失的物品，也可以发布拾到的物品信息。</p>
    </div>

    <div class="filter-bar">
      <SearchBar
        v-model="keyword"
        placeholder="搜索标题、物品名称、地点或描述"
      />
      <select v-model="typeFilter" class="type-select">
        <option value="">全部类型</option>
        <option value="lost">寻物</option>
        <option value="found">招领</option>
      </select>
    </div>

    <LoadingState
      v-if="loading"
      text="正在加载失物招领信息..."
    />

    <ErrorState
      v-else-if="error"
      message="失物招领数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadLostFounds"
    />

    <EmptyState
      v-else-if="filteredItems.length === 0"
      text="暂无符合条件的失物招领信息"
    />

    <div v-else class="list">
      <ItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.type === 'lost' ? '寻物启事' : '失物招领'"
        :location="item.location"
        :time="item.eventTime"
        :image="item.image"
        :to="`/lost-found/${item.id}`"
      >
        <template #footer>
          <span class="contact">{{ item.contact }}</span>

          <button
            class="favorite-btn"
            :class="{ active: favoriteStore.isFavorite('lostFound', Number(item.id)) }"
            @click.stop="handleToggleFavorite(item)"
          >
            {{ favoriteStore.isFavorite('lostFound', Number(item.id)) ? '已收藏' : '收藏' }}
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
import { getLostFounds, type LostFoundItem } from '../api/lostFound'
import { useFavoriteStore } from '../stores/favorite'
import { useToastStore } from '../stores/toast'

const favoriteStore = useFavoriteStore()
const toastStore = useToastStore()
const lostFounds = ref<LostFoundItem[]>([])
const loading = ref(false)
const error = ref(false)
const keyword = ref('')
const typeFilter = ref('')

const filteredItems = computed(() => {
  return lostFounds.value.filter((item) => {
    const matchType = !typeFilter.value || item.type === typeFilter.value
    const value = keyword.value.trim()
    const matchKeyword =
      !value ||
      item.title.includes(value) ||
      item.itemName.includes(value) ||
      item.location.includes(value) ||
      item.description.includes(value)

    return matchType && matchKeyword
  })
})

function handleToggleFavorite(item: LostFoundItem) {
  const added = favoriteStore.toggleFavorite({
    id: Number(item.id),
    type: 'lostFound',
    title: item.title,
    description: item.description,
    location: item.location
  })
  toastStore.success(added ? '收藏成功' : '已取消收藏')
}

async function loadLostFounds() {
  loading.value = true
  error.value = false

  try {
    const res = await getLostFounds()
    lostFounds.value = res.data
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLostFounds()
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

.filter-bar {
  display: flex;
  gap: 12px;
}

.filter-bar > :first-child {
  flex: 1;
}

.type-select {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  cursor: pointer;
}

.type-select:focus {
  outline: none;
  border-color: #2563eb;
}

.list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.contact {
  color: #2563eb;
  font-size: 14px;
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
