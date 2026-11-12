import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const HabitsContext = createContext(null)

const STORAGE_KEY = 'dojo:habits'

const INITIAL_HABITS = [
  { id: 1, name: 'Morning run', description: '30 minutes outdoors', type: 'Helpful', goal: 30, unit: 'minutes', format: 'Counter', frequency: 'Daily', streak: 12, done: true },
  { id: 2, name: 'Read 20 pages', description: 'Evening reading habit', type: 'Helpful', goal: 20, unit: 'pages', format: 'Counter', frequency: 'Daily', streak: 8, done: false },
  { id: 3, name: 'Drink water', description: '8 glasses a day', type: 'Helpful', goal: 8, unit: 'glasses', format: 'Counter', frequency: 'Daily', streak: 21, done: false },
  { id: 4, name: 'Meditate', description: '10 minutes of focus', type: 'Helpful', goal: 10, unit: 'minutes', format: 'Counter', frequency: 'Daily', streak: 5, done: true },
]

function mapHabit(habit) {
  return {
    id: habit.id,
    name: habit.name,
    description: habit.description,
    type: habit.type,
    goal: habit.goal,
    unit: habit.unit,
    format: habit.format,
    frequency: habit.frequency,
    streak: habit.streak,
    done: Boolean(habit.done),
  }
}

function loadStoredHabits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.map(mapHabit)
    }
  } catch (e) {
    // ignore
  }
  return null
}

export function HabitsProvider({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const [habits, setHabits] = useState(() => {
    const stored = loadStoredHabits()
    if (stored) return stored
    return token ? [] : INITIAL_HABITS.map(mapHabit)
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
    } catch (e) {
      // ignore
    }
  }, [habits])

  const loadHabits = useCallback(async () => {
    setLoading(false)
  }, [])

  const addHabit = async (habit) => {
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        done: false,
        streak: 0,
        ...mapHabit(habit),
      },
    ])
  }

  const setHabitDone = async (id, done) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, done } : habit,
      ),
    )
  }

  const toggleHabit = (id) => {
    const habit = habits.find((h) => h.id === id)
    if (habit) {
      setHabitDone(id, !habit.done)
    }
  }

  useEffect(() => {
    loadHabits()
  }, [loadHabits])

  return (
    <HabitsContext.Provider
      value={{ habits, loading, addHabit, toggleHabit, setHabitDone, refresh: loadHabits }}
    >
      {children}
    </HabitsContext.Provider>
  )
}

export function useHabits() {
  const context = useContext(HabitsContext)
  if (!context) {
    throw new Error('useHabits must be used within a HabitsProvider')
  }
  return context
}