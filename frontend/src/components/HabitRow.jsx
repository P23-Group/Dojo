import { useState } from 'react'
import Checkbox from './Checkbox.jsx'
import './habit-row.css'

export default function HabitRow({
  habit,
  defaultChecked = false,
  onToggle,
}) {
  const [checked, setChecked] = useState(defaultChecked || Boolean(habit?.done))

  const handleChange = (event) => {
    setChecked(event.target.checked)
    onToggle?.(habit, event.target.checked)
  }

  return (
    <div className={`habit-row${checked ? ' habit-row--done' : ''}`}>
      <Checkbox
        id={`habit-${habit?.id ?? habit?.name}`}
        checked={checked}
        onChange={handleChange}
        label=""
      />

      <div className="habit-row__body">
        <div className="habit-row__title">{habit?.name ?? 'Untitled habit'}</div>
        {habit?.description && (
          <div className="habit-row__description">{habit.description}</div>
        )}
      </div>

      <div className="habit-row__meta">
        {habit?.streak != null && (
          <span className="habit-row__chip">🔥 {habit.streak} day streak</span>
        )}
        {habit?.xp != null && (
          <span className="habit-row__chip">+{habit.xp} XP</span>
        )}
      </div>

      <div className="habit-row__actions">
        <button type="button" className="habit-row__action" aria-label="Edit habit">
          ✎
        </button>
        <button type="button" className="habit-row__action" aria-label="Delete habit">
          ×
        </button>
      </div>
    </div>
  )
}

export { HabitRow }