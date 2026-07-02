<template>
  <DetailBack>
    <LoadingState v-if="loading" text="正在加载详情..." />
    <ErrorState v-else-if="error" message="详情加载失败" show-retry @retry="loadData" />

    <article v-else-if="item" class="detail-card">
      <div class="detail-image">
        <img :src="item.image" :alt="item.title" />
        <span class="type-badge" :class="item.type">{{ typeText }}</span>
      </div>

      <div class="detail-body">
        <div class="detail-header">
          <span class="item-name-label">物品：{{ item.itemName }}</span>
          <h1>{{ item.title }}</h1>
        </div>

        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ item.type === 'lost' ? '丢失地点' : '拾取地点' }}</span>
            <span class="info-value">📍 {{ item.location }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">{{ item.type === 'lost' ? '丢失时间' : '拾取时间' }}</span>
            <span class="info-value">🕐 {{ item.eventTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发布人</span>
            <span class="info-value">👤 {{ item.publisher }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">联系方式</span>
            <span class="info-value contact">📱 {{ item.contact }}</span>
          </div>
        </div>

        <div class="section">
          <h2>详细描述</h2>
          <p class="description-text">{{ item.description }}</p>
        </div>

        <div class="section tips">
          <h2>温馨提示</h2>
          <p v-if="item.type === 'lost'">请丢失物品的同学携带能证明物品所有权的信息（如物品特征、内部物品等）联系发布人认领。</p>
          <p v-else>若该物品是您丢失的，请尽快联系发布人，描述物品细节以确认归属。</p>
        </div>

        <div class="action-bar">
          <button
            class="fav-btn"
            :class="{ active: isFavorited }"
            @click="toggleFavorite"
          >
            {{ isFavorited ? '❤ 已收藏' : '♡ 收藏' }}
          </button>
          <button class="contact-btn" @click="handleContact">
            {{ item.type === 'lost' ? '我有线索' : '我要认领' }}
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
import { getLostFoundById, type LostFoundItem } from '../api/lostFound'
import { useFavoriteStore } from '../stores/favorite'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const favoriteStore = useFavoriteStore()
const toastStore = useToastStore()

const loading = ref(true)
const error = ref(false)
const item = ref<LostFoundItem | null>(null)

const isFavorited = computed(() => {
  if (!item.value?.id) return false
  return favoriteStore.isFavorite('lostFound', Number(item.value.id))
})

const typeText = computed(() => {
  if (!item.value) return ''
  return item.value.type === 'lost' ? '寻物启事' : '失物招领'
})

async function loadData() {
  const id = route.params.id as string
  loading.value = true
  error.value = false
  try {
    const res = await getLostFoundById(id)
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
    favoriteStore.removeFavorite('lostFound', id)
    toastStore.success('已取消收藏')
  } else {
    favoriteStore.addFavorite({
      id,
      type: 'lostFound',
      title: item.value.title,
      description: item.value.description,
      location: item.value.location,
    })
    toastStore.success('收藏成功')
  }
}

function handleContact() {
  toastStore.success('已发起联系，请在消息中心查看回复')
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
}

.type-badge.lost {
  background: #fef3c7;
  color: #d97706;
}

.type-badge.found {
  background: #dcfce7;
  color: #16a34a;
}

.detail-body {
  padding: 24px;
}

.item-name-label {
  display: inline-block;
  padding: 4px 12px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 10px;
}

.detail-header h1 {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
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

.info-value.contact {
  color: #2563eb;
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
  border-left: 3px solid #2563eb;
}

.section.tips h2 {
  border-left-color: #f59e0b;
}

.section.tips {
  padding: 16px;
  background: #fffbeb;
  border-radius: 10px;
}

.section.tips p {
  color: #92400e;
  font-size: 14px;
  line-height: 1.7;
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

.contact-btn {
  flex: 2;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.contact-btn:hover {
  opacity: 0.9;
}
</style>
