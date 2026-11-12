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
    if (response.status === 401 && getToken()) {
      localStorage.removeItem('token')
      localStorage.removeItem('remember')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    const error = new Error(data.error || 'Request failed')
    error.status = response.status
    error.data = data
    throw error
  }
  return data
}