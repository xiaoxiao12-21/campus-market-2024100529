import http from './http'

export interface LostFoundItem {
  id?: string
  title: string
  type: 'lost' | 'found'
  itemName: string
  location: string
  eventTime: string
  contact: string
  publisher: string
  image: string
  status: string
  description: string
}

export function getLostFounds() {
  return http.get<LostFoundItem[]>('/lostFounds')
}

export function getLostFoundById(id: string) {
  return http.get<LostFoundItem>(`/lostFounds/${id}`)
}

export function createLostFound(data: LostFoundItem) {
  return http.post<LostFoundItem>('/lostFounds', data)
}
