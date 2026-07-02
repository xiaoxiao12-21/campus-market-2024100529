import http from './http'

export interface ErrandItem {
  id?: string
  title: string
  taskType: string
  reward: number
  from: string
  to: string
  deadline: string
  publisher: string
  image: string
  status: string
  description: string
}

export function getErrands() {
  return http.get<ErrandItem[]>('/errands')
}

export function getErrandById(id: string) {
  return http.get<ErrandItem>(`/errands/${id}`)
}

export function createErrand(data: ErrandItem) {
  return http.post<ErrandItem>('/errands', data)
}
