# Day5 Evidence - 状态管理与用户中心

## 1. 今日完成内容

今天完成了校园轻集市的 Pinia 状态管理集成和用户中心页面建设：确认 Pinia 已正确挂载；创建 user Store 管理用户信息和登录状态；创建 favorite Store 实现跨页面收藏；在 AppHeader 显示用户名；PublishView 发布人改为从 Store 读取；四个业务列表页添加收藏按钮；完善 UserCenterView（用户资料+我的收藏+我的发布）；补充 MessageView 静态消息。

## 2. Store 设计说明

| Store 文件 | 管理内容 | 主要状态 | 主要方法 |
|---|---|---|---|
| src/stores/user.ts | 当前用户信息与登录状态 | isLoggedIn、currentUser（id/name/college/grade/avatar/bio） | updateProfile、login、logout；getter：displayName、userDescription |
| src/stores/favorite.ts | 跨页面收藏状态 | favorites（收藏项数组） | isFavorite、addFavorite、removeFavorite、toggleFavorite；getter：favoriteCount |

两个 Store 均使用 Option Store 风格，userStore 初始为模拟登录状态，favoriteStore 初始为空，收藏仅存内存，刷新清空（Day5 可接受）。

## 3. 状态边界说明

**放入 Store 的数据**：当前用户信息和登录状态放入 userStore，因为导航栏、发布页、用户中心三处都需要；收藏列表放入 favoriteStore，因为四个列表页和个人中心都需要读写。

**不放入 Store 的数据**：发布表单的 form/errors/submitting 只属于发布页，留在组件内；各列表页的 loading/列表数据是页面级缓存，不共享；"我的发布"聚合结果通过 computed 在组件内计算，是派生状态；消息中心静态消息无跨页需求，不放入 Store。

## 4. 页面使用记录

- AppHeader.vue：显示 userStore.displayName；
- PublishView.vue：publisher 字段使用 userStore.displayName；
- TradeView/LostFoundView/GroupBuyView/ErrandView.vue：使用 favoriteStore 实现收藏/取消收藏按钮；
- UserCenterView.vue：同时使用两个 Store，展示用户资料、我的收藏列表、我的发布列表（按 publisher 筛选）。

## 5. AI 协作记录

使用 TRAE IDE 内置 AI 助手，按 Task 1~9 提示词逐步生成代码。AI 生成了 Store 基础结构、各页面模板和样式。不合理之处：收藏按钮未用 margin-left:auto 靠右；未提示 id 需要 Number() 转换（API 返回 string）；lostFound 接口缺少 publisher 字段；"我的发布"只给了空提示；form.reward === '' 存在类型比较错误；缺少 hover 效果。

## 6. 人工调整内容

拆分 user.ts 和 favorite.ts 两个独立 Store；为按钮添加 margin-left:auto 靠右和 hover 效果；所有 id 做 Number() 转换；lostFound.ts 补充 publisher 字段；完整实现"我的发布"（并发请求+computed 筛选+统一结构+状态标签）；删除 form.reward === '' 无效比较；消息中心添加三类彩色图标消息；不引入 JWT/路由守卫，保持模拟登录简单实现。

## 7. 测试记录

启动 mock（3001）和 dev（5173）服务器后：在二手交易页点击两个商品的收藏按钮，按钮变为"已收藏"；进入个人中心，头像显示"校"字，"我的收藏"显示数量(2)和两张卡片；点击取消收藏一张卡片，数量变为(1)；切回二手交易页，对应按钮自动变回"收藏"，状态跨页面同步正常；发布一条二手信息，发布人显示"校园用户"，回到个人中心"我的发布"出现该记录，状态标签为绿色"进行中"。

## 8. 遇到的问题与解决方法

**id 类型不匹配**：json-server 返回 string 类型 id，但 FavoriteItem 定义为 number，=== 严格判断导致收藏状态无法正确切换。解决方法：模板中统一使用 Number(item.id) 转换。

**收藏按钮位置不对**：AI 只给了 margin-left:12px，按钮没有靠右。解决方法：改为 margin-left:auto，利用 flex 布局自动推到右侧。

**lostFound 缺少 publisher 字段**：类型定义遗漏导致 TS 报错。解决方法：补充 publisher: string 字段。

## 9. 今日反思

Pinia 状态管理对多页面前端应用至关重要。在没有 Pinia 时，跨页面共享用户名或收藏状态需要 props 逐层传递或事件总线，维护成本高且容易出错。Pinia 提供了集中式、响应式、可预测的状态容器，任何组件调用 useXxxStore() 就能拿到同一份状态，修改一处全局自动更新。今天通过实现用户 Store 和收藏 Store，我体会到"单一数据源"的价值：列表页收藏、个人中心立刻可见，这就是状态管理的核心意义。同时也认识到状态边界的重要性，不是所有数据都该放 Store，页面私有状态应留给组件，保持 Store 精简聚焦。用户中心作为两个 Store 的消费者，集中体现了 Pinia 状态管理在连接多页面、多组件时的价值。
