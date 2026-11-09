function HabitRow({ habit, onToggle, onIncrement }) {
  const progress = Math.min(
    100,
    Math.round((habit.progress / habit.goal) * 100),
  );

  const category =
    habit.type === "Harmful"
      ? "Dangerous"
      : habit.category === "Fitness"
        ? "Health"
        : habit.category;

  return (
    <div className={`habit-row ${habit.completed ? "completed" : ""}`}>
      {habit.format === "Counter" ? (
        <button
          className={`habit-checkbox ${habit.completed ? "is-completed" : ""}`}
          type="button"
          aria-label={`Add one to ${habit.name}`}
          disabled={!onIncrement || habit.completed}
          onClick={onIncrement}
        >
          <span className="custom-checkbox">{habit.completed ? "✓" : "+"}</span>
        </button>
      ) : (
        <label
          className={`habit-checkbox ${habit.completed ? "is-completed" : ""}`}
        >
          <input
            type="checkbox"
            checked={habit.dailyCompleted ?? habit.completed}
            disabled={!onToggle}
            onChange={onToggle}
          />
          <span className="custom-checkbox">
            {(habit.dailyCompleted ?? habit.completed) ? "✓" : ""}
          </span>
        </label>
      )}

      <div className="habit-icon">
        {habit.icon || (habit.type === "Helpful" ? "✦" : "◆")}
      </div>

      <div className="habit-info">
        <div className="habit-title-line">
          <span className="habit-name">{habit.name}</span>

          <span className={`habit-category category-${category.toLowerCase()}`}>
            {category}
          </span>

          {(habit.goalCompleted ?? habit.completed) ? (
            <span className="habit-completed-label">Completed</span>
          ) : (
            <>
              <span className="habit-progress-text">
                {habit.progress}/{habit.goal} {habit.unit}
              </span>
              <div
                className="habit-progress-track"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="habit-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {(habit.earnedXp > 0 ||
        (habit.goalCompleted &&
          habit.format === "Yes-No" &&
          habit.goal > 1)) && (
        <div className="habit-completed-xp">
          +{habit.earnedXp || habit.xp} XP
        </div>
      )}
    </div>
  );
}

export default HabitRow;
