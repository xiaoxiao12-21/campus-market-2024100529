<script setup lang="ts"></script>

<template>
  <main class="app">
    <header class="app-header">
      <h1>校园轻集市</h1>
      <nav class="app-nav">
        <RouterLink to="/home">首页</RouterLink>
        <RouterLink to="/list">列表</RouterLink>
        <RouterLink to="/publish">发布</RouterLink>
        <RouterLink to="/message">消息</RouterLink>
        <RouterLink to="/profile">我的</RouterLink>
      </nav>
    </header>

    <RouterView />
  </main>
</template>

<style scoped>
.app {
  min-height: 100vh;
  padding: 0;
}

.app-header {
  padding: 16px 32px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #fff;
}

.app-header h1 {
  margin: 0 0 12px 0;
  font-size: 20px;
  color: #1f2937;
}

.app-nav {
  display: flex;
  gap: 24px;
}

.app-nav a {
  text-decoration: none;
  color: #4b5563;
  font-size: 15px;
  padding: 6px 0;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
}

.app-nav a:hover {
  color: #2563eb;
}

.app-nav a.router-link-active {
  color: #2563eb;
  border-bottom-color: #2563eb;
  font-weight: 500;
}
</style>
