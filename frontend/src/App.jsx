import { useState } from 'react'
import CreateAccount from './pages/CreateAccount.jsx'
import Login from './pages/Login.jsx'
import './App.css'

const ROUTES = { login: 'login', create: 'create-account' }

export default function App() {
  const [page, setPage] = useState(() =>
    window.location.hash === '#create-account' ? 'create' : 'login',
  )

  const navigate = (next) => {
    setPage(next)
    window.location.hash = ROUTES[next]
  }

  return page === 'login' ? (
    <Login onNavigate={navigate} />
  ) : (
    <CreateAccount onNavigate={navigate} />
  )
}
