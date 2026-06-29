import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
})

// 响应拦截器 - 统一处理错误
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('[API] 网络请求失败，请检查 Mock 服务器是否启动（端口 3001）')
    } else if (error.code === 'ECONNABORTED') {
      console.error('[API] 请求超时')
    } else if (error.response) {
      console.error(`[API] 请求失败：${error.response.status} ${error.response.statusText}`)
    } else {
      console.error('[API] 请求异常：', error.message)
    }
    return Promise.reject(error)
  },
)

export default http
