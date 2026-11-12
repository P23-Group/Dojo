import { useHabits } from '../context/HabitsContext.jsx'
import Card from '../components/Card.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import './today.css'

export default function Stats() {
  const { habits } = useHabits()
  const totalHabits = habits.length
  const completedToday = habits.filter((h) => h.done).length
  const completionRate = totalHabits ? Math.round((completedToday / totalHabits) * 100) : 0

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
          <ProgressRing value={completionRate} maxValue={100} size={96} />
          <div className="today__progress-text">
            <h2 className="today__progress-title">Today completion</h2>
            <p className="today__progress-description">
              {completedToday} of {totalHabits} habits
            </p>
          </div>
        </Card>

        <div className="habit-row">
          <div className="habit-row__body">
            <div className="habit-row__title">Total habits</div>
            <div className="habit-row__description">{totalHabits}</div>
          </div>
        </div>

        <div className="habit-row">
          <div className="habit-row__body">
            <div className="habit-row__title">Completed today</div>
            <div className="habit-row__description">{completedToday}</div>
          </div>
        </div>

        <div className="habit-row">
          <div className="habit-row__body">
            <div className="habit-row__title">Completion rate</div>
            <div className="habit-row__description">{completionRate}%</div>
          </div>
        </div>
      </div>
    </section>
  )
}