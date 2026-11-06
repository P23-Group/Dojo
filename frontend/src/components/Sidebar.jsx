import { NavLink } from 'react-router-dom'
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

export default function Sidebar() {
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
        <div className="sidebar__level">
          <span className="sidebar__level-label">Level 5</span>
          <div className="sidebar__level-bar">
            <div className="sidebar__level-fill" style={{ width: '62%' }} />
          </div>
        </div>
      </div>
    </aside>
  )
}

export { Sidebar }