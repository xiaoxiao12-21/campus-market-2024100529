<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElCard, ElTag, ElButton, ElInput, ElSelect, ElOption } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const searchKeyword = ref('')
const selectedCategory = ref('')

const categories = ['全部', '数码产品', '书籍教材', '代步工具', '生活用品', '服饰鞋包', '其他']

// 模拟商品列表数据
const goodsList = ref([
  { id: 1, title: '九成新iPad Pro 2022', price: 4200, seller: '张同学', category: '数码产品', image: '📱', time: '1小时前' },
  { id: 2, title: '高等数学教材（同济第七版）', price: 15, seller: '李同学', category: '书籍教材', image: '📚', time: '3小时前' },
  { id: 3, title: '捷安特山地自行车', price: 680, seller: '王同学', category: '代步工具', image: '🚲', time: '昨天' },
  { id: 4, title: '宿舍小冰箱 45L', price: 280, seller: '赵同学', category: '生活用品', image: '🧊', time: '昨天' },
  { id: 5, title: '罗技G304无线鼠标', price: 120, seller: '陈同学', category: '数码产品', image: '🖱️', time: '2天前' },
  { id: 6, title: '考研英语红宝书', price: 25, seller: '周同学', category: '书籍教材', image: '📖', time: '2天前' },
  { id: 7, title: '优衣库羽绒服男款L码', price: 200, seller: '吴同学', category: '服饰鞋包', image: '🧥', time: '3天前' },
  { id: 8, title: '小米手环7 NFC版', price: 150, seller: '郑同学', category: '数码产品', image: '⌚', time: '3天前' },
])

const goToDetail = (id: number) => {
  router.push({ name: 'Detail', params: { id: String(id) } })
}
</script>

<template>
  <div class="list-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <ElInput
        v-model="searchKeyword"
        placeholder="搜索商品..."
        :prefix-icon="Search"
        class="search-input"
        clearable
      />
      <ElSelect v-model="selectedCategory" placeholder="分类" class="category-select" clearable>
        <ElOption v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
      </ElSelect>
      <ElButton type="primary">搜索</ElButton>
    </div>

    <!-- 商品列表 -->
    <div class="goods-grid">
      <ElCard
        v-for="item in goodsList"
        :key="item.id"
        class="goods-card"
        shadow="hover"
        @click="goToDetail(item.id)"
      >
        <div class="goods-image">{{ item.image }}</div>
        <div class="goods-info">
          <h3 class="goods-title">{{ item.title }}</h3>
          <div class="goods-meta">
            <ElTag size="small" type="info">{{ item.category }}</ElTag>
            <span class="goods-time">{{ item.time }}</span>
          </div>
          <div class="goods-bottom">
            <span class="goods-price">¥{{ item.price }}</span>
            <span class="goods-seller">{{ item.seller }}</span>
          </div>
        </div>
      </ElCard>
    </div>
  </div>
</template>

<style scoped>
.list-page {
  padding: 24px 32px;
}

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.category-select {
  width: 140px;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.goods-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.goods-card:hover {
  transform: translateY(-4px);
}

.goods-image {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);
  border-radius: 8px;
  margin-bottom: 12px;
}

.goods-title {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 500;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.goods-time {
  font-size: 12px;
  color: #909399;
}

.goods-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goods-price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}

.goods-seller {
  font-size: 13px;
  color: #909399;
}
</style>
