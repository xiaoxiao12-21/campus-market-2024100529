# Day2 Evidence

日期：2026-06-28

---

## 一、今日新增页面

在 `src/views/` 目录下新增 6 个页面骨架，加上原有 HomeView 共 7 个页面：

| 页面文件 | 页面名称 | 路由路径 | 功能说明 |
|---------|---------|---------|---------|
| [ListView.vue](file:///d:/1/campus-market-seed/campus-market-seed/src/views/ListView.vue) | 列表页 | `/list` | 商品/信息列表展示，包含搜索栏、分类筛选、商品卡片网格，支持点击跳转到详情页 |
| [DetailView.vue](file:///d:/1/campus-market-seed/campus-market-seed/src/views/DetailView.vue) | 详情页 | `/detail/:id` | 单个商品信息展示，通过路由参数 id 获取商品数据，包含商品描述、价格、卖家信息及操作按钮 |
| [PublishView.vue](file:///d:/1/campus-market-seed/campus-market-seed/src/views/PublishView.vue) | 发布页 | `/publish` | 发布信息入口（骨架已完成） |
| [MessageView.vue](file:///d:/1/campus-market-seed/campus-market-seed/src/views/MessageView.vue) | 消息页 | `/message` | 消息通知入口（骨架已完成） |
| [ProfileView.vue](file:///d:/1/campus-market-seed/campus-market-seed/src/views/ProfileView.vue) | 个人中心 | `/profile` | 用户个人中心入口（骨架已完成） |
| [BoardView.vue](file:///d:/1/campus-market-seed/campus-market-seed/src/views/BoardView.vue) | 看板页 | `/board` | 数据统计概览，包含6个统计卡片（商品总数、在售商品、消息总数、注册用户、今日浏览、成交金额）、热门分类进度条、最近成交表格 |

**页面完成度说明**：
- ListView、DetailView、BoardView 已使用 Element Plus 组件完成基础 UI 和交互
- PublishView、MessageView、ProfileView 目前为基础骨架，后续逐步完善

---

## 二、路由设计

在 [src/router/index.ts](file:///d:/1/campus-market-seed/campus-market-seed/src/router/index.ts) 中配置完整路由系统：

### 路由表设计

```typescript
routes: [
  { path: '/', redirect: '/home' },                    // 根路径重定向到首页
  { path: '/home', name: 'Home', component: HomeView },
  { path: '/list', name: 'List', component: () => import('@/views/ListView.vue') },
  { path: '/detail/:id', name: 'Detail', component: () => import('@/views/DetailView.vue'), props: true },
  { path: '/publish', name: 'Publish', component: () => import('@/views/PublishView.vue') },
  { path: '/message', name: 'Message', component: () => import('@/views/MessageView.vue') },
  { path: '/profile', name: 'Profile', component: () => import('@/views/ProfileView.vue') },
  { path: '/board', name: 'Board', component: () => import('@/views/BoardView.vue') },
]
```

### 路由设计要点

1. **重定向处理**：根路径 `/` 自动重定向到 `/home`，确保用户访问根地址时有默认页面
2. **路由懒加载**：除首页外，其他页面均使用 `() => import()` 动态导入方式，实现代码分割，优化首屏加载速度
3. **动态路由参数**：详情页使用 `/detail/:id` 动态路由，通过 `props: true` 开启参数自动传递，在组件中可直接通过 props 或 `useRoute()` 获取 id
4. **命名路由**：所有路由均配置 `name` 属性，便于编程式导航时使用名称跳转（如 `router.push({ name: 'Detail', params: { id } })`）
5. **导航系统**：在 [App.vue](file:///d:/1/campus-market-seed/campus-market-seed/src/App.vue) 中使用 Element Plus 的 `<el-menu>` 组件实现水平导航栏，包含首页、列表、发布、消息、我的5个入口，并额外添加"数据看板"按钮
6. **页面跳转**：列表页商品卡片绑定点击事件，携带商品 id 跳转到详情页；详情页提供返回按钮可回到列表页

---

## 三、遇到的问题

### 1. 项目根目录识别问题
- **问题**：最初未注意到项目实际位于 `campus-market-seed/campus-market-seed/` 子目录中，文件创建路径错误
- **解决**：通过 LS 工具确认正确目录结构后，所有文件操作均使用完整绝对路径
- **教训**：操作前先确认目录结构，不要假设当前工作目录

### 2. Element Plus 图标名称错误
- **问题**：构建时报错 `MISSING_EXPORT: "Home" is not exported by "@element-plus/icons-vue"`，使用了不存在的图标名称（Home、Goods、DataBoard）
- **解决**：查阅 Element Plus 图标文档，将图标名修正为正确名称：
  - `Home` → `House`
  - `Goods` → `ShoppingCart`
  - `DataBoard` → `DataAnalysis`
- **教训**：使用第三方库组件时，要对照官方文档确认 API 和导出名称，不能凭猜测起名

### 3. Element Plus 图标库未单独安装
- **问题**：安装 Element Plus 后，直接导入图标组件报错，因为图标包 `@element-plus/icons-vue` 需要单独安装
- **解决**：执行 `npm install @element-plus/icons-vue` 单独安装图标库
- **教训**：注意 UI 库的分包策略，组件库和图标库可能是独立的包

### 4. 导航激活状态同步
- **问题**：页面刷新后，导航菜单的激活状态未根据当前路由自动更新
- **解决**：使用 `useRoute()` 获取当前路径，绑定到 `<el-menu>` 的 `default-active` 属性，并在菜单选择时更新 activeIndex
- **收获**：理解了响应式数据与路由状态同步的方式

---

## 四、AI 协作记录

### 协作任务1：创建页面骨架
- **Prompt**：在 src/views/ 下新增6个页面，每个页面包含指定的 template 结构
- **AI 输出**：批量创建了6个 .vue 文件，保持了与 HomeView.vue 一致的代码风格（script setup + template + style scoped）
- **验证**：文件全部创建成功，TypeScript 检查通过

### 协作任务2：配置路由系统
- **Prompt**：在 router/index.ts 中添加7个路由，使用懒加载方式
- **AI 输出**：更新路由配置，添加了重定向、懒加载导入、命名路由
- **自己调整**：后续进阶任务中将 `/detail` 改为 `/detail/:id` 并添加 `props: true`
- **验证**：vue-tsc 和 vite build 均通过

### 协作任务3：导航栏与 Element Plus 集成
- **Prompt**：使用 Element Plus 的 el-menu 组件优化导航，实现看板页统计展示，实现列表到详情的跳转
- **AI 输出**：
  - 安装并配置 Element Plus（main.ts 中注册）
  - App.vue 改用 el-menu + el-container 布局，带图标导航
  - ListView 实现搜索栏、商品卡片网格，点击跳转详情
  - DetailView 实现 el-descriptions 展示商品详情，支持 id 参数
  - BoardView 实现统计卡片、进度条、成交表格
- **问题修正**：AI 输出中图标名称有误，手动查文档修正后构建成功
- **验证**：开发服务器启动正常，页面可正常访问和跳转

### AI 使用心得
- AI 适合批量生成重复性代码（如多个页面骨架、相似的路由配置）
- AI 对第三方库的具体 API 可能记忆不准确（如图标名称），需要对照官方文档验证
- 分任务描述需求比一次性描述所有需求效果更好
- 构建报错时，AI 能帮助快速定位问题原因
