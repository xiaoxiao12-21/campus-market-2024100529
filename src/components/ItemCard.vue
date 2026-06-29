<template>
  <article class="item-card">
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
  </article>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  tag?: string
  location?: string
  time?: string
}>()
</script>

<style scoped>
.item-card {
  padding: 18px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s, transform 0.2s;
}

.item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.item-card__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.item-card h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.description {
  margin: 12px 0;
  color: #4b5563;
  line-height: 1.6;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  gap: 16px;
  color: #9ca3af;
  font-size: 13px;
  flex-wrap: wrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.footer {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer strong {
  font-size: 18px;
  color: #dc2626;
}
</style>
