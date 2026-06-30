# Day4 Evidence - 发布表单与数据新增

## 1. 今日完成内容

今天完成了校园轻集市的信息发布功能，实现了从用户填写表单到数据持久化的完整闭环：

1. 为四个业务 API 文件补充了 `createXxx` POST 方法
2. 创建了通用表单项组件 `FormField.vue`，统一 label、必填标记和错误提示
3. 完成 `PublishView.vue` 发布页面，根据发布类型动态显示专属字段
4. 使用 `reactive` 设计了覆盖四类业务的统一 form 对象
5. 实现了表单校验、数据提交、路由跳转和表单重置逻辑
6. 添加了页面样式，并通过浏览器完成四类业务的端到端测试

## 2. 发布类型与字段设计

| 发布类型 | 对应数据集合 | 关键字段 | 设计理由 |
|---|---|---|---|
| 二手交易 | trades | title、category、price、condition、location、description | 价格和成色是买家最关心的交易条件 |
| 失物招领 | lostFounds | title、type(lost/found)、itemName、location、eventTime、description | 需区分寻物/招领方向，物品名称和时间是关键信息 |
| 拼单搭子 | groupBuys | title、type、targetCount、deadline、location、description | 拼单核心是凑够人数，需目标人数和截止期限 |
| 跑腿委托 | errands | title、taskType、reward、from、to、deadline、description | 跑腿本质是A点到B点，需报酬驱动接单 |

四类业务共用 title、location、description 三个通用字段，专属字段通过 `v-if` 条件渲染，既减少重复代码又保证表单结构清晰。控件选择上：短文本用 input:text，长文本用 textarea，数值用 input:number 配合 `v-model.number`，枚举用 select，时间用 datetime-local 并在提交时统一格式化为 `YYYY-MM-DD HH:mm`。

## 3. 表单校验规则

通用必填校验：标题、地点、描述不能为空。

类型专属校验：
- 二手交易：分类不能为空；价格必须大于 0；成色必须选择
- 失物招领：物品名称不能为空；发生时间必须选择
- 拼单搭子：拼单类型不能为空；目标人数不少于 2 人；截止时间必须选择
- 跑腿委托：任务类型不能为空；酬劳不能为空且不能为负数；取件/送达地点不能为空；截止时间必须选择

校验失败时错误信息通过 FormField 组件以红色文字显示在对应字段下方，每次提交前通过 `clearErrors()` 清空旧提示。

## 4. AI 协作记录

使用 TRAE IDE 内置 AI 助手，按 Task 1~10 逐步提示（如"补充新增数据 API 方法""实现基础表单校验""测试发布流程"等）。AI 生成了 API 层 POST 方法、FormField 组件结构、PublishView 模板框架、reactive 数据对象、校验函数框架、提交/重置逻辑和 CSS 样式，大大提高了开发效率。

AI 生成内容存在以下不合理之处，需要人工修正：
1. 使用 `window.alert()` 做成功提示，在自动化环境中会阻塞页面
2. 酬劳校验只判断 `< 0`，空字符串绕过校验（`v-model.number` 空输入返回 `''`）
3. 直接提交 datetime-local 返回的 `T` 分隔时间，与种子数据格式不一致
4. 将 id 字段类型声明为 `number`，但 json-server 实际返回字符串 id
5. 切换发布类型时未重置表单，导致其他类型字段数据残留
6. BoardView、DetailView、ListView 未注册路由，ListView 引用不存在的 'Detail' 路由名

## 5. 人工调整内容

在 AI 生成基础上做了以下调整：
- 将 `window.alert()` 替换为 `console.log()`，避免阻塞（后续可换 Toast 组件）
- 酬劳校验改为 `form.reward === '' || Number.isNaN(form.reward) || form.reward < 0`，覆盖空值和 NaN
- 新增 `formatDateTime()` 函数统一时间格式，提交时对 price/targetCount/reward 做 `Number()` 安全转换
- 将四个 API 文件的 `id?: number` 改为 `id?: string`
- 添加 `onTypeChange` 在切换类型时调用 `resetForm()` 清空数据
- 在 router 中补充 BoardView、ListView、DetailView 三个路由，修复导航失败
- 清理 db.json 中因 PowerShell 编码问题产生的 `????` 乱码记录，重启 Mock 服务
- 清除 `.vite` 缓存并重启开发服务器，解决 `@element-plus/icons-vue` 的 ERR_ABORTED 错误

## 6. 测试记录

测试环境：`npm run mock`（3001端口）+ `npm run dev`（5173端口）。

以二手交易为例的真实测试流程：
1. 访问 `/publish`，默认显示二手交易表单
2. 填写标题"浏览器测试-二手无线鼠标"、分类"数码配件"、价格 30、成色"九成新"、地点"东区宿舍"、描述"罗技M185无线鼠标，使用半年功能正常"
3. 点击"发布"按钮
4. 页面自动跳转到 `/trade`，导航栏"二手交易"高亮
5. 列表中出现新增卡片"浏览器测试-二手无线鼠标"，描述正确显示
6. 通过 API 确认 trades 集合新增记录，db.json 中可看到自动生成的字符串 id

失物招领、拼单搭子、跑腿委托三类业务均按相同流程测试通过。校验测试也符合预期：不填字段直接提交会显示红色错误提示，有效阻止了无效数据提交。

## 7. 遇到的问题与解决方法

**问题：PowerShell 中文编码导致乱码数据**。通过 `Invoke-RestMethod` 发送 POST 请求测试 API 时，由于终端编码不是 UTF-8，中文被写入 db.json 时变成了 `????`，在页面中显示为一串问号。解决方法是在执行命令前设置 `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8`，并在 ContentType 中指定 `charset=utf-8`；已写入的乱码数据手动删除后重启 json-server。

另外还遇到了切换类型数据残留（添加 onTypeChange 重置）、alert 阻塞测试（改为 console.log）、datetime-local 无法程序化输入（通过 evaluate 执行原生 DOM 赋值）等问题，均已解决。

## 8. 今日反思

发布表单、表单校验和数据新增是连接用户输入与数据存储的关键桥梁。发布表单是用户交互入口，需要根据业务场景动态展示字段，既不收集无用信息也不遗漏关键数据；表单校验是数据质量的守门人，不仅要处理正常输入，还要考虑空值、NaN、类型转换等边界情况，比如 `v-model.number` 空输入返回空字符串而非 0 就是容易忽略的细节；数据新增则完成了从界面到数据库的闭环，点击发布后看到数据出现在列表和 db.json 中，才有功能真正落地的感觉。通过这次实践我认识到，一个看似简单的表单背后涉及状态管理、异步请求、路由跳转、错误处理等多个环节，AI 能快速生成骨架代码，但开发者对边界情况的判断力才是代码质量的保证。
