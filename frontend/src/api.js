const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function getToken() {
  return localStorage.getItem('token')
}

export async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed')
    error.status = response.status
    error.data = data
    throw error
  }
  return data
}

export const StatsAPI = {
  async get() {
    return apiFetch('/stats')
  },
}

export const ProgressAPI = {
  async get(days = 7) {
    return apiFetch(`/progress?days=${days}`)
  },
}

export const HabitsAPI = {
  async list() {
    return apiFetch('/habits')
  },
  async create(payload) {
    return apiFetch('/habits', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  async checkins(date) {
    const query = date ? `?date=${encodeURIComponent(date)}` : ''
    return apiFetch(`/checkins${query}`)
  },
  async setCheckin(payload) {
    return apiFetch('/checkins', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
}