import { createContext, useContext, useState } from 'react'

const HabitsContext = createContext(null)

const INITIAL_HABITS = [
  { id: 1, name: 'Morning run', description: '30 minutes outdoors', type: 'Helpful', goal: 30, unit: 'minutes', format: 'Counter', frequency: 'Daily', streak: 12, xp: 50, done: true },
  { id: 2, name: 'Read 20 pages', description: 'Evening reading habit', type: 'Helpful', goal: 20, unit: 'pages', format: 'Counter', frequency: 'Daily', streak: 8, xp: 30, done: false },
  { id: 3, name: 'Drink water', description: '8 glasses a day', type: 'Helpful', goal: 8, unit: 'glasses', format: 'Counter', frequency: 'Daily', streak: 21, xp: 20, done: false },
  { id: 4, name: 'Meditate', description: '10 minutes of focus', type: 'Helpful', goal: 10, unit: 'minutes', format: 'Counter', frequency: 'Daily', streak: 5, xp: 25, done: true },
]

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState(INITIAL_HABITS)

  const addHabit = (habit) => {
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        done: false,
        streak: 0,
        xp: 10,
        ...habit,
      },
    ])
  }

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, done: !habit.done } : habit,
      ),
    )
  }

  const setHabitDone = (id, done) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id ? { ...habit, done } : habit,
      ),
    )
  }

  return (
    <HabitsContext.Provider value={{ habits, addHabit, toggleHabit, setHabitDone }}>
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