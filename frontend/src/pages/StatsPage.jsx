import { useOutletContext } from "react-router-dom";
import "./OverviewPages.css";

const colors = {
  Health: "#22C55E",
  Fitness: "#22C55E",
  Learning: "#3B82F6",
  Productivity: "#F59E0B",
  Dangerous: "#EF4444",
};
const categoryOf = (habit) =>
  habit.type === "Harmful"
    ? "Dangerous"
    : habit.category === "Fitness"
      ? "Health"
      : habit.category;

function StatsPage() {
  const { habits, dailyLogs } = useOutletContext();
  const categories = { Health: 0, Learning: 0, Productivity: 0, Dangerous: 0 };
  habits.forEach((habit) => {
    const key = categoryOf(habit);
    if (categories[key] !== undefined) categories[key]++;
  });
  const entries = Object.values(dailyLogs).flatMap(Object.values);
  const completed = entries.filter((entry) => entry.completed).length;
  const xp = entries.reduce((sum, entry) => sum + (entry.earnedXp || 0), 0);
  const dates = Object.keys(dailyLogs).sort().reverse().slice(0, 30);
  const level = Math.floor(xp / 100) + 1;
  return (
    <div className="overview-page">
      <header>
        <h1>Stats</h1>
        <p>A summary of your habits and recorded check-ins.</p>
      </header>
      <div className="overview-metrics">
        <article>
          <span>Total habits</span>
          <strong>{habits.length}</strong>
        </article>
        <article>
          <span>Completed / missed check-ins</span>
          <strong>
            {completed} / {Math.max(entries.length - completed, 0)}
          </strong>
        </article>
        <article>
          <span>Helpful / harmful</span>
          <strong>
            {habits.filter((habit) => habit.type === "Helpful").length} /{" "}
            {habits.filter((habit) => habit.type === "Harmful").length}
          </strong>
        </article>
        <article>
          <span>Total XP · Level</span>
          <strong>
            {xp} · {level}
          </strong>
        </article>
      </div>
      <section className="overview-card">
        <h2>Habit categories</h2>
        {Object.entries(categories).map(([name, count]) => (
          <div className="category-stat-row" key={name}>
            <span className="mix-dot" style={{ background: colors[name] }} />
            <span>{name}</span>
            <div className="category-stat-track">
              <span
                style={{
                  width: `${habits.length ? (count / habits.length) * 100 : 0}%`,
                  background: colors[name],
                }}
              />
            </div>
            <strong>{count}</strong>
          </div>
        ))}
      </section>
      <section className="overview-card">
        <h2>Recorded daily activity · last 30 days</h2>
        {dates.length ? (
          dates.map((date) => {
            const dayEntries = Object.values(dailyLogs[date] ?? {});
            const dayDone = dayEntries.filter(
              (entry) => entry.completed,
            ).length;
            const dayXp = dayEntries.reduce(
              (sum, entry) => sum + (entry.earnedXp || 0),
              0,
            );
            return (
              <div className="overview-list-row" key={date}>
                <span>{date}</span>
                <span>
                  {dayDone} completed · {dayXp} XP
                </span>
              </div>
            );
          })
        ) : (
          <p>Daily statistics will appear after you record a check-in.</p>
        )}
      </section>
    </div>
  );
}

export default StatsPage;
