import { apiFetch } from '@/lib/api'

export interface Concert {
  id: string
  name: string
  description: string
  total_seats: number
  available_seats: number
}

export interface CreateConcertRequest {
  name: string
  description: string
  total_seats: number
}

export function getConcerts(): Promise<Concert[]> {
  return apiFetch<Concert[]>('/concerts')
}

export function createConcert(data: CreateConcertRequest): Promise<Concert> {
  return apiFetch<Concert>('/concerts', { method: 'POST', body: data })
}

export function deleteConcert(concert_id: number): Promise<void> {
  return apiFetch<void>(`/concerts/${concert_id}`, { method: 'DELETE' })
}
