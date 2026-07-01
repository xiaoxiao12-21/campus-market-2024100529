# Day5 Evidence - Pinia 状态管理与用户中心

## 1. 今日完成内容

今天完成了校园轻集市的 Pinia 状态管理集成和用户中心页面建设，实现了跨组件状态共享：

1. 确认并挂载 Pinia 状态管理库（main.ts 中已正确配置）
2. 创建用户状态 Store（`src/stores/user.ts`），管理登录状态和用户信息
3. 创建收藏状态 Store（`src/stores/favorite.ts`），实现跨页面收藏功能
4. 在 AppHeader 导航栏中展示当前用户名称
5. 在 PublishView 发布页面中使用当前用户作为发布人
6. 在四个业务列表页（二手交易、失物招领、拼单搭子、跑腿委托）添加收藏按钮
7. 完善 UserCenterView 用户中心页面，展示用户资料、我的收藏、我的发布
8. 补充 MessageView 消息中心基础静态展示

## 2. Pinia Store 设计

### 用户状态 Store（user.ts）

| 类型 | 名称 | 说明 |
|------|------|------|
| Interface | `CurrentUser` | 用户数据结构（id、name、college、grade、avatar、bio） |
| State | `isLoggedIn` | 登录状态，默认 true（模拟登录） |
| State | `currentUser` | 当前用户信息，默认"校园用户/计算机学院/2023级" |
| Getter | `displayName` | 计算显示名称 |
| Getter | `userDescription` | 计算"学院 · 年级"描述 |
| Action | `updateProfile()` | 更新用户资料 |
| Action | `login()` / `logout()` | 登录/登出切换 |

### 收藏状态 Store（favorite.ts）

| 类型 | 名称 | 说明 |
|------|------|------|
| Interface | `FavoriteItem` | 收藏项结构（id、type、title、description、location） |
| State | `favorites` | 收藏列表数组 |
| Getter | `favoriteCount` | 收藏数量统计 |
| Action | `isFavorite()` | 判断是否已收藏（按 type+id 去重） |
| Action | `addFavorite()` | 添加收藏（存在则跳过） |
| Action | `removeFavorite()` | 取消收藏 |
| Action | `toggleFavorite()` | 切换收藏状态 |

收藏状态目前保存在前端内存中，刷新页面后重置，这是 Day5 阶段可接受的实现，后续可通过 localStorage 或后端接口持久化。

## 3. 状态使用覆盖情况

Pinia 状态在以下组件/页面中使用：

**用户状态（useUserStore）：**
- `src/components/AppHeader.vue` - 导航栏右侧显示用户名
- `src/views/PublishView.vue` - 发布时自动填充当前用户为 publisher
- `src/views/UserCenterView.vue` - 用户中心展示头像、名称、学院年级、个人简介

**收藏状态（useFavoriteStore）：**
- `src/views/TradeView.vue` - 二手交易列表收藏按钮
- `src/views/LostFoundView.vue` - 失物招领列表收藏按钮
- `src/views/GroupBuyView.vue` - 拼单搭子列表收藏按钮
- `src/views/ErrandView.vue` - 跑腿委托列表收藏按钮
- `src/views/UserCenterView.vue` - 个人中心"我的收藏"列表展示与取消收藏

这充分体现了 Pinia 状态管理的核心价值：同一份状态在多个页面和组件间共享，修改一处自动更新所有使用处。

## 4. 用户中心页面结构

UserCenterView 分为三大模块：

1. **用户资料卡片**：左侧圆形头像（取用户名首字），右侧显示用户名、学院年级、个人简介，数据完全来自 userStore。
2. **我的收藏**：从 favoriteStore 读取收藏列表，使用 ItemCard 组件统一展示，支持"取消收藏"按钮；空状态显示"暂无收藏内容"。
3. **我的发布**：使用 `Promise.all` 并发请求四类业务接口，通过 `computed` 计算属性按 `publisher === userStore.displayName` 筛选当前用户发布的内容，统一映射为 `MyPublishItem` 结构展示；不同状态（open/closed/completed）显示不同颜色标签；空状态引导用户去发布。

为解决四类业务数据结构不同的问题，定义了统一的 `MyPublishItem` 接口，将 id、type、title、description、location、time、status 映射为统一格式，跑腿委托的地点特殊处理为 `from → to` 格式。

## 5. API 层补充

