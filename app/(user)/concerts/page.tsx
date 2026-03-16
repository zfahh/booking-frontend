'use client'

import { useState, useEffect } from 'react'
import { Users, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getConcerts, type Concert } from '@/services/concerts'
import { getBookings, createBooking, deleteBooking } from '@/services/bookings'
import { ApiError } from '@/lib/api'

export default function UserConcertsPage() {
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [bookedMap, setBookedMap] = useState<Map<number, number>>(new Map())
  const [loading, setLoading] = useState(true)
  const [actioningIds, setActioningIds] = useState<Set<number>>(new Set())

  const addActioning = (id: number) =>
    setActioningIds((prev) => new Set(prev).add(id))

  const removeActioning = (id: number) =>
    setActioningIds((prev) => { const next = new Set(prev); next.delete(id); return next })

  useEffect(() => {
    Promise.all([getConcerts(), getBookings()])
      .then(([concerts, bookings]) => {
        setConcerts(concerts)
        setBookedMap(new Map(
          bookings
            .filter((b) => b.status === 'active')
            .map((b) => [b.concert.id, b.id])
        ))
      })
      .catch(() => toast.error('Failed to load concerts'))
      .finally(() => setLoading(false))
  }, [])

  const handleBook = async (concertId: number) => {
    if (actioningIds.has(concertId)) return
    addActioning(concertId)
    try {
      const booking = await createBooking(concertId)
      setBookedMap((prev) => new Map(prev).set(concertId, booking.id))
      setConcerts((prev) => prev.map((c) => c.id === concertId ? { ...c, available_seats: c.available_seats - 1 } : c))
      toast.success('Booking confirmed!')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to book concert'
      toast.error(message)
    } finally {
      removeActioning(concertId)
    }
  }

  const handleCancel = async (concertId: number, bookingId: number) => {
    if (actioningIds.has(concertId)) return
    addActioning(concertId)
    try {
      await deleteBooking(bookingId)
      setBookedMap((prev) => {
        const next = new Map(prev)
        next.delete(concertId)
        return next
      })
      setConcerts((prev) => prev.map((c) => c.id === concertId ? { ...c, available_seats: c.available_seats + 1 } : c))
      toast.success('Booking cancelled')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to cancel booking'
      toast.error(message)
    } finally {
      removeActioning(concertId)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Concerts</h2>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {concerts.map((concert) => {
            const bookingId = bookedMap.get(concert.id)
            const isBooked = bookingId !== undefined
            const isActioning = actioningIds.has(concert.id)
            return (
              <div key={concert.id} className="bg-white rounded-xl shadow-sm flex flex-col overflow-hidden border border-slate-100">
                <div className="p-5 flex-1">
                  <h3 className="font-semibold text-slate-800 text-base mb-2">{concert.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{concert.description}</p>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <Users size={16} />
                    <span>{concert.available_seats.toLocaleString()} / {concert.total_seats.toLocaleString()}</span>
                  </div>
                  {isBooked ? (
                    <button
                      onClick={() => handleCancel(concert.id, bookingId)}
                      disabled={isActioning}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isActioning && <Loader2 size={14} className="animate-spin" />}
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBook(concert.id)}
                      disabled={isActioning}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isActioning && <Loader2 size={14} className="animate-spin" />}
                      Booking
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
