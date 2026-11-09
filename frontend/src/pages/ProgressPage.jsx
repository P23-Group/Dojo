import { useOutletContext } from "react-router-dom";
import { getDayHabit, getLocalDateKey } from "../utils/dailyHabits";
import "./OverviewPages.css";

function ProgressPage() {
  const { habits, dailyLogs } = useOutletContext();
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = getLocalDateKey(date);
    const log = dailyLogs[key] ?? {};
    const rows = habits.map((habit) => getDayHabit(habit, log));
    const done = rows.filter((habit) => habit.completed).length;
    return {
      key,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      done,
      total: habits.length,
      xp: Object.values(log).reduce(
        (sum, entry) => sum + (entry.earnedXp || 0),
        0,
      ),
    };
  });
  const xpTotal = Object.values(dailyLogs)
    .flatMap(Object.values)
    .reduce((sum, entry) => sum + (entry.earnedXp || 0), 0);
  const completions = Object.values(dailyLogs)
    .flatMap(Object.values)
    .filter((entry) => entry.completed).length;
  const streakDays = Object.keys(dailyLogs).filter((date) =>
    Object.values(dailyLogs[date] ?? {}).some((entry) => entry.completed),
  ).length;
  return (
    <div className="overview-page">
      <header>
        <h1>Progress</h1>
        <p>Your daily progress, earned XP and consistency.</p>
      </header>
      <div className="overview-metrics">
        <article>
          <span>Completed check-ins</span>
          <strong>{completions}</strong>
        </article>
        <article>
          <span>Total XP</span>
          <strong>{xpTotal}</strong>
        </article>
        <article>
          <span>Active days</span>
          <strong>{streakDays}</strong>
        </article>
      </div>
      <section className="overview-card">
        <h2>Last 7 days</h2>
        <div className="progress-days">
          {days.map((day) => (
            <div className="progress-day" key={day.key}>
              <strong>
                {day.done}/{day.total}
              </strong>
              <div className="progress-day-track">
                <span
                  style={{
                    height: `${day.total ? (day.done / day.total) * 100 : 0}%`,
                  }}
                />
              </div>
              <span>{day.label}</span>
              <small>{day.xp} XP</small>
            </div>
          ))}
        </div>
      </section>
      <section className="overview-card">
        <h2>Habit history</h2>
        {habits.length ? (
          habits.map((habit) => (
            <div className="overview-list-row" key={habit.id}>
              <span>{habit.name}</span>
              <span>
                {
                  Object.values(dailyLogs).filter(
                    (log) => log[habit.id]?.completed,
                  ).length
                }{" "}
                completed days
              </span>
            </div>
          ))
        ) : (
          <p>Create a habit to start tracking progress.</p>
        )}
      </section>
    </div>
  );
}

export default ProgressPage;
