import axios, { AxiosError } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

function getTokenFromCookie(): string | null {
  if (typeof window === 'undefined') return null
  const match = document.cookie.split('; ').find((c) => c.startsWith('token='))
  return match ? match.split('=')[1] : null
}

apiClient.interceptors.request.use((config) => {
  const token = getTokenFromCookie()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function apiFetch<T>(
  path: string,
  options: { method?: string; body?: unknown; headers?: Record<string, string> } = {},
): Promise<T> {
  const { method = 'GET', body, headers } = options

  try {
    const response = await apiClient.request<T>({
      url: path,
      method,
      data: body,
      headers,
    })
    return response.data
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      const data = err.response.data
      const message =
        data?.message ?? data?.error ?? `Request failed with status ${err.response.status}`
      throw new ApiError(err.response.status, message)
    }
    throw err
  }
}
