<template>
  <DetailBack>
    <LoadingState v-if="loading" text="正在加载拼单详情..." />
    <ErrorState v-else-if="error" message="详情加载失败" show-retry @retry="loadData" />

    <article v-else-if="item" class="detail-card">
      <div class="detail-image">
        <img :src="item.image" :alt="item.title" />
        <span class="type-badge">{{ item.type }}</span>
      </div>

      <div class="detail-body">
        <div class="detail-header">
          <h1>{{ item.title }}</h1>
          <div class="progress-section">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <div class="progress-text">
              <span class="current">{{ item.currentCount }}人</span>
              <span class="divider">/</span>
              <span class="target">{{ item.targetCount }}人</span>
              <span v-if="isFull" class="full-tag">已满员</span>
            </div>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">拼单类型</span>
            <span class="info-tag">{{ item.type }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">拼单地点</span>
            <span class="info-value">📍 {{ item.location }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发起人</span>
            <span class="info-value">👤 {{ item.publisher }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">截止时间</span>
            <span class="info-value deadline">⏰ {{ item.deadline }}</span>
          </div>
        </div>

        <div class="section">
          <h2>拼单说明</h2>
          <p class="description-text">{{ item.description }}</p>
        </div>

        <div class="section members">
          <h2>已加入 ({{ item.currentCount }}/{{ item.targetCount }})</h2>
          <div class="member-list">
            <div v-for="n in item.currentCount" :key="n" class="member-avatar">
              {{ getMemberName(n) }}
            </div>
            <div v-if="!isFull" class="member-avatar add">+</div>
          </div>
        </div>

        <div class="action-bar">
          <button
            class="fav-btn"
            :class="{ active: isFavorited }"
            @click="toggleFavorite"
          >
            {{ isFavorited ? '❤ 已收藏' : '♡ 收藏' }}
          </button>
          <button
            class="join-btn"
            :class="{ full: isFull }"
            :disabled="isFull"
            @click="handleJoin"
          >
            {{ isFull ? '人数已满' : '加入拼单' }}
          </button>
        </div>
      </div>
    </article>
  </DetailBack>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import DetailBack from '../components/DetailBack.vue'
import ErrorState from '../components/ErrorState.vue'
import LoadingState from '../components/LoadingState.vue'
import { getGroupBuyById, type GroupBuyItem } from '../api/groupBuy'
import { useFavoriteStore } from '../stores/favorite'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const favoriteStore = useFavoriteStore()
const toastStore = useToastStore()

const loading = ref(true)
const error = ref(false)
const item = ref<GroupBuyItem | null>(null)

const isFavorited = computed(() => {
  if (!item.value?.id) return false
  return favoriteStore.isFavorite('groupBuy', Number(item.value.id))
})

const isFull = computed(() => {
  if (!item.value) return false
  return item.value.currentCount >= item.value.targetCount
})

const progressPercent = computed(() => {
  if (!item.value) return 0
  return Math.min((item.value.currentCount / item.value.targetCount) * 100, 100)
})

const memberNames = ['发起人', '同学A', '同学B', '同学C', '同学D', '同学E', '同学F', '同学G', '同学H']

function getMemberName(n: number) {
  return memberNames[Math.min(n - 1, memberNames.length - 1)]
}

async function loadData() {
  const id = route.params.id as string
  loading.value = true
  error.value = false
  try {
    const res = await getGroupBuyById(id)
    item.value = res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

function toggleFavorite() {
  if (!item.value?.id) return
  const id = Number(item.value.id)
  if (isFavorited.value) {
    favoriteStore.removeFavorite('groupBuy', id)
    toastStore.success('已取消收藏')
  } else {
    favoriteStore.addFavorite({
      id,
      type: 'groupBuy',
      title: item.value.title,
      description: item.value.description,
      location: item.value.location,
    })
    toastStore.success('收藏成功')
  }
}

function handleJoin() {
  if (isFull.value) return
  toastStore.success('已成功加入拼单，请等待发起人联系')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.detail-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.detail-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: #f3f4f6;
  overflow: hidden;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.type-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  background: #dcfce7;
  color: #16a34a;
}

.detail-body {
  padding: 24px;
}

.detail-header h1 {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
}

.progress-section {
  margin-top: 16px;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.progress-text {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 14px;
}

.progress-text .current {
  font-size: 20px;
  font-weight: 700;
  color: #16a34a;
}

.progress-text .divider {
  color: #d1d5db;
}

.progress-text .target {
  color: #6b7280;
}

.full-tag {
  margin-left: 8px;
  padding: 2px 8px;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 4px;
  font-size: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #9ca3af;
}

.info-value {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.info-value.deadline {
  color: #ea580c;
}

.info-tag {
  display: inline-block;
  padding: 3px 10px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  width: fit-content;
}

.section {
  margin-top: 28px;
}

.section h2 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid #22c55e;
}

.description-text {
  color: #4b5563;
  line-height: 1.8;
  font-size: 15px;
  white-space: pre-wrap;
}

.members .member-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.member-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
}

.member-avatar:nth-child(2) {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.member-avatar:nth-child(3) {
  background: linear-gradient(135deg, #10b981, #059669);
}

.member-avatar:nth-child(4) {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.member-avatar.add {
  background: #f3f4f6;
  color: #9ca3af;
  font-size: 20px;
  cursor: pointer;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
}

.fav-btn {
  flex: 1;
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.fav-btn:hover {
  border-color: #fca5a5;
  color: #dc2626;
}

.fav-btn.active {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #dc2626;
}

.join-btn {
  flex: 2;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.join-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.join-btn.full {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}
</style>
