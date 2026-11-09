function HabitMixCard({ categories, colors, totalHabits }) {
  const circumference = 2 * Math.PI * 46;
  let offset = 0;
  const segments = Object.entries(categories)
    .filter(([, count]) => count > 0)
    .map(([name, count]) => {
      const length = (count / totalHabits) * circumference;
      const segment = { name, length, offset };
      offset += length;
      return segment;
    });

  return (
    <section className="today-card mix-card">
      <h3>Habit Mix</h3>
      <div className="mix-ring">
        <svg
          viewBox="0 0 120 120"
          role="img"
          aria-label={`Habit mix for ${totalHabits} habits`}
        >
          <g transform="rotate(-90 60 60)">
            <circle className="mix-ring-track" cx="60" cy="60" r="46" />
            {segments.map((segment) => (
              <circle
                className="mix-ring-segment"
                key={segment.name}
                cx="60"
                cy="60"
                r="46"
                stroke={colors[segment.name]}
                strokeDasharray={`${segment.length} ${circumference - segment.length}`}
                strokeDashoffset={-segment.offset}
              />
            ))}
          </g>
        </svg>
        <div className="mix-ring-inner">
          <strong>{totalHabits}</strong>
          <span>Habits</span>
        </div>
      </div>
      <div className="mix-legend">
        {Object.entries(categories).map(([category, count]) => (
          <div className="mix-legend-item" key={category}>
            <span
              className="mix-dot"
              style={{ background: colors[category] }}
            />
            <span className="mix-category-name">{category}</span>
            <span className="mix-category-count">{count}</span>
            <span className="mix-category-percent">
              {totalHabits ? Math.round((count / totalHabits) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HabitMixCard;
