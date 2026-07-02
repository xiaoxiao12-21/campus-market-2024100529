<template>
  <section class="page">
    <div class="page-header">
      <h1>发布信息</h1>
      <p>选择发布类型，填写必要信息，让校园需求更快被看见。</p>
    </div>

    <form class="publish-form" @submit.prevent="handleSubmit">
      <FormField label="发布类型" required>
        <select v-model="publishType" @change="onTypeChange">
          <option value="trade">二手交易</option>
          <option value="lostFound">失物招领</option>
          <option value="groupBuy">拼单搭子</option>
          <option value="errand">跑腿委托</option>
        </select>
      </FormField>

      <FormField label="标题" required :error="errors.title">
        <input v-model.trim="form.title" type="text" placeholder="例如：出九成新iPad、求购高数教材" />
      </FormField>

      <FormField label="地点" required :error="errors.location">
        <input v-model.trim="form.location" type="text" placeholder="例如：一食堂、图书馆、3号宿舍楼" />
      </FormField>

      <FormField label="描述" required :error="errors.description">
        <textarea v-model.trim="form.description" rows="5" placeholder="请详细描述物品情况、交易方式或其他补充信息"></textarea>
      </FormField>

      <!-- 二手交易专属字段 -->
      <template v-if="publishType === 'trade'">
        <FormField label="商品分类" required :error="errors.category">
          <input v-model.trim="form.category" type="text" placeholder="例如：数码配件、教材资料、生活用品、服饰鞋包" />
        </FormField>

        <FormField label="价格" required :error="errors.price">
          <input v-model.number="form.price" type="number" min="0" placeholder="请输入价格（单位：元）" />
        </FormField>

        <FormField label="成色" required :error="errors.condition">
          <select v-model="form.condition">
            <option value="">请选择成色</option>
            <option value="全新">全新</option>
            <option value="九成新">九成新</option>
            <option value="八成新">八成新</option>
            <option value="正常使用痕迹">正常使用痕迹</option>
          </select>
        </FormField>
      </template>

      <!-- 失物招领专属字段 -->
      <template v-if="publishType === 'lostFound'">
        <FormField label="信息类型" required>
          <select v-model="form.lostFoundType">
            <option value="lost">寻物启事</option>
            <option value="found">失物招领</option>
          </select>
        </FormField>

        <FormField label="物品名称" required :error="errors.itemName">
          <input v-model.trim="form.itemName" type="text" placeholder="例如：黑色钱包、蓝色雨伞、校园卡" />
        </FormField>

        <FormField label="发生时间" required :error="errors.eventTime">
          <input v-model="form.eventTime" type="datetime-local" />
        </FormField>

        <FormField label="联系方式" required>
          <input v-model.trim="form.contact" type="text" placeholder="例如：微信/QQ/手机号，方便他人联系你" />
        </FormField>
      </template>

      <!-- 拼单搭子专属字段 -->
      <template v-if="publishType === 'groupBuy'">
        <FormField label="拼单类型" required :error="errors.groupType">
          <input v-model.trim="form.groupType" type="text" placeholder="例如：拼餐、奶茶拼单、资料团购、运动搭子" />
        </FormField>

        <FormField label="目标人数" required :error="errors.targetCount">
          <input v-model.number="form.targetCount" type="number" min="2" placeholder="需要凑齐多少人（至少2人）" />
        </FormField>

        <FormField label="截止时间" required :error="errors.deadline">
          <input v-model="form.deadline" type="datetime-local" />
        </FormField>
      </template>

      <!-- 跑腿委托专属字段 -->
      <template v-if="publishType === 'errand'">
        <FormField label="任务类型" required :error="errors.taskType">
          <input v-model.trim="form.taskType" type="text" placeholder="例如：取快递、代买奶茶、代送文件、代取外卖" />
        </FormField>

        <FormField label="酬劳" required :error="errors.reward">
          <input v-model.number="form.reward" type="number" min="0" placeholder="愿意支付的酬劳金额（单位：元）" />
        </FormField>

        <FormField label="取件地点" required :error="errors.from">
          <input v-model.trim="form.from" type="text" placeholder="例如：菜鸟驿站、超市、教学楼" />
        </FormField>

        <FormField label="送达地点" required :error="errors.to">
          <input v-model.trim="form.to" type="text" placeholder="例如：5号宿舍楼、图书馆门口" />
        </FormField>

        <FormField label="截止时间" required :error="errors.deadline">
          <input v-model="form.deadline" type="datetime-local" />
        </FormField>
      </template>

      <div class="form-tip">
        <span class="required-mark">*</span> 为必填项，请确保信息填写完整后提交
      </div>

      <div class="actions">
        <button type="button" class="secondary" @click="handleReset" :disabled="submitting">重置</button>
        <button type="submit" class="primary" :disabled="submitting">
          {{ submitting ? '提交中...' : '发布信息' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import FormField from '../components/FormField.vue'
import { createTrade } from '../api/trade'
import { createLostFound } from '../api/lostFound'
import { createGroupBuy } from '../api/groupBuy'
import { createErrand } from '../api/errand'
import { useUserStore } from '../stores/user'
import { useToastStore } from '../stores/toast'

type PublishType = 'trade' | 'lostFound' | 'groupBuy' | 'errand'

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()
const publishType = ref<PublishType>('trade')
const submitting = ref(false)

const getInitialForm = () => ({
  title: '',
  location: '',
  description: '',
  category: '',
  price: 0,
  condition: '',
  lostFoundType: 'lost' as 'lost' | 'found',
  itemName: '',
  eventTime: '',
  contact: '站内消息联系',
  groupType: '',
  targetCount: 2,
  deadline: '',
  taskType: '',
  reward: 0,
  from: '',
  to: '',
})

const form = reactive(getInitialForm())

const errors = reactive<Record<string, string>>({})

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

function onTypeChange() {
  // 切换类型时清空表单，避免残留其他类型的字段数据
  Object.assign(form, getInitialForm())
  clearErrors()
}

function validateForm() {
  clearErrors()

  if (!form.title) {
    errors.title = '请输入标题'
  }

  if (!form.location) {
    errors.location = '请输入地点'
  }

  if (!form.description) {
    errors.description = '请输入描述'
  }

  if (publishType.value === 'trade') {
    if (!form.category) {
      errors.category = '请输入商品分类'
    }
    if (form.price <= 0 || Number.isNaN(form.price)) {
      errors.price = '价格应大于 0'
    }
    if (!form.condition) {
      errors.condition = '请选择商品成色'
    }
  }

  if (publishType.value === 'lostFound') {
    if (!form.itemName) {
      errors.itemName = '请输入物品名称'
    }
    if (!form.eventTime) {
      errors.eventTime = '请选择发生时间'
    }
  }

  if (publishType.value === 'groupBuy') {
    if (!form.groupType) {
      errors.groupType = '请输入拼单类型'
    }
    if (form.targetCount < 2 || Number.isNaN(form.targetCount)) {
      errors.targetCount = '目标人数不能少于 2 人'
    }
    if (!form.deadline) {
      errors.deadline = '请选择截止时间'
    }
  }

  if (publishType.value === 'errand') {
    if (!form.taskType) {
      errors.taskType = '请输入任务类型'
    }
    if (Number.isNaN(form.reward) || form.reward < 0) {
      errors.reward = '酬劳不能为负数'
    }
    if (!form.from) {
      errors.from = '请输入取件地点'
    }
    if (!form.to) {
      errors.to = '请输入送达地点'
    }
    if (!form.deadline) {
      errors.deadline = '请选择截止时间'
    }
  }

  return Object.values(errors).every((message) => !message)
}

function getCurrentTime() {
  const now = new Date()
  return now.toISOString().slice(0, 16).replace('T', ' ')
}

function formatDateTime(value: string) {
  if (!value) return ''
  return value.replace('T', ' ')
}

async function handleSubmit() {
  if (!userStore.isLoggedIn || !userStore.currentUser) {
    toastStore.error('请先登录后再发布信息')
    router.push('/login')
    return
  }

  if (!validateForm()) {
    toastStore.error('请检查表单填写是否完整，红色标注的为必填项。')
    return
  }

  submitting.value = true

  try {
    if (publishType.value === 'trade') {
      await createTrade({
        title: form.title,
        category: form.category,
        price: Number(form.price) || 0,
        condition: form.condition,
        location: form.location,
        publisher: userStore.displayName,
        publishTime: getCurrentTime(),
        image: '/images/trade-daily.jpg',
        status: 'open',
        description: form.description,
      })

      toastStore.success('二手商品发布成功！即将跳转到二手交易列表页。')
      router.push('/trade')
    }

    if (publishType.value === 'lostFound') {
      await createLostFound({
        title: form.title,
        type: form.lostFoundType as 'lost' | 'found',
        itemName: form.itemName,
        location: form.location,
        eventTime: formatDateTime(form.eventTime),
        contact: form.contact || '站内消息联系',
        publisher: userStore.displayName,
        image: form.lostFoundType === 'lost' ? '/images/lost-keys.jpg' : '/images/lost-card.jpg',
        status: 'open',
        description: form.description,
      })

      toastStore.success('失物招领信息发布成功！即将跳转到失物招领列表页。')
      router.push('/lost-found')
    }

    if (publishType.value === 'groupBuy') {
      const groupImageMap: Record<string, string> = {
        '拼餐': '/images/group-food.jpg',
        '学习资料': '/images/group-study.jpg',
        '生活用品': '/images/trade-daily.jpg',
        '活动': '/images/group-study.jpg',
      }
      await createGroupBuy({
        title: form.title,
        type: form.groupType,
        targetCount: Number(form.targetCount) || 2,
        currentCount: 1,
        deadline: formatDateTime(form.deadline),
        location: form.location,
        publisher: userStore.displayName,
        image: groupImageMap[form.groupType] || '/images/group-food.jpg',
        status: 'open',
        description: form.description,
      })

      toastStore.success('拼单搭子信息发布成功！即将跳转到拼单搭子列表页。')
      router.push('/group-buy')
    }

    if (publishType.value === 'errand') {
      const errandImageMap: Record<string, string> = {
        '取快递': '/images/errand-delivery.jpg',
        '代买': '/images/group-food.jpg',
        '打印': '/images/errand-print.jpg',
        '其他': '/images/errand-delivery.jpg',
      }
      await createErrand({
        title: form.title,
        taskType: form.taskType,
        reward: Number(form.reward) || 0,
        from: form.from,
        to: form.to,
        deadline: formatDateTime(form.deadline),
        publisher: userStore.displayName,
        image: errandImageMap[form.taskType] || '/images/errand-delivery.jpg',
        status: 'open',
        description: form.description,
      })

      toastStore.success('跑腿委托发布成功！即将跳转到跑腿委托列表页。')
      router.push('/errand')
    }
  } catch (error) {
    console.error(error)
    toastStore.error('发布失败，请确认 JSON Server 已启动，并检查表单数据是否完整。')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  Object.assign(form, getInitialForm())
  clearErrors()
}

function handleReset() {
  resetForm()
  publishType.value = 'trade'
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.page-header h1 {
  margin: 0 0 8px;
}

.page-header p {
  margin: 0;
  color: #6b7280;
}

.publish-form {
  display: grid;
  gap: 18px;
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

input,
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #2563eb;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.form-tip {
  font-size: 13px;
  color: #6b7280;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.required-mark {
  color: #ef4444;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}

button {
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

.primary {
  background: #2563eb;
  color: #fff;
}

.primary:not(:disabled):hover {
  background: #1d4ed8;
}

.secondary {
  background: #f3f4f6;
  color: #374151;
}

.secondary:not(:disabled):hover {
  background: #e5e7eb;
}
</style>
