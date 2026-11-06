import { useEffect, useState } from 'react'
import { apiFetch } from '../api.js'
import { BellIcon, SearchIcon } from './icons.jsx'
import './header.css'

export default function Header({ user: userProp }) {
  const [query, setQuery] = useState('')
  const [user, setUser] = useState(userProp || null)

  useEffect(() => {
    if (userProp) {
      setUser(userProp)
      return
    }
    const token = localStorage.getItem('token')
    if (!token) return

    let active = true
    apiFetch('/me')
      .then((data) => {
        if (active) setUser(data)
      })
      .catch(() => {
        if (active) setUser(null)
      })

    return () => {
      active = false
    }
  }, [userProp])

  const userName = user?.name || 'Guest'
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'G'

  return (
    <header className="header">
      <div className="header__search">
        <SearchIcon className="header__search-icon" />
        <input
          className="header__search-input"
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search"
        />
      </div>

      <div className="header__actions">
        <button type="button" className="header__icon-btn" aria-label="Notifications">
          <BellIcon />
          <span className="header__badge" />
        </button>

        <div className="header__user">
          <span className="header__user-name">{userName}</span>
          <div className="header__avatar" aria-hidden="true">{initials}</div>
        </div>
      </div>
    </header>
  )
}

export { Header }