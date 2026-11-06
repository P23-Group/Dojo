import { Link } from 'react-router-dom'
import { useHabits } from '../context/HabitsContext.jsx'
import Card from '../components/Card.jsx'
import HabitRow from '../components/HabitRow.jsx'
import Button from '../components/Button.jsx'
import './today.css'

export default function Habits() {
  const { habits, loading, setHabitDone } = useHabits()

  if (loading) {
    return <p className="today__subtitle">Loading habits...</p>
  }

  return (
    <section className="today">
      <header className="today__header">
        <div>
          <h1 className="today__title">Habits</h1>
          <p className="today__subtitle">{habits.length} habits</p>
        </div>
        <Link to="/add-habit">
          <Button>Add Habit</Button>
        </Link>
      </header>

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

      {habits.length === 0 && (
        <Card className="today__progress">
          <p className="today__progress-description">No habits yet. Add your first habit.</p>
        </Card>
      )}
    </section>
  )
}