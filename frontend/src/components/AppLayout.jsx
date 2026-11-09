import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { apiFetch } from '../api.js'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import './app-layout.css'

export default function AppLayout() {
  const [user, setUser] = useState(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    let active = true
    const load = () => {
      apiFetch('/me')
        .then((data) => {
          if (active) setUser(data)
        })
        .catch(() => {})
      apiFetch('/stats')
        .then((data) => {
          if (active) setProgress(data?.completionRate || 0)
        })
        .catch(() => {})
    }

    load()
    const handler = () => load()
    window.addEventListener('dojo:user-updated', handler)
    return () => {
      active = false
      window.removeEventListener('dojo:user-updated', handler)
    }
  }, [])

  return (
    <div className="app-layout">
      <Sidebar user={user} progress={progress} />
      <div className="app-layout__main">
        <Header user={user} />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export { AppLayout }