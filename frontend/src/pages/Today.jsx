import { useHabits } from '../context/HabitsContext.jsx'
import Card from '../components/Card.jsx'
import HabitRow from '../components/HabitRow.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import './today.css'

export default function Today() {
  const { habits, loading, setHabitDone } = useHabits()
  const completed = habits.filter((h) => h.done).length

  if (loading) {
    return <p className="today__subtitle">Loading habits...</p>
  }

  return (
    <section className="today">
      <header className="today__header">
        <div>
          <h1 className="today__title">Today</h1>
          <p className="today__subtitle">
            {completed} of {habits.length} habits completed
          </p>
        </div>
      </header>

      <Card className="today__progress">
        <ProgressRing
          value={completed}
          maxValue={habits.length || 1}
          size={96}
        />
        <div className="today__progress-text">
          <h2 className="today__progress-title">Daily progress</h2>
          <p className="today__progress-description">
            Keep going — small steps lead to big results.
          </p>
        </div>
      </Card>

      <div className="today__list">
        {habits.map((habit) => (
          <HabitRow
            key={habit.id}
            id={habit.id}
            name={habit.name}
            description={habit.description}
            completed={habit.done}
            streak={habit.streak}
            onToggle={(id, value) => setHabitDone(id, value)}
          />
        ))}
      </div>
    </section>
  )
}