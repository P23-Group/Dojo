import { useState } from 'react'
import { BellIcon, SearchIcon } from './icons.jsx'
import './header.css'

export default function Header() {
  const [query, setQuery] = useState('')

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
          <span className="header__user-name">Alex Chen</span>
          <div className="header__avatar" aria-hidden="true">AC</div>
        </div>
      </div>
    </header>
  )
}

export { Header }