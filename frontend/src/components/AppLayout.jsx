import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { apiFetch } from '../api.js'
import { useHabits } from '../context/HabitsContext.jsx'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import './app-layout.css'

export default function AppLayout() {
  const [user, setUser] = useState(null)
  const { habits } = useHabits()

  const progress =
    habits.length > 0
      ? Math.round((habits.filter((h) => h.done).length / habits.length) * 100)
      : 0

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
    }

    load()
    return () => {
      active = false
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