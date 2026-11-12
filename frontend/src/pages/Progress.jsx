import { useHabits } from '../context/HabitsContext.jsx'
import Card from '../components/Card.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import './today.css'

export default function Progress() {
  const { habits } = useHabits()
  const total = habits.length
  const completed = habits.filter((h) => h.done).length
  const rate = total ? Math.round((completed / total) * 100) : 0

  return (
    <section className="today">
      <header className="today__header">
        <div>
          <h1 className="today__title">Progress</h1>
          <p className="today__subtitle">
            {completed} of {total} habits completed today
          </p>
        </div>
      </header>

      <Card className="today__progress">
        <ProgressRing value={completed} maxValue={Math.max(total, 1)} size={96} />
        <div className="today__progress-text">
          <h2 className="today__progress-title">Today's progress</h2>
          <p className="today__progress-description">
            Keep going — consistency is key.
          </p>
        </div>
      </Card>

      <div className="today__list">
        {habits.map((habit) => (
          <div key={habit.id} className="habit-row">
            <div className="habit-row__body">
              <div className="habit-row__title">{habit.name}</div>
              <div className="habit-row__description">
                {habit.done ? 'Completed' : 'Not completed'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}