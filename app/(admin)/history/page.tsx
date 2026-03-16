'use client'

import { useState, useEffect } from 'react'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { getAuditLogs, type AuditLog } from '@/services/audit-logs'

const ACTION_LABEL: Record<string, { label: string; className: string }> = {
  booking_created: { label: 'Booking', className: 'text-emerald-600' },
  booking_cancelled: { label: 'Booking Cancelled', className: 'text-red-500' },
  concert_updated: { label: 'Concert updated', className: 'text-blue-600' },
  concert_deleted: { label: 'Concert deleted', className: 'text-orange-500' },
  concert_created: { label: 'Concert created', className: 'text-emerald-600' },
}

const PAGE_SIZE = 20

export default function AdminHistoryPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { data, meta } = await getAuditLogs(page, PAGE_SIZE)
        setLogs(data)
        setTotalPages(meta.totalPages)
        setTotal(meta.total)
      } catch {
        toast.error('Failed to load history')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page])

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">History</h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">#</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Action</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Action by</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-slate-400">No records found</td>
                    </tr>
                  ) : (
                    logs.map((log, index) => {
                      const action = ACTION_LABEL[log.action] ?? { label: log.action, className: 'text-slate-700' }
                      return (
                        <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-slate-400">{(page - 1) * PAGE_SIZE + index + 1}</td>
                          <td className={`px-4 py-3 font-medium ${action.className}`}>{action.label}</td>
                          <td className="px-4 py-3 text-blue-600 font-medium">{log.user.username}</td>
                          <td className="px-4 py-3 text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                {total === 0 ? '0' : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)}`} of {total}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`min-w-[30px] h-[30px] rounded-lg text-xs font-medium transition-colors ${
                      p === page
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
