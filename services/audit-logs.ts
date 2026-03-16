import { apiFetch } from '@/lib/api'

export interface AuditLog {
  id: string
  action: string
  user: { username: string }
  created_at: string
}

export interface AuditLogMeta {
  total: number
  page: number
  totalPages: number
}

export interface AuditLogsResponse {
  data: AuditLog[]
  meta: AuditLogMeta
}

export function getAuditLogs(page: number, limit: number): Promise<AuditLogsResponse> {
  return apiFetch<AuditLogsResponse>(
    `/audit-logs?page=${page}&limit=${limit}`
  )
}
