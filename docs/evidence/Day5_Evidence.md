# Day5 Evidence - 状态管理与用户中心

## 1. 今日完成内容

今天完成了校园轻集市的 Pinia 状态管理集成和用户中心页面建设，实现了跨组件状态共享，具体工作包括：

1. 确认 Pinia 已在 main.ts 中正确挂载，无需重复安装；
2. 创建用户状态 Store（`src/stores/user.ts`），管理模拟登录状态和用户个人信息；
3. 创建收藏状态 Store（`src/stores/favorite.ts`），实现跨页面收藏功能，支持添加、取消、切换和判断是否收藏；
4. 在 AppHeader 导航栏右侧展示当前用户名称，验证状态从 Store 到组件的响应式绑定；
5. 修改 PublishView 发布页面，将固定的"当前用户"改为从 userStore 读取 `displayName`，同时补充了失物招领 API 缺失的 publisher 字段；
6. 在四个业务列表页（二手交易、失物招领、拼单搭子、跑腿委托）的卡片 footer 中添加收藏按钮，点击可切换收藏状态；
7. 完善 UserCenterView 用户中心页面，包含用户资料卡片、我的收藏列表、我的发布列表三大模块；
8. "我的发布"模块通过并发请求四类业务接口，在前端按 publisher 字段筛选当前用户发布的数据，统一映射后展示；
9. 补充 MessageView 消息中心基础静态展示，包含系统通知、功能提示、收藏小贴士三类消息；
10. 修复了 PublishView 中原有的类型校验错误，通过 `npm run type-check` 和 `npm run build` 验证。

## 2. Store 设计说明

| Store 文件 | 管理内容 | 主要状态 | 主要方法 |
|---|---|---|---|
| src/stores/user.ts | 当前用户信息与登录状态 | isLoggedIn（登录状态布尔值）、currentUser（用户对象：id/name/college/grade/avatar/bio） | updateProfile（更新个人资料）、login（登录）、logout（登出）；getter：displayName（显示名称）、userDescription（学院·年级描述） |
| src/stores/favorite.ts | 跨页面收藏状态 | favorites（收藏项数组，每项含 id/type/title/description/location） | isFavorite（判断是否已收藏）、addFavorite（添加收藏，自动去重）、removeFavorite（取消收藏）、toggleFavorite（切换收藏状态）；getter：favoriteCount（收藏数量） |

两个 Store 均使用 Option Store 风格（state/getters/actions），与 Vue 3 Composition API 自然配合。userStore 初始化为模拟登录状态（isLoggedIn: true），预设了一个"校园用户"的默认资料，符合 Day5 阶段不接入真实登录接口的要求。favoriteStore 初始为空数组，所有收藏操作都在前端内存中完成，不持久化，刷新页面后会清空，这是本日可接受的简化实现。

## 3. 状态边界说明

在决定哪些数据放入 Pinia Store 时，遵循"跨页面/跨组件共享才放入 Store，页面私有状态保留在组件内"的原则：

**放入 Store 的数据：**
- 当前用户信息（currentUser）和登录状态（isLoggedIn）放入 userStore，因为导航栏（AppHeader）、发布页（PublishView）和用户中心（UserCenterView）三个不同位置都需要读取用户名称，使用 Store 避免了 props 层层传递；
- 收藏列表（favorites）放入 favoriteStore，因为四个业务列表页都有收藏按钮，用户中心需要展示收藏列表，属于典型的跨页面共享状态；
- 收藏数量通过 getter favoriteCount 暴露，方便后续在导航栏或个人中心显示徽标。

**没有放入 Store 的数据：**
- 发布表单（PublishView 中的 form 对象、errors 错误对象、submitting 提交状态）没有放入 Store，因为这些状态只属于发布页面本身，离开页面后无需保留，放在组件的 reactive/ref 中更合适；
- 各列表页的 loading、errorMsg、列表数据（如 trades、lostFounds）没有放入 Store，因为这些数据是页面级别的请求缓存，每个页面独立请求和管理即可，不需要全局共享；
- 用户中心"我的发布"聚合结果没有放入 Store，而是通过 computed 在组件内计算，因为它依赖四个 API 的返回值，属于派生状态，直接在使用处计算更清晰；
- 消息中心的静态消息没有放入 Store，因为目前只是展示用的静态数据，没有跨页面交互需求，后续接入真实消息推送时再考虑放入 Store。

