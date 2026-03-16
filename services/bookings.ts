import { apiFetch } from '@/lib/api'
import { Concert } from './concerts'

export interface Booking {
  id: string,
  status: 'active' | 'cancelled',
  concert: Concert,
  booked_at: string | null,
  cancelled_at: string | null,
}

export function getBookings(): Promise<Booking[]> {
  return apiFetch<Booking[]>('/bookings/me')
}

export function getAllBookings(): Promise<Booking[]> {
  return apiFetch<Booking[]>('/bookings')
}

export function createBooking(concert_id: number): Promise<Booking> {
  return apiFetch<Booking>('/bookings', { method: 'POST', body: { concert_id } })
}

export function deleteBooking(booking_id: number): Promise<void> {
  return apiFetch<void>(`/bookings/${booking_id}`, { method: 'DELETE' })
}
