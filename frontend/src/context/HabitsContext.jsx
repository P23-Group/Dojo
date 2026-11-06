import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { HabitsAPI } from '../api.js'

const HabitsContext = createContext(null)

const INITIAL_HABITS = [
  { id: 1, name: 'Morning run', description: '30 minutes outdoors', type: 'Helpful', goal: 30, unit: 'minutes', format: 'Counter', frequency: 'Daily', streak: 12, done: true },
  { id: 2, name: 'Read 20 pages', description: 'Evening reading habit', type: 'Helpful', goal: 20, unit: 'pages', format: 'Counter', frequency: 'Daily', streak: 8, done: false },
  { id: 3, name: 'Drink water', description: '8 glasses a day', type: 'Helpful', goal: 8, unit: 'glasses', format: 'Counter', frequency: 'Daily', streak: 21, done: false },
  { id: 4, name: 'Meditate', description: '10 minutes of focus', type: 'Helpful', goal: 10, unit: 'minutes', format: 'Counter', frequency: 'Daily', streak: 5, done: true },
]

function todayString() {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function mapBackendHabit(habit, checkins) {
  const checkin = checkins.find((c) => c.habitId === habit._id || c.habitId === habit.id)
  return {
    id: habit._id || habit.id,
    name: habit.name,
    description: `${habit.goalValue} ${habit.goalUnit}`,
    type: habit.type === 'helpful' ? 'Helpful' : 'Harmful',
    goal: habit.goalValue,
    unit: habit.goalUnit,
    format: habit.trackingFormat === 'counter' ? 'Counter' : 'Yes-No',
    frequency: 'Daily',
    streak: 0,
    done: Boolean(checkin?.completed),
  }
}

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const loadHabits = useCallback(async () => {
    if (!token) {
      setHabits(INITIAL_HABITS)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const [backendHabits, checkins] = await Promise.all([
        HabitsAPI.list(),
        HabitsAPI.checkins(todayString()),
      ])
      setHabits(backendHabits.map((h) => mapBackendHabit(h, checkins)))
    } catch (error) {
      console.error('Failed to load habits', error)
      setHabits(INITIAL_HABITS)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadHabits()
  }, [loadHabits])

  const addHabit = async (habit) => {
    if (!token) {
      setHabits((prev) => [
        ...prev,
        {
          id: Date.now(),
          done: false,
          streak: 0,
          ...habit,
        },
      ])
      return
    }

    const created = await HabitsAPI.create({
      name: habit.name,
      category: 'General',
      type: (habit.type || 'Helpful').toLowerCase(),
      trackingFormat: habit.format === 'Counter' ? 'counter' : 'yes_no',
      goalValue: habit.goal || 1,
      goalUnit: habit.unit || 'times',
      frequency: [0, 1, 2, 3, 4, 5, 6],
    })

    const checkins = await HabitsAPI.checkins(todayString())
    setHabits((prev) => [...prev, mapBackendHabit(created, checkins)])
  }

  const setHabitDone = async (id, done) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, done } : habit,
      ),
    )

    if (token) {
      try {
        await HabitsAPI.setCheckin({
          habitId: id,
          date: todayString(),
          value: done ? 1 : 0,
          completed: done,
        })
        window.dispatchEvent(new CustomEvent('dojo:user-updated'))
      } catch (error) {
        console.error('Failed to save checkin', error)
      }
    }
  }

  const toggleHabit = (id) => {
    const habit = habits.find((h) => h.id === id)
    if (habit) {
      setHabitDone(id, !habit.done)
    }
  }

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