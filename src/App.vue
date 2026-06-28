<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMenu, ElMenuItem, ElContainer, ElHeader, ElMain, ElButton } from 'element-plus'
import { House, List, Plus, ChatDotRound, User, DataAnalysis } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeIndex = ref(route.path)

const menuItems = [
  { index: '/home', title: '首页', icon: House },
  { index: '/list', title: '列表', icon: List },
  { index: '/publish', title: '发布', icon: Plus },
  { index: '/message', title: '消息', icon: ChatDotRound },
  { index: '/profile', title: '我的', icon: User },
]

const handleSelect = (index: string) => {
  activeIndex.value = index
  router.push(index)
}
</script>

<template>
  <ElContainer class="app-layout">
    <ElHeader class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="logo">🏪 校园轻集市</h1>
          <ElButton
            :icon="DataAnalysis"
            size="small"
            type="primary"
            plain
            @click="router.push('/board')"
            class="board-btn"
          >
            数据看板
          </ElButton>
        </div>
        <ElMenu
          :default-active="activeIndex"
          mode="horizontal"
          class="nav-menu"
          @select="handleSelect"
          :ellipsis="false"
        >
          <ElMenuItem v-for="item in menuItems" :key="item.index" :index="item.index">
            <ElIcon><component :is="item.icon" /></ElIcon>
            <span>{{ item.title }}</span>
          </ElMenuItem>
        </ElMenu>
      </div>
    </ElHeader>
    <ElMain class="app-main">
      <RouterView />
    </ElMain>
  </ElContainer>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
}

.app-header {
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0;
  height: auto;
  min-height: 60px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  margin: 0;
  font-size: 20px;
  color: #303133;
  white-space: nowrap;
}

.board-btn {
  white-space: nowrap;
}

.nav-menu {
  border-bottom: none;
  flex: 1;
  max-width: 500px;
}

.app-main {
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
  padding: 0;
}
</style>
