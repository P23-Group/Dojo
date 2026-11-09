import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHabits } from '../context/HabitsContext.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import HabitRow from '../components/HabitRow.jsx'
import Input from '../components/Input.jsx'
import './add-habit.css'

const TYPES = ['Helpful', 'Harmful']
const FORMATS = ['Counter', 'Yes-No']
const FREQUENCIES = ['Daily', 'Weekly', 'Monthly']

function Segmented({ label, options, value, onChange }) {
  return (
    <div className="segmented">
      <span className="field__label">{label}</span>
      <div className="segmented__options" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`segmented__option${
              value === option ? ' segmented__option--active' : ''
            }`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function AddHabit() {
  const navigate = useNavigate()
  const { addHabit } = useHabits()

  const [values, setValues] = useState({
    name: '',
    type: 'Helpful',
    goal: 1,
    unit: 'times',
    format: 'Counter',
    frequency: 'Daily',
  })

  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleChange = (field) => (event) => {
    setField(field, event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!values.name.trim()) return

    addHabit({
      name: values.name.trim(),
      description: `${values.goal || 1} ${values.unit || 'times'} · ${values.frequency}`,
      type: values.type,
      goal: Number(values.goal) || 1,
      unit: values.unit.trim() || 'times',
      format: values.format,
      frequency: values.frequency,
    })

    navigate('/habits')
  }

  const previewHabit = {
    id: 'preview',
    name: values.name.trim() || 'New habit',
    description: `${values.goal || 1} ${values.unit || 'times'} · ${values.frequency}`,
    type: values.type,
    done: false,
  }

  return (
    <section className="add-habit">
      <header className="add-habit__header">
        <h1 className="today__title">Add Habit</h1>
        <p className="today__subtitle">
          Create a new habit and preview it before saving.
        </p>
      </header>

      <div className="add-habit__layout">
        <Card className="add-habit__form-card">
          <form className="add-habit__form" onSubmit={handleSubmit}>
            <Input
              label="Habit name"
              placeholder="e.g. Drink water"
              value={values.name}
              onChange={handleChange('name')}
              required
            />

            <Segmented
              label="Type"
              options={TYPES}
              value={values.type}
              onChange={(value) => setField('type', value)}
            />

            <div className="add-habit__row add-habit__row--split">
              <Input
                label="Goal"
                type="number"
                min="1"
                value={values.goal}
                onChange={handleChange('goal')}
              />
              <Input
                label="Unit"
                placeholder="times"
                value={values.unit}
                onChange={handleChange('unit')}
              />
            </div>

            <Segmented
              label="Format"
              options={FORMATS}
              value={values.format}
              onChange={(value) => setField('format', value)}
            />

            <Segmented
              label="Frequency"
              options={FREQUENCIES}
              value={values.frequency}
              onChange={(value) => setField('frequency', value)}
            />

            <Button type="submit" className="add-habit__submit">
              Create Habit
            </Button>
          </form>
        </Card>

        <Card className="add-habit__preview">
          <div className="add-habit__preview-head">
            <h2 className="today__progress-title">Preview</h2>
            <span
              className={`add-habit__badge add-habit__badge--${values.type.toLowerCase()}`}
            >
              {values.type}
            </span>
          </div>
          <p className="today__progress-description">
            {values.format} · {values.frequency}
          </p>
          <div className="add-habit__preview-row">
            <HabitRow habit={previewHabit} />
          </div>
          <div className="add-habit__preview-meta">
            <div>
              <span className="add-habit__meta-label">Goal</span>
              <span className="add-habit__meta-value">
                {values.goal || 1} {values.unit || 'times'}
              </span>
            </div>
            <div>
              <span className="add-habit__meta-label">Type</span>
              <span className="add-habit__meta-value">{values.type}</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}