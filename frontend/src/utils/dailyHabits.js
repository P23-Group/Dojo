export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function readStoredValue(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getDayHabit(habit, dayLog = {}) {
  const checkin = dayLog[habit.id] ?? {
    progress: 0,
    completed: false,
    earnedXp: 0,
  };
  return {
    ...habit,
    ...checkin,
    progress: checkin.progress ?? 0,
    completed: Boolean(checkin.completed),
  };
}

export function updateDayHabit(log, habit, update) {
  const previous = getDayHabit(habit, log);
  const next = typeof update === "function" ? update(previous) : update;
  const progress = Math.min(
    habit.goal,
    Math.max(0, Number(next.progress) || 0),
  );
  const completed = Boolean(next.completed || progress >= habit.goal);
  const dayProgress =
    habit.format === "Yes-No"
      ? Number(completed)
      : completed
        ? habit.goal
        : progress;
  return {
    ...log,
    [habit.id]: {
      progress: dayProgress,
      completed,
      earnedXp:
        completed && !(habit.format === "Yes-No" && habit.goal > 1)
          ? habit.xp
          : 0,
    },
  };
}

export function finalizeDailyLogs(logs, habits, today = getLocalDateKey()) {
  const nextLogs = Object.fromEntries(
    Object.entries(logs).map(([date, entries]) => [date, { ...entries }]),
  );
  const dates = Object.keys(nextLogs)
    .filter((date) => date < today)
    .sort();

  habits
    .filter((habit) => habit.format === "Yes-No" && habit.goal > 1)
    .forEach((habit) => {
      let successfulDays = 0;
      dates.forEach((date) => {
        const entry = nextLogs[date][habit.id];
        if (!entry?.completed) return;
        if (!entry.finalized) {
          nextLogs[date][habit.id] = {
            ...entry,
            earnedXp: successfulDays < habit.goal ? habit.xp : 0,
            finalized: true,
          };
        }
        successfulDays += 1;
      });
    });

  return nextLogs;
}

export function getCompletedDaysBefore(habitId, date, logs) {
  return Object.entries(logs).reduce(
    (count, [logDate, entries]) =>
      logDate < date && entries[habitId]?.completed ? count + 1 : count,
    0,
  );
}
