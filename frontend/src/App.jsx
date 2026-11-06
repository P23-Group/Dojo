import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import CreateAccount from './pages/CreateAccount.jsx'
import Habits from './pages/Habits.jsx'
import Login from './pages/Login.jsx'
import Progress from './pages/Progress.jsx'
import Settings from './pages/Settings.jsx'
import Stats from './pages/Stats.jsx'
import Today from './pages/Today.jsx'
import './App.css'

function AppRoutes() {
  const navigate = useNavigate()

  const handleNavigate = (page) => {
    if (page === 'create' || page === 'create-account') {
      navigate('/create-account')
    } else {
      navigate('/login')
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onNavigate={handleNavigate} />} />
      <Route
        path="/create-account"
        element={<CreateAccount onNavigate={handleNavigate} />}
      />

      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/today" replace />} />
        <Route path="/today" element={<Today />} />
        <Route path="/habits" element={<Habits />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/today" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}