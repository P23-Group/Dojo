import { useState } from 'react'
import Checkbox from './Checkbox.jsx'
import './habit-row.css'

export default function HabitRow({
  id,
  name,
  description,
  completed,
  onToggle,
  habit,
  checked: checkedProp,
  defaultChecked = false,
  streak,
}) {
  const habitId = id ?? habit?.id
  const habitName = name ?? habit?.name ?? 'Untitled habit'
  const habitDescription = description ?? habit?.description
  const habitStreak = streak ?? habit?.streak

  const [internalChecked, setInternalChecked] = useState(
    defaultChecked || Boolean(habit?.done) || Boolean(completed),
  )

  const isControlled =
    completed !== undefined || checkedProp !== undefined
  const checked = isControlled
    ? Boolean(completed ?? checkedProp)
    : internalChecked

  const handleChange = (event) => {
    if (!isControlled) {
      setInternalChecked(event.target.checked)
    }
    onToggle?.(habitId, event.target.checked)
  }

  return (
    <div className={`habit-row${checked ? ' habit-row--done' : ''}`}>
      <Checkbox
        id={`habit-${habitId ?? habitName}`}
        checked={checked}
        onChange={handleChange}
        label=""
      />

      <div className="habit-row__body">
        <div className="habit-row__title">{habitName}</div>
        {habitDescription && (
          <div className="habit-row__description">{habitDescription}</div>
        )}
      </div>

      <div className="habit-row__meta">
        {habitStreak != null && (
          <span className="habit-row__chip">🔥 {habitStreak} day streak</span>
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