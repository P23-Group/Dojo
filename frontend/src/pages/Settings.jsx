import { useNavigate } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import './today.css'

export default function Settings() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('remember')
    localStorage.removeItem('dojo:habits')
    window.location.href = '/login'
  }

  return (
    <section className="today">
      <header className="today__header">
        <div>
          <h1 className="today__title">Settings</h1>
          <p className="today__subtitle">Adjust your preferences.</p>
        </div>
      </header>

      <Card className="today__progress">
        <div className="today__progress-text">
          <h2 className="today__progress-title">Account</h2>
          <p className="today__progress-description">
            Sign out of your account on this device.
          </p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          Log out
        </Button>
      </Card>
    </section>
  )
}