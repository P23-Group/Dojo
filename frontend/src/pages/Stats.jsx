import { useEffect, useState } from 'react'
import { StatsAPI } from '../api.js'
import Card from '../components/Card.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import './today.css'

export default function Stats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    StatsAPI.get()
      .then((data) => {
        if (active) setStats(data)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <p className="today__subtitle">Loading stats...</p>
  }

  return (
    <section className="today">
      <header className="today__header">
        <div>
          <h1 className="today__title">Stats</h1>
          <p className="today__subtitle">Your overall performance</p>
        </div>
      </header>

      <div className="today__list">
        <Card className="today__progress">
          <ProgressRing value={stats?.completionRate || 0} maxValue={100} size={96} />
          <div className="today__progress-text">
            <h2 className="today__progress-title">Today completion</h2>
            <p className="today__progress-description">
              {stats?.completedToday || 0} of {stats?.totalHabits || 0} habits
            </p>
          </div>
        </Card>

        <div className="habit-row">
          <div className="habit-row__body">
            <div className="habit-row__title">Total habits</div>
            <div className="habit-row__description">{stats?.totalHabits || 0}</div>
          </div>
        </div>

        <div className="habit-row">
          <div className="habit-row__body">
            <div className="habit-row__title">Total check-ins</div>
            <div className="habit-row__description">{stats?.totalCheckins || 0}</div>
          </div>
        </div>

        <div className="habit-row">
          <div className="habit-row__body">
            <div className="habit-row__title">Completed check-ins</div>
            <div className="habit-row__description">{stats?.totalCompleted || 0}</div>
          </div>
        </div>
      </div>
    </section>
  )
}