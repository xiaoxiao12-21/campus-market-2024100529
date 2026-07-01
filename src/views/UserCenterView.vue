<template>
  <section class="page">
    <div class="profile-card">
      <div class="avatar">
        {{ userStore.displayName.slice(0, 1) }}
      </div>

      <div>
        <h1>{{ userStore.displayName }}</h1>
        <p>{{ userStore.userDescription }}</p>
        <p>{{ userStore.currentUser.bio }}</p>
      </div>
    </div>

    <div class="panel">
      <h2>我的收藏 <span class="count">({{ favoriteStore.favoriteCount }})</span></h2>

      <EmptyState
        v-if="favoriteStore.favorites.length === 0"
        text="暂无收藏内容"
      />

      <div v-else class="favorite-list">
        <ItemCard
          v-for="item in favoriteStore.favorites"
          :key="`${item.type}-${item.id}`"
          :title="item.title"
          :description="item.description"
          :tag="getTypeLabel(item.type)"
          :location="item.location"
        >
          <template #footer>
            <button class="remove-btn" @click="favoriteStore.removeFavorite(item.type, item.id)">
              取消收藏
            </button>
          </template>
        </ItemCard>
      </div>
    </div>

    <div class="panel">
      <h2>我的发布 <span class="count">({{ myPublishList.length }})</span></h2>

      <p v-if="loadingMyPublishes" class="hint">正在加载我的发布...</p>
      <EmptyState
        v-else-if="myPublishList.length === 0"
        text="暂无发布内容，去发布页面发布第一条信息吧"
      />

      <div v-else class="publish-list">
        <ItemCard
          v-for="item in myPublishList"
          :key="`my-${item.type}-${item.id}`"
          :title="item.title"
          :description="item.description"
          :tag="getTypeLabel(item.type)"
          :location="item.location"
          :time="item.time"
        >
          <template #footer>
            <span class="status" :class="item.status">{{ getStatusLabel(item.status) }}</span>
          </template>
        </ItemCard>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import ItemCard from '../components/ItemCard.vue'
import { useFavoriteStore } from '../stores/favorite'
import { useUserStore } from '../stores/user'
import { getTrades, type TradeItem } from '../api/trade'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, type ErrandItem } from '../api/errand'

interface MyPublishItem {
  id: string | number
  type: 'trade' | 'lostFound' | 'groupBuy' | 'errand'
  title: string
  description: string
  location?: string
  time?: string
  status: string
}

const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const trades = ref<TradeItem[]>([])
const lostFounds = ref<LostFoundItem[]>([])
const groupBuys = ref<GroupBuyItem[]>([])
const errands = ref<ErrandItem[]>([])
const loadingMyPublishes = ref(true)

onMounted(async () => {
  try {
    const [tradeRes, lostFoundRes, groupBuyRes, errandRes] = await Promise.all([
      getTrades(),
      getLostFounds(),
      getGroupBuys(),
      getErrands(),
    ])
    trades.value = tradeRes.data
    lostFounds.value = lostFoundRes.data
    groupBuys.value = groupBuyRes.data
    errands.value = errandRes.data
  } catch (e) {
    console.error('加载发布数据失败：', e)
  } finally {
    loadingMyPublishes.value = false
  }
})

const myPublishList = computed<MyPublishItem[]>(() => {
  const myName = userStore.displayName
  const result: MyPublishItem[] = []

  trades.value
    .filter((item) => item.publisher === myName)
    .forEach((item) => {
      result.push({
        id: item.id ?? '',
        type: 'trade',
        title: item.title,
        description: item.description,
        location: item.location,
        time: item.publishTime,
        status: item.status,
      })
    })

  lostFounds.value
    .filter((item) => item.publisher === myName)
    .forEach((item) => {
      result.push({
        id: item.id ?? '',
        type: 'lostFound',
        title: item.title,
        description: item.description,
        location: item.location,
        time: item.eventTime,
        status: item.status,
      })
    })

  groupBuys.value
    .filter((item) => item.publisher === myName)
    .forEach((item) => {
      result.push({
        id: item.id ?? '',
        type: 'groupBuy',
        title: item.title,
        description: item.description,
        location: item.location,
        time: item.deadline,
        status: item.status,
      })
    })

  errands.value
    .filter((item) => item.publisher === myName)
    .forEach((item) => {
      result.push({
        id: item.id ?? '',
        type: 'errand',
        title: item.title,
        description: item.description,
        location: `${item.from} → ${item.to}`,
        time: item.deadline,
        status: item.status,
      })
    })

  return result
})

function getTypeLabel(type: string) {
  const map: Record<string, string> = {
    trade: '二手交易',
    lostFound: '失物招领',
    groupBuy: '拼单搭子',
    errand: '跑腿委托',
  }

  return map[type] || '校园信息'
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    open: '进行中',
    closed: '已结束',
    completed: '已完成',
  }
  return map[status] || status
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card,
.panel {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #eff6ff;
  color: #2563eb;
  font-size: 28px;
  font-weight: 700;
}

.profile-card h1,
.panel h2 {
  margin: 0 0 8px;
}

.count {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
}

.profile-card p,
.hint {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.favorite-list,
.publish-list {
  display: grid;
  gap: 16px;
}

.remove-btn {
  margin-left: auto;
  border: none;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  background: #f3f4f6;
  color: #374151;
}

.remove-btn:hover {
  background: #e5e7eb;
}

.status {
  margin-left: auto;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.status.open {
  background: #dcfce7;
  color: #166534;
}

.status.closed,
.status.completed {
  background: #f3f4f6;
  color: #6b7280;
}
</style>
