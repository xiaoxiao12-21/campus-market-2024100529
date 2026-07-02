import http from './http'

export interface GroupBuyItem {
  id?: string
  title: string
  type: string
  targetCount: number
  currentCount: number
  deadline: string
  location: string
  publisher: string
  image: string
  status: string
  description: string
}

export function getGroupBuys() {
  return http.get<GroupBuyItem[]>('/groupBuys')
}

export function getGroupBuyById(id: string) {
  return http.get<GroupBuyItem>(`/groupBuys/${id}`)
}

export function createGroupBuy(data: GroupBuyItem) {
  return http.post<GroupBuyItem>('/groupBuys', data)
}
