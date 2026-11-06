import Card from '../components/Card.jsx'
import HabitRow from '../components/HabitRow.jsx'
import './today.css'

const HABITS = [
  { id: 1, name: 'Morning run', description: '30 minutes outdoors', streak: 12, xp: 50, done: true },
  { id: 2, name: 'Read 20 pages', description: 'Evening reading habit', streak: 8, xp: 30, done: false },
  { id: 3, name: 'Drink water', description: '8 glasses a day', streak: 21, xp: 20, done: false },
  { id: 4, name: 'Meditate', description: '10 minutes of focus', streak: 5, xp: 25, done: true },
]

export default function Today() {
  const completed = HABITS.filter((h) => h.done).length

  return (
    <section className="today">
      <header className="today__header">
        <div>
          <h1 className="today__title">Today</h1>
          <p className="today__subtitle">
            {completed} of {HABITS.length} habits completed
          </p>
        </div>
      </header>

      <Card className="today__progress">
        <div className="today__progress-ring">
          <span className="today__progress-value">
            {Math.round((completed / HABITS.length) * 100)}%
          </span>
        </div>
        <div className="today__progress-text">
          <h2 className="today__progress-title">Daily progress</h2>
          <p className="today__progress-description">
            Keep going — small steps lead to big results.
          </p>
        </div>
      </Card>

      <div className="today__list">
        {HABITS.map((habit) => (
          <HabitRow key={habit.id} habit={habit} defaultChecked={habit.done} />
        ))}
      </div>
    </section>
  )
}

export { Today }