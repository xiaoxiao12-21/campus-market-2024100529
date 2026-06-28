<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { ElCard, ElTag, ElDescriptions, ElDescriptionsItem, ElButton } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

const route = useRoute()
const itemId = computed(() => route.params.id as string)

// 模拟商品数据
const goodsData: Record<string, { title: string; price: number; seller: string; category: string; desc: string; publishTime: string; status: string }> = {
  '1': { title: '九成新iPad Pro 2022', price: 4200, seller: '张同学', category: '数码产品', desc: '自用iPad Pro，11英寸256GB，带Apple Pencil二代，无磕碰无维修，配件齐全。因换新款出售，诚心要可小刀。', publishTime: '2024-01-15', status: '在售' },
  '2': { title: '高等数学教材（同济第七版）', price: 15, seller: '李同学', category: '书籍教材', desc: '考研用过的教材，有少量笔记，不影响阅读。上下册合售，送往年真题资料。', publishTime: '2024-01-14', status: '在售' },
  '3': { title: '捷安特山地自行车', price: 680, seller: '王同学', category: '代步工具', desc: 'ATX660型号，骑行一年，车况良好，刹车变速正常。适合校园通勤代步，送车锁和水壶架。', publishTime: '2024-01-13', status: '在售' },
  '4': { title: '宿舍小冰箱 45L', price: 280, seller: '赵同学', category: '生活用品', desc: '容声小冰箱，制冷效果好，静音，适合宿舍使用。毕业带不走，低价出，自提。', publishTime: '2024-01-12', status: '已预订' },
  '5': { title: '罗技G304无线鼠标', price: 120, seller: '陈同学', category: '数码产品', desc: '游戏鼠标，几乎全新，使用不到一个月，箱说全。手感轻盈，适合办公和游戏。', publishTime: '2024-01-11', status: '在售' },
}

const goods = computed(() => goodsData[itemId.value] || {
  title: '商品不存在',
  price: 0,
  seller: '',
  category: '',
  desc: '该商品可能已下架或不存在',
  publishTime: '',
  status: '',
})
</script>

<template>
  <div class="detail-page">
    <ElButton :icon="ArrowLeft" @click="$router.back()" class="back-btn">返回列表</ElButton>

    <ElCard class="detail-card">
      <template #header>
        <div class="card-header">
          <h2>{{ goods.title }}</h2>
          <ElTag :type="goods.status === '在售' ? 'success' : 'warning'">{{ goods.status }}</ElTag>
        </div>
      </template>

      <ElDescriptions :column="1" border>
        <ElDescriptionsItem label="商品ID">{{ itemId }}</ElDescriptionsItem>
        <ElDescriptionsItem label="价格">
          <span class="price">¥{{ goods.price }}</span>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="卖家">{{ goods.seller }}</ElDescriptionsItem>
        <ElDescriptionsItem label="分类">{{ goods.category }}</ElDescriptionsItem>
        <ElDescriptionsItem label="发布时间">{{ goods.publishTime }}</ElDescriptionsItem>
        <ElDescriptionsItem label="商品描述">{{ goods.desc }}</ElDescriptionsItem>
      </ElDescriptions>

      <div class="action-btns">
        <ElButton type="primary" size="large">立即联系卖家</ElButton>
        <ElButton size="large">收藏</ElButton>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
.detail-page {
  padding: 24px 32px;
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
}

.action-btns {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
