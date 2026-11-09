import { useEffect, useState } from 'react'
import { ProgressAPI } from '../api.js'
import Card from '../components/Card.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import './today.css'

export default function Progress() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ProgressAPI.get(7)
      .then((result) => {
        if (active) setData(result)
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
    return <p className="today__subtitle">Loading progress...</p>
  }

  const totalCompleted = data.reduce((sum, d) => sum + d.completed, 0)

  return (
    <section className="today">
      <header className="today__header">
        <div>
          <h1 className="today__title">Progress</h1>
          <p className="today__subtitle">
            {totalCompleted} habits completed in the last 7 days
          </p>
        </div>
      </header>

      <Card className="today__progress">
        <ProgressRing value={totalCompleted} maxValue={Math.max(totalCompleted, 1)} size={96} />
        <div className="today__progress-text">
          <h2 className="today__progress-title">Weekly progress</h2>
          <p className="today__progress-description">
            Keep going — consistency is key.
          </p>
        </div>
      </Card>

      <div className="today__list">
        {data.map((day) => (
          <div key={day.date} className="habit-row">
            <div className="habit-row__body">
              <div className="habit-row__title">{day.date}</div>
              <div className="habit-row__description">
                {day.completed} of {day.total} completed
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}