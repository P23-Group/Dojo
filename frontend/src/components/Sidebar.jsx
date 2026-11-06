import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { apiFetch } from '../api.js'
import heroImage from '../assets/hero-character.png'
import CharacterCard from './CharacterCard.jsx'
import {
  HabitsIcon,
  ProgressIcon,
  SettingsIcon,
  StatsIcon,
  TodayIcon,
} from './icons.jsx'
import './sidebar.css'

const ITEMS = [
  { to: '/today', label: 'Today', Icon: TodayIcon },
  { to: '/habits', label: 'Habits', Icon: HabitsIcon },
  { to: '/progress', label: 'Progress', Icon: ProgressIcon },
  { to: '/stats', label: 'Stats', Icon: StatsIcon },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
]

export default function Sidebar({ user: userProp, progress: progressProp }) {
  const [user, setUser] = useState(userProp || null)
  const progress = progressProp ?? 0

  useEffect(() => {
    if (userProp) {
      setUser(userProp)
    }

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

    if (!userProp) load()

    const handler = () => load()
    window.addEventListener('dojo:user-updated', handler)
    return () => {
      active = false
      window.removeEventListener('dojo:user-updated', handler)
    }
  }, [userProp])

  const level = user?.lvl ?? 1
  const name = user?.name || 'Your hero'

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">DOJO</span>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        <ul className="sidebar__list">
          {ITEMS.map(({ to, label, Icon }) => (
            <li key={to} className="sidebar__item">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
                }
              >
                <Icon className="sidebar__icon" />
                <span className="sidebar__label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <CharacterCard
          name={name}
          image={heroImage}
          level={level}
          progress={progress}
          description="Keep building habits to level up."
        />
      </div>
    </aside>
  )
}

export { Sidebar }