这种边界划分保证了 Store 不会过于臃肿，只存放真正需要全局共享的状态，页面私有状态留在组件内部，符合状态管理的最佳实践。

## 4. 页面使用记录

Pinia Store 在以下页面和组件中被使用：

- **AppHeader.vue**：引入 useUserStore，在导航栏右侧的 `.user-mini` 区域显示 `userStore.displayName`（即"校园用户"）；
- **PublishView.vue**：同时引入 useUserStore 和四个业务 API，提交发布数据时将 publisher 字段从固定的 `'当前用户'` 改为 `userStore.displayName`，确保发布人信息与当前登录用户一致；
- **TradeView.vue**：引入 useFavoriteStore，在每个二手商品卡片的 footer 添加收藏按钮，点击调用 `toggleFavorite()`，按钮文字根据 `isFavorite('trade', id)` 动态显示"收藏"或"已收藏"；
- **LostFoundView.vue**：引入 useFavoriteStore，为失物招领卡片添加收藏按钮，类型标记为 `'lostFound'`；
- **GroupBuyView.vue**：引入 useFavoriteStore，为拼单搭子卡片添加收藏按钮，类型标记为 `'groupBuy'`；
- **ErrandView.vue**：引入 useFavoriteStore，为跑腿委托卡片添加收藏按钮，类型标记为 `'errand'`，地点字段特殊处理为 `${from} → ${to}`；
- **UserCenterView.vue**：同时引入 useUserStore 和 useFavoriteStore，用户资料卡片展示头像（取用户名首字）、名称、学院年级、个人简介；"我的收藏"区域遍历 favoriteStore.favorites 展示收藏列表，支持取消收藏；"我的发布"区域通过 Promise.all 并发请求四类数据，用 computed 按 publisher 筛选当前用户的发布并统一展示。

## 5. AI 协作记录

- **使用的 AI 工具**：TRAE IDE 内置 AI 助手（即本次开发使用的 AI 编程助手）。
- **核心提示词**：按照 Task 1~9 的任务描述依次提示，包括"确认 Pinia 已挂载""创建用户状态 Store""在导航栏中显示用户信息""在发布页面中使用当前用户""创建收藏状态 Store""在列表页面中添加收藏操作""完善个人中心页面""实现我的发布基础思路""补充消息中心基础状态"等。
- **AI 生成的内容**：AI 生成了两个 Store 的基础结构（state/getters/actions 完整代码）、AppHeader 中引入 Store 并显示用户名的模板代码、PublishView 中替换 publisher 的示例代码、四个列表页添加收藏按钮的模板和样式、UserCenterView 的用户资料+我的收藏+我的发布三段式结构代码、MessageView 的静态消息卡片代码。
- **AI 生成内容中的不合理之处**：
  1. 收藏按钮的样式只设置了 margin-left: 12px，没有用 `margin-left: auto` 将按钮推到卡片右侧，导致按钮紧跟在价格/成色文字后面，布局不美观；
  2. API 返回的 item.id 是 string 类型（json-server 自动生成字符串 id），但 FavoriteItem 接口中 id 定义为 number，直接使用会产生类型不匹配，AI 没有提示需要 Number() 转换；
  3. 失物招领的 API 接口（lostFound.ts）中的 LostFoundItem 类型缺少 publisher 字段，而 AI 在示例代码中给失物招领发布也传了 publisher，会导致 TypeScript 类型错误；
  4. "我的发布"模块最初只提供了一个空的提示段落，没有给出数据请求和筛选的完整实现，需要手动补充；
  5. PublishView 中酬劳校验的 `form.reward === ''` 比较存在类型错误，因为 form.reward 通过 v-model.number 绑定后是 number 类型，与空字符串比较没有意义，会触发 TS2367 错误；
  6. AI 提供的 .favorite-btn 样式没有考虑 hover 交互效果，用户体验不够好。

