<template>
  <RouterLink v-if="to" :to="to" class="item-card card-link">
    <div v-if="image" class="card-image">
      <img :src="image" :alt="title" />
    </div>
    <div class="card-content">
      <div class="item-card__header">
        <h3>{{ title }}</h3>
        <span v-if="tag" class="tag">{{ tag }}</span>
      </div>
      <p class="description">{{ description }}</p>
      <div class="meta">
        <span v-if="location" class="meta-item">📍 {{ location }}</span>
        <span v-if="time" class="meta-item">🕐 {{ time }}</span>
      </div>
      <div v-if="$slots.footer" class="footer">
        <slot name="footer" />
      </div>
    </div>
  </RouterLink>
  <article v-else class="item-card">
    <div v-if="image" class="card-image">
      <img :src="image" :alt="title" />
    </div>
    <div class="card-content">
      <div class="item-card__header">
        <h3>{{ title }}</h3>
        <span v-if="tag" class="tag">{{ tag }}</span>
      </div>
      <p class="description">{{ description }}</p>
      <div class="meta">
        <span v-if="location" class="meta-item">📍 {{ location }}</span>
        <span v-if="time" class="meta-item">🕐 {{ time }}</span>
      </div>
      <div v-if="$slots.footer" class="footer">
        <slot name="footer" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  tag?: string
  location?: string
  time?: string
  image?: string
  to?: string
}>()
</script>

<style scoped>
.item-card {
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s, transform 0.2s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.card-link:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.card-image {
  width: 100%;
  aspect-ratio: 16 / 10;
  background: #f3f4f6;
  overflow: hidden;
  flex-shrink: 0;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.card-link:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-card__header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.item-card h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag {
  padding: 3px 8px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.description {
  margin: 8px 0;
  color: #4b5563;
  line-height: 1.5;
  font-size: 13px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  gap: 12px;
  color: #9ca3af;
  font-size: 12px;
  flex-wrap: wrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.footer {
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: space-between;
}

.footer strong {
  font-size: 16px;
  color: #dc2626;
}
</style>
