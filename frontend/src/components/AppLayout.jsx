import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import './app-layout.css'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout__main">
        <Header />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export { AppLayout }