## 6. 人工调整内容

在 AI 生成的基础上，做了以下关键修改和补充：

- **Store 拆分与命名**：按照任务要求拆分为独立的 user.ts 和 favorite.ts 两个 Store 文件，没有将所有状态混在一个 store.ts 中，保持职责单一；
- **样式修正**：为所有收藏按钮和取消收藏按钮统一添加 `margin-left: auto`，使按钮自动靠右对齐，并补充了 `:hover` 状态的背景色变化，提升交互体验；
- **类型安全修正**：在所有收藏操作中对 item.id 做 `Number(item.id)` 转换，解决 string 与 number 类型不匹配的问题；
- **API 类型补全**：在 lostFound.ts 的 LostFoundItem 接口中补充 `publisher: string` 字段，与 trades、groupBuys、errands 三个接口保持一致；
- **完整实现"我的发布"**：没有仅停留在结构展示，而是补充了完整的数据聚合逻辑——使用 Promise.all 并发请求四个 API，定义统一的 MyPublishItem 接口，通过 computed 按 publisher 字段筛选当前用户发布的内容，处理跑腿委托地点的特殊格式（from → to），添加状态标签（进行中/已结束的颜色区分）和数量徽标；
- **修复类型错误**：删除了 PublishView 中 `form.reward === ''` 这一无意义的类型比较，保留 `Number.isNaN(form.reward) || form.reward < 0` 作为有效校验；
- **丰富消息中心**：没有只放两条简单消息，而是设计了三条分类消息（系统通知、功能提示、收藏小贴士），使用不同颜色的圆形图标背景（蓝/黄/粉）区分类型，添加了时间戳显示；
- **删除不必要的复杂逻辑**：没有引入 JWT、token、路由守卫等真实登录鉴权逻辑，保持 Day5 阶段模拟登录的简单实现，避免过度设计。

## 7. 测试记录

测试环境：启动 Mock 服务器（json-server，端口 3001）和前端开发服务器（Vite，端口 5173）。

真实测试流程（收藏功能端到端测试）：
1. 打开浏览器访问 http://localhost:5173/，页面顶部导航栏右侧显示"校园用户"，确认 userStore 正常工作；
2. 点击导航栏"二手交易"，进入二手交易列表页，每个卡片右下角有灰色圆角"收藏"按钮；
3. 点击第一个商品卡片的"收藏"按钮，按钮文字立即从"收藏"变为"已收藏"，响应式更新正常；
4. 再点击第二个商品卡片的"收藏"按钮，第二个卡片也变为"已收藏"状态；
5. 点击导航栏"我的"进入用户中心页面：
   - 顶部用户资料卡片显示蓝色圆形头像"校"字，右侧显示"校园用户""计算机学院 · 2023 级""热爱校园生活，喜欢分享闲置好物。"，信息与 userStore 中默认数据一致；
   - "我的收藏"模块标题旁显示数量徽标"(2)"，下方列出刚才收藏的两个二手商品卡片，标签显示"二手交易"，右下角有"取消收藏"按钮；
6. 点击第二个收藏卡片的"取消收藏"按钮，该卡片立即从列表中消失，收藏数量徽标更新为"(1)"；
7. 切换回"二手交易"列表页，第二个商品的按钮已自动变回"收藏"状态，第一个商品仍显示"已收藏"，证明 Pinia 状态在两个页面间实时同步；
8. 点击"发布"进入发布页，填写一条二手交易信息（标题"测试书籍"、分类"教材资料"、价格 15、成色"九成新"、地点"图书馆"、描述"计算机教材一本"），点击"发布"按钮，页面跳转到二手交易列表，新发布的卡片出现在列表中，发布人显示为"校园用户"；
9. 再次进入"我的"页面，"我的发布"模块出现刚才发布的"测试书籍"卡片，状态标签显示绿色"进行中"，证明发布人从 userStore 正确读取。

