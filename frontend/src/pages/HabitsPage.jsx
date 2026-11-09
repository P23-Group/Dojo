import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getCharacterImage } from "../utils/characterLevels";
import { createHabit as createHabitRequest } from "../api/habits";
import "./HabitsPage.css";

const blank = {
  name: "",
  type: "Helpful",
  category: "Health",
  icon: "✨",
  goal: 1,
  unit: "times",
  format: "Yes-No",
  frequency: "Daily",
  xp: 10,
};
const categoriesByType = {
  Helpful: ["Health", "Fitness", "Learning", "Productivity"],
  Harmful: ["Dangerous"],
};
const habitIcons = [
  ["📖", "Book"],
  ["💧", "Water"],
  ["🏋️", "Dumbbell"],
  ["🧘", "Meditation"],
  ["🥗", "Healthy food"],
  ["💻", "Work"],
  ["🚭", "No smoking"],
  ["✨", "Sparkle"],
];

function HabitsPage() {
  const { habits, refreshHabits, dailyLogs = {}, habitsLoading, habitsError } = useOutletContext();
  const totalXp = Object.values(dailyLogs)
    .flatMap(Object.values)
    .reduce((sum, entry) => sum + (entry.earnedXp || 0), 0);
  const level = Math.floor(totalXp / 100) + 1;
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => {
      if (name === "type") {
        return {
          ...current,
          type: value,
          category: categoriesByType[value][0],
        };
      }
      return {
        ...current,
        [name]: name === "goal" || name === "xp" ? Number(value) : value,
      };
    });
  };
  const createHabit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.unit.trim() || form.goal < 1) {
      setError("Enter a name, unit and goal greater than zero.");
      return;
    }
    const habit = {
      ...form,
      name: form.name.trim(),
      completed: false,
      progress: 0,
    };
    setSaving(true);
    setError("");
    try {
      await createHabitRequest(habit);
      await refreshHabits();
      setForm(blank);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="habits-page">
      <header className="habits-page-heading">
        <h1>Habits</h1>
        <p>Create a new habit to build a better you.</p>
      </header>
      <div className="habits-page-grid">
        <section className="habits-form-card">
          <h2>Add Habit</h2>
          <form onSubmit={createHabit}>
            <label>
              Habit Name
              <input
                name="name"
                value={form.name}
                onChange={update}
                placeholder="e.g. Morning Workout"
                required
              />
            </label>
            <div className="habits-form-row">
              <label>
                Type
                <select name="type" value={form.type} onChange={update}>
                  <option>Helpful</option>
                  <option>Harmful</option>
                </select>
              </label>
              <label>
                Category
                <select name="category" value={form.category} onChange={update}>
                  {categoriesByType[form.type].map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Icon
              <select name="icon" value={form.icon} onChange={update}>
                {habitIcons.map(([icon, name]) => (
                  <option key={icon} value={icon}>
                    {icon} {name}
                  </option>
                ))}
              </select>
            </label>
            <div className="habits-form-row">
              <label>
                Goal
                <input
                  name="goal"
                  type="number"
                  min="1"
                  value={form.goal}
                  onChange={update}
                  required
                />
              </label>
              <label>
                Unit
                <input
                  name="unit"
                  value={form.unit}
                  onChange={update}
                  placeholder="glasses, minutes, days..."
                  required
                />
              </label>
            </div>
            <div className="habits-form-row">
              <label>
                Format
                <select name="format" value={form.format} onChange={update}>
                  <option>Counter</option>
                  <option>Yes-No</option>
                </select>
              </label>
              <label>
                Frequency
                <select
                  name="frequency"
                  value={form.frequency}
                  onChange={update}
                >
                  <option>Daily</option>
                  <option>Weekdays</option>
                  <option>Weekends</option>
                </select>
              </label>
            </div>
            <label>
              XP reward
              <input
                name="xp"
                type="number"
                min="0"
                value={form.xp}
                onChange={update}
              />
            </label>
            {error && (
              <p className="habits-form-error" role="alert">
                {error}
              </p>
            )}
            <button className="add-habit-button" type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create Habit"}
            </button>
          </form>
        </section>
        <aside className="habit-preview-card">
          <h2>Preview</h2>
          <p>Here’s how your habit will look on Today.</p>
          <div className="habit-preview-row">
            <span className="habit-preview-icon">{form.icon}</span>
            <div>
              <strong>{form.name || "Your habit name"}</strong>
              <small>
                {form.goal} {form.unit} · {form.frequency}
              </small>
            </div>
            <span
              className={`habit-category category-${form.category.toLowerCase()}`}
            >
              {form.category}
            </span>
          </div>
          <div className="habit-preview-character">
            <img
              src={getCharacterImage(level)}
              alt={`Dojo character, level ${level}`}
            />
            <span>Level {level}</span>
          </div>
        </aside>
      </div>
      <section className="managed-habits">
        <h2>
          Your Habits <span>{habits.length}</span>
        </h2>
        {habitsError && <p className="habits-form-error" role="alert">{habitsError}</p>}
        {habitsLoading ? (
          <p role="status">Loading habits…</p>
        ) : habits.length === 0 ? (
          <p>No habits yet. Create your first one above.</p>
        ) : (
          <div className="managed-habit-list">
            {habits.map((habit) => (
              <article className="managed-habit-row" key={habit.id}>
                <span className="habit-preview-icon">{habit.icon || "✨"}</span>
                <div>
                  <strong>{habit.name}</strong>
                  <small>
                    {habit.type} · {habit.category} · {habit.format} ·{" "}
                    {habit.goal} {habit.unit} · {habit.xp} XP
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HabitsPage;