在 `src/api/lostFound.ts` 的 `LostFoundItem` 接口中补充了 `publisher: string` 字段，与其他三类业务接口保持一致，确保发布时能正确记录发布人信息。

## 6. AI 协作记录

使用 TRAE IDE 内置 AI 助手，按 Task 1~9 逐步提示（如"创建用户状态 Store""在导航栏显示用户信息""在列表页添加收藏按钮"等）。AI 生成了 Store 基础结构、模板代码和样式，提高了开发效率。

AI 生成内容存在以下需要人工调整的地方：
1. 收藏按钮 `margin-left` 未设置，按钮未靠右对齐
2. API 返回的 id 为 string 类型，但 FavoriteItem 中 id 定义为 number，需要 `Number()` 转换
3. 失物招领 API 接口类型缺少 publisher 字段，会导致类型错误
4. "我的发布"模块最初仅显示提示文字，未实现真实数据筛选
5. PublishView 中 `form.reward === ''` 类型比较错误（number 与 string 比较）

## 7. 人工调整内容

在 AI 生成基础上做了以下调整：
- 为所有收藏按钮和取消收藏按钮添加 `margin-left: auto`，使按钮靠右对齐
- 收藏操作时对 item.id 做 `Number()` 转换，匹配 FavoriteItem 接口类型
- 在 lostFound.ts 中补充 publisher 字段定义
- 完整实现"我的发布"功能：并发请求四类接口、computed 筛选、统一数据结构、状态标签
- 修复 PublishView 中 `form.reward === ''` 类型错误（reward 已通过 v-model.number 绑定为 number）
- 为消息中心添加了三条分类静态消息（系统通知/功能提示/收藏小贴士），使用彩色圆形图标区分类型
- 为收藏数量和发布数量添加了数字徽标

## 8. 测试记录

测试环境：`npm run mock`（3001端口）+ `npm run dev`（5173端口）。

测试流程：
1. 访问首页，导航栏右侧显示"校园用户"
2. 进入二手交易页面，每个卡片右下角有"收藏"按钮，点击变为"已收藏"
3. 切换到失物招领、拼单搭子、跑腿委托页面，收藏按钮功能一致
4. 进入个人中心，头像显示"校"字，下方显示名称、"计算机学院 · 2023 级"、个人简介
5. "我的收藏"区域展示刚才收藏的卡片，按类型显示不同标签
6. 点击"取消收藏"按钮，卡片从列表中移除
7. 进入发布页面发布一条二手交易信息，回到个人中心，"我的发布"区域出现该条记录，状态标签为绿色"进行中"
8. 进入消息中心，展示三条静态通知消息
9. `npm run type-check` 类型检查全部通过，`npm run build` 构建成功

## 9. 遇到的问题与解决方法

**问题：四类业务数据结构差异大**。trades 有 price/publishTime、lostFounds 有 eventTime/itemName、groupBuys 有 targetCount/deadline、errands 有 from/to/reward，直接混合展示会导致类型混乱。解决方法是定义统一的 `MyPublishItem` 接口，在 computed 中对每类数据做字段映射，提取公共需要的 title/description/location/time/status，跑腿委托的地点单独拼接为 `${from} → ${to}`。

**问题：收藏后切换页面按钮状态不同步**。这是因为 Pinia Store 是全局单例，状态本身是响应式的，只要正确使用 storeToRefs 或直接访问 store 属性，按钮文字（"收藏"/"已收藏"）会自动更新。测试中确认状态响应式正常工作。

## 10. 今日反思

Pinia 作为 Vue 3 官方推荐的状态管理库，相比 Vuex 简化了很多概念（没有 mutations，直接在 actions 中修改状态），配合 Composition API 使用非常自然。今天的实践让我深刻体会到状态管理的价值：当用户名需要在导航栏、发布页、个人中心三个地方展示时，如果用 props 逐层传递会非常繁琐，而通过 Pinia 只需要在任意组件中调用 `useUserStore()` 即可获取和修改同一份状态。

收藏功能是跨页面状态共享的典型场景：用户在列表页点击收藏，个人中心立刻能看到收藏列表，这就是 Store 作为"单一数据源"的优势。用户中心的"我的发布"则展示了如何从多个 API 聚合数据并通过 computed 做客户端筛选，这种模式在实际项目中很常见。整体来看，Day5 完成了从"组件各自维护状态"到"全局统一状态管理"的升级，为后续更复杂的交互（如消息推送、登录鉴权、主题切换等）打下了基础。
