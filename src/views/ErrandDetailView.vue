<template>
  <DetailBack>
    <LoadingState v-if="loading" text="正在加载任务详情..." />
    <ErrorState v-else-if="error" message="详情加载失败" show-retry @retry="loadData" />

    <article v-else-if="item" class="detail-card">
      <div class="detail-image">
        <img :src="item.image" :alt="item.title" />
        <span class="type-badge">{{ item.taskType }}</span>
      </div>

      <div class="detail-body">
        <div class="detail-header">
          <h1>{{ item.title }}</h1>
          <div class="reward-row">
            <span class="reward-label">跑腿报酬</span>
            <span class="reward">¥{{ item.reward }}</span>
          </div>
        </div>

        <div class="route-section">
          <div class="route-point from">
            <span class="dot"></span>
            <div class="point-info">
              <span class="point-label">取货地点</span>
              <span class="point-value">📍 {{ item.from }}</span>
            </div>
          </div>
          <div class="route-line"></div>
          <div class="route-point to">
            <span class="dot"></span>
            <div class="point-info">
              <span class="point-label">送达地点</span>
              <span class="point-value">🏁 {{ item.to }}</span>
            </div>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">任务类型</span>
            <span class="info-tag">{{ item.taskType }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">截止时间</span>
            <span class="info-value deadline">⏰ {{ item.deadline }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发布人</span>
            <span class="info-value">👤 {{ item.publisher }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">任务状态</span>
            <span class="status-tag" :class="item.status">{{ statusText }}</span>
          </div>
        </div>

        <div class="section">
          <h2>任务说明</h2>
          <p class="description-text">{{ item.description }}</p>
        </div>

        <div class="section tips">
          <h2>跑腿须知</h2>
          <ul>
            <li>接单前请确认自己的时间安排，确保能按时完成；</li>
            <li>取货时请注意核对物品信息，避免取错；</li>
            <li>完成后请及时联系发布人确认收货；</li>
            <li>报酬在任务完成后通过平台结算。</li>
          </ul>
        </div>

        <div class="action-bar">
          <button
            class="fav-btn"
            :class="{ active: isFavorited }"
            @click="toggleFavorite"
          >
            {{ isFavorited ? '❤ 已收藏' : '♡ 收藏' }}
          </button>
          <button class="accept-btn" @click="handleAccept">
            接此任务
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
import { getErrandById, type ErrandItem } from '../api/errand'
import { useFavoriteStore } from '../stores/favorite'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const favoriteStore = useFavoriteStore()
const toastStore = useToastStore()

const loading = ref(true)
const error = ref(false)
const item = ref<ErrandItem | null>(null)

const isFavorited = computed(() => {
  if (!item.value?.id) return false
  return favoriteStore.isFavorite('errand', Number(item.value.id))
})

const statusText = computed(() => {
  if (!item.value) return ''
  return item.value.status === 'open' ? '等待接单' : '已接单'
})

async function loadData() {
  const id = route.params.id as string
  loading.value = true
  error.value = false
  try {
    const res = await getErrandById(id)
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
    favoriteStore.removeFavorite('errand', id)
    toastStore.success('已取消收藏')
  } else {
    favoriteStore.addFavorite({
      id,
      type: 'errand',
      title: item.value.title,
      description: item.value.description,
    })
    toastStore.success('收藏成功')
  }
}

function handleAccept() {
  toastStore.success('已成功接单，请尽快联系发布人')
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
  background: #fef3c7;
  color: #d97706;
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

.reward-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-top: 12px;
}

.reward-label {
  font-size: 13px;
  color: #9ca3af;
}

.reward {
  font-size: 28px;
  font-weight: 700;
  color: #ea580c;
}

.route-section {
  margin-top: 24px;
  padding: 20px;
  background: #fff7ed;
  border-radius: 12px;
}

.route-point {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.route-point .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.route-point.from .dot {
  background: #3b82f6;
}

.route-point.to .dot {
  background: #22c55e;
}

.point-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.point-label {
  font-size: 12px;
  color: #9ca3af;
}

.point-value {
  font-size: 15px;
  font-weight: 500;
  color: #374151;
}

.route-line {
  width: 2px;
  height: 24px;
  background: #fdba74;
  margin-left: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
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
  background: #fef3c7;
  color: #d97706;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  width: fit-content;
}

.status-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  width: fit-content;
}

.status-tag.open {
  background: #dcfce7;
  color: #16a34a;
}

.status-tag.closed {
  background: #f3f4f6;
  color: #9ca3af;
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
  border-left: 3px solid #f59e0b;
}

.section.tips {
  padding: 16px;
  background: #fffbeb;
  border-radius: 10px;
}

.section.tips ul {
  padding-left: 0;
}

.section.tips li {
  color: #92400e;
  font-size: 14px;
  line-height: 2;
  padding-left: 16px;
  position: relative;
}

.section.tips li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #f59e0b;
}

.description-text {
  color: #4b5563;
  line-height: 1.8;
  font-size: 15px;
  white-space: pre-wrap;
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

.accept-btn {
  flex: 2;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.accept-btn:hover {
  opacity: 0.9;
}
</style>
