'use client'

import { useState, useEffect } from 'react'
import { Trash2, Users, Armchair, TicketCheck, TicketX, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Alert } from '@/components/ui/Alert'
import { AlertDialog } from '@/components/ui/AlertDialog'
import { getConcerts, deleteConcert, createConcert, type Concert } from '@/services/concerts'
import { getAllBookings } from '@/services/bookings'
import { ApiError } from '@/lib/api'

function OverviewTab({ concerts, loading, onDelete }: {
  concerts: Concert[]
  loading: boolean
  onDelete: (concert: Concert) => Promise<void>
}) {
  const [deleteTarget, setDeleteTarget] = useState<Concert | null>(null)
  const [deleting, setDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await onDelete(deleteTarget)
      toast.success('Concert deleted', { description: `"${deleteTarget.name}" has been removed.` })
      setDeleteTarget(null)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to delete concert'
      toast.error(message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    )
  }

  if (concerts.length === 0) {
    return (
      <Alert
        variant="info"
        title="No concerts"
        description='Create one in the "Create Concert" tab.'
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {concerts.map((concert) => (
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
              <button
                onClick={() => setDeleteTarget(concert)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={!!deleteTarget}
        variant="danger"
        title="Delete concert?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  )
}

function CreateConcertTab({ onCreated }: { onCreated: (concert: Concert) => void }) {
  const [form, setForm] = useState({ name: '', description: '', total_seats: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const concert = await createConcert({
        name: form.name,
        description: form.description,
        total_seats: Number(form.total_seats),
      })
      onCreated(concert)
      toast.success('Concert created!', { description: `"${form.name}" has been added.` })
      setForm({ name: '', description: '', total_seats: '' })
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to create concert'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Concert Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Super mario bros 2026"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the concert"
            required
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Seats</label>
          <input
            type="number"
            min="1"
            value={form.total_seats}
            onChange={(e) => setForm({ ...form, total_seats: e.target.value })}
            placeholder="e.g. 500"
            required
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>
        <button
          type="submit"
          disabled={!form.name || !form.description || !form.total_seats || loading}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Create Concert
        </button>
      </form>
    </div>
  )
}

const tabs = ['Overview', 'Create Concert'] as const
type Tab = typeof tabs[number]

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [activeCount, setActiveCount] = useState(0)
  const [cancelledCount, setCancelledCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([getConcerts(), getAllBookings()])
      .then(([concertsResult, bookingsResult]) => {
        if (concertsResult.status === 'fulfilled') {
          setConcerts(concertsResult.value)
        } else {
          toast.error('Failed to load concerts')
        }

        if (bookingsResult.status === 'fulfilled') {
          const bookings = bookingsResult.value
          setActiveCount(bookings.filter((b) => b.status === 'active').length)
          setCancelledCount(bookings.filter((b) => b.status === 'cancelled').length)
        } else {
          toast.error('Failed to load bookings')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const total_seats = concerts.reduce((sum, c) => sum + c.total_seats, 0)

  const statCards = [
    {
      label: 'Total Seats',
      value: loading ? '...' : total_seats.toLocaleString(),
      icon: Armchair,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      valueColor: 'text-blue-700',
      border: 'border-blue-100',
    },
    {
      label: 'Bookings',
      value: loading ? '...' : activeCount.toLocaleString(),
      icon: TicketCheck,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      valueColor: 'text-emerald-700',
      border: 'border-emerald-100',
    },
    {
      label: 'Cancellations',
      value: loading ? '...' : cancelledCount.toLocaleString(),
      icon: TicketX,
      bg: 'bg-red-50',
      iconColor: 'text-red-500',
      valueColor: 'text-red-700',
      border: 'border-red-100',
    },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, bg, iconColor, valueColor, border }) => (
          <div key={label} className={`rounded-xl border ${border} ${bg} px-6 py-5 flex items-center gap-4`}>
            <div className={`p-3 rounded-lg bg-white shadow-sm ${iconColor}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-0.5">{label}</p>
              <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' ? (
        <OverviewTab
          concerts={concerts}
          loading={loading}
          onDelete={async (concert) => {
            await deleteConcert(concert.id)
            setConcerts((prev) => prev.filter((c) => c.id !== concert.id))
          }}
        />
      ) : (
        <CreateConcertTab onCreated={(concert) => setConcerts((prev) => [...prev, concert])} />
      )}
    </div>
  )
}