整个测试流程流畅，收藏状态跨页面同步正常，发布人自动填充正确，TypeScript 类型检查无错误，生产构建成功。

## 8. 遇到的问题与解决方法

**问题一：id 类型不匹配导致收藏判断失效。**
json-server 返回的数据中 id 是字符串类型（如 `"1"`、`"2"`），但 FavoriteItem 接口中 id 定义为 number，模板中直接传入 `item.id` 给 `isFavorite()` 和 `toggleFavorite()` 时，TypeScript 虽然没有立刻报错（因为模板中类型检查较宽松），但 `isFavorite` 中的 `===` 严格相等判断会因为类型不同（string vs number）永远返回 false，导致收藏按钮点击后状态无法正确切换，"已收藏"状态无法回显。解决方法：在模板中调用收藏方法时统一使用 `Number(item.id)` 将字符串 id 转换为数字，确保类型一致，修复后收藏状态判断和切换恢复正常。

**问题二：收藏按钮没有靠右对齐。**
AI 最初给出的 .favorite-btn 样式只设置了 `margin-left: 12px`，导致按钮紧跟在价格/成色文字后面，在卡片 footer 的 flex 布局中没有被推到最右侧，视觉上不平衡。解决方法：将 margin-left 改为 `auto`，利用 flex 布局中 `margin-left: auto` 的特性将按钮自动推到容器最右侧，同时给"取消收藏"和状态标签也添加相同的 `margin-left: auto` 保持风格一致，调整后布局整齐美观。

**问题三：失物招领发布时缺少 publisher 字段导致类型错误。**
在将发布人改为 userStore.displayName 时，发现失物招领的 createLostFound 调用传入了 publisher 参数，但 LostFoundItem 接口中并没有定义该字段，触发 TypeScript 编译错误。检查发现其他三个 API（trade、groupBuy、errand）都有 publisher 字段，唯独 lostFound.ts 中遗漏了。解决方法：在 LostFoundItem 接口中补充 `publisher: string` 字段定义，与其他三类接口保持一致，类型错误消除，发布时数据能正确写入 db.json。

**问题四：刷新页面后收藏数据丢失。**
这是因为收藏状态目前只保存在 Pinia 的内存状态中，页面刷新时整个应用重新初始化，Store 会恢复到初始空数组状态，这是 Day5 阶段已知的、可接受的现象，并非 bug。如果需要持久化，后续可以结合 localStorage（在 Store 的 action 中同步读写 localStorage）或后端接口实现，本日不做处理。

## 9. 今日反思

Pinia 状态管理对多页面前端应用的作用是基础性的。在没有 Pinia 之前，如果要在导航栏显示用户名、在发布页使用用户信息、在个人中心展示用户资料，要么通过 props 层层传递（当组件层级深时非常繁琐且维护困难），要么使用模块级变量（无法响应式更新），要么依赖事件总线（容易造成数据流混乱）。Pinia 提供了一个集中式的、响应式的、可预测的状态容器，让跨组件、跨页面的状态共享变得简单而清晰——任何组件只要调用对应的 useXxxStore() 就能拿到同一份状态，修改一处所有使用处自动更新。

今天通过实现用户 Store 和收藏 Store，我真切感受到了"单一数据源"的好处：在二手交易页点击收藏，切换到个人中心立刻能看到；在发布页发布的内容，个人中心"我的发布"自动出现；导航栏的用户名不需要每个页面单独维护。用户中心是状态管理价值的集中体现——它同时消费两个 Store 的数据，还聚合了多个 API 的结果，是连接状态、视图和数据的枢纽。当然，状态管理也需要合理划分边界，不能什么数据都往 Store 里塞，页面私有的状态应该留给组件自己管理，保持 Store 的精简和聚焦。Day5 的实践让我从"会写 Pinia 语法"进阶到"理解何时该用 Pinia、如何设计 Store 的边界"，这对后续构建更复杂的前端应用至关重要。
