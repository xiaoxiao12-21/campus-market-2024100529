<template>
  <section class="page">
    <div class="page-header">
      <h1>跑腿委托</h1>
      <p>发布跑腿任务或接单赚取报酬，让校园生活更便捷。</p>
    </div>

    <SearchBar
      v-model="keyword"
      placeholder="搜索标题、任务类型、取件地点或送达地点"
    />

    <LoadingState
      v-if="loading"
      text="正在加载跑腿委托信息..."
    />

    <ErrorState
      v-else-if="error"
      message="跑腿委托数据加载失败，请检查 Mock 服务是否正常运行。"
      show-retry
      @retry="loadErrands"
    />

    <EmptyState
      v-else-if="filteredItems.length === 0"
      text="暂无符合条件的跑腿委托信息"
    />

    <div v-else class="list">
      <ItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :title="item.title"
        :description="item.description"
        :tag="item.taskType"
        :location="`${item.from} → ${item.to}`"
        :time="item.deadline"
        :image="item.image"
        :to="`/errand/${item.id}`"
      >
        <template #footer>
          <strong class="reward">¥{{ item.reward }}</strong>

          <button
            class="favorite-btn"
            :class="{ active: favoriteStore.isFavorite('errand', Number(item.id)) }"
            @click.stop="handleToggleFavorite(item)"
          >
            {{ favoriteStore.isFavorite('errand', Number(item.id)) ? '已收藏' : '收藏' }}
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
import { getErrands, type ErrandItem } from '../api/errand'
import { useFavoriteStore } from '../stores/favorite'
import { useToastStore } from '../stores/toast'

const favoriteStore = useFavoriteStore()
const toastStore = useToastStore()
const errands = ref<ErrandItem[]>([])
const loading = ref(false)
const error = ref(false)
const keyword = ref('')

const filteredItems = computed(() => {
  const value = keyword.value.trim()

  if (!value) {
    return errands.value
  }

  return errands.value.filter((item) => {
    return (
      item.title.includes(value) ||
      item.taskType.includes(value) ||
      item.from.includes(value) ||
      item.to.includes(value) ||
      item.description.includes(value)
    )
  })
})

function handleToggleFavorite(item: ErrandItem) {
  const added = favoriteStore.toggleFavorite({
    id: Number(item.id),
    type: 'errand',
    title: item.title,
    description: item.description,
    location: `${item.from} → ${item.to}`
  })
  toastStore.success(added ? '收藏成功' : '已取消收藏')
}

async function loadErrands() {
  loading.value = true
  error.value = false

  try {
    const res = await getErrands()
    errands.value = res.data
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadErrands()
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

.reward {
  color: #dc2626;
  font-size: 18px;
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
