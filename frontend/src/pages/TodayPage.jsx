import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import HabitRow from "../components/today/HabitRow";
import ProgressRing from "../components/today/ProgressRing";
import CharacterCard from "../components/today/CharacterCard";
import HabitMixCard from "../components/today/HabitMixCard";
import LevelUpModal from "../components/today/LevelUpModal";
import { getCharacterImage } from "../utils/characterLevels";
import { checkIn } from "../api/habits";
import {
  finalizeDailyLogs,
  getCompletedDaysBefore,
  getDayHabit,
  getLocalDateKey,
  updateDayHabit,
} from "../utils/dailyHabits";
import "./TodayPage.css";

const habitTypeColors = { Helpful: "#7C3AED", Harmful: "#EF4444" };

function TodayPage() {
  const { habits, dailyLogs, setDailyLogs, habitsLoading, habitsError, setHabitsError } = useOutletContext();
  const navigate = useNavigate();
  const today = getLocalDateKey();
  const [selectedDate, setSelectedDate] = useState(null);
  const viewedDate = selectedDate ?? today;
  const isPastDay = viewedDate !== today;
  const effectiveLogs = finalizeDailyLogs(dailyLogs, habits, today);
  const hasSelectedDayHistory =
    !isPastDay || Object.hasOwn(dailyLogs, viewedDate);
  const dayLog = effectiveLogs[viewedDate] ?? {};
  const viewedHabits = habits.map((habit) => {
    const dayHabit = getDayHabit(habit, dayLog);
    if (habit.format !== "Yes-No" || habit.goal <= 1)
      return {
        ...dayHabit,
        dailyCompleted: dayHabit.completed,
        goalCompleted: dayHabit.completed,
      };
    const priorDays = getCompletedDaysBefore(
      habit.id,
      viewedDate,
      effectiveLogs,
    );
    const progress = Math.min(
      habit.goal,
      priorDays + (isPastDay && dayHabit.completed ? 1 : 0),
    );
    return {
      ...dayHabit,
      progress,
      dailyCompleted: dayHabit.completed,
      goalCompleted: progress >= habit.goal,
      completed: progress >= habit.goal,
    };
  });
  const completedCount = viewedHabits.filter(
    (habit) => habit.dailyCompleted,
  ).length;
  const totalXp = Object.values(effectiveLogs)
    .flatMap(Object.values)
    .reduce((sum, entry) => sum + (entry.earnedXp || 0), 0);
  const earnedXp = Object.values(dayLog).reduce(
    (sum, entry) => sum + (entry.earnedXp || 0),
    0,
  );
  const level = Math.floor(totalXp / 100) + 1;
  const currentXp = totalXp % 100;
  const [levelNoticeSeen, setLevelNoticeSeen] = useState(() => {
    const storedLevel = localStorage.getItem("dojo.levelNoticeSeen");
    return storedLevel === null ? level : Number(storedLevel);
  });
  const showLevelUp = level > levelNoticeSeen;
  const dismissLevelUp = () => {
    localStorage.setItem("dojo.levelNoticeSeen", String(level));
    setLevelNoticeSeen(level);
  };
  const habitTypes = { Helpful: 0, Harmful: 0 };
  habits.forEach((habit) => {
    if (habitTypes[habit.type] !== undefined) habitTypes[habit.type]++;
  });
  const updateHabit = async (habit, transform) => {
    const currentDayLog = dailyLogs[today] ?? {};
    const currentCheckin = getDayHabit(habit, currentDayLog);
    const nextCheckin = transform(currentCheckin);
    try {
      await checkIn(habit.id, {
        date: today,
        completed: Boolean(nextCheckin.completed),
        progress: nextCheckin.progress ?? 0,
      });
      setDailyLogs((current) => ({
        ...current,
        [today]: updateDayHabit(current[today] ?? {}, habit, () => nextCheckin),
      }));
      setHabitsError("");
    } catch (error) {
      setHabitsError(error.message);
    }
  };
  const toggleYesNo = (habit) =>
    updateHabit(habit, (current) => ({
      completed: !current.completed,
      progress: current.completed ? 0 : 1,
    }));
  const increment = (habit) =>
    updateHabit(habit, (current) => ({
      progress: current.progress + 1,
      completed: current.progress + 1 >= habit.goal,
    }));
  const completedDays = Object.keys(dailyLogs)
    .filter((date) =>
      Object.values(dailyLogs[date] ?? {}).some((entry) => entry.completed),
    )
    .sort()
    .reverse();
  let streak = 0;
  const cursor = new Date(`${today}T12:00:00`);
  if (!completedDays.includes(today)) cursor.setDate(cursor.getDate() - 1);
  while (completedDays.includes(getLocalDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return (
    <div className="today-page">
      <div className="today-grid">
        <main className="today-main">
          <div className="today-heading">
            <div>
              <h1>Today</h1>
              <p>Turn your goals into daily action.</p>
            </div>
            <label className="today-date-control">
              <span>{isPastDay ? "Viewing day" : "Today"}</span>
              <input
                aria-label="Choose a day to view habit progress"
                type="date"
                max={today}
                value={viewedDate}
                onChange={(event) =>
                  setSelectedDate(
                    event.target.value && event.target.value !== today
                      ? event.target.value
                      : null,
                  )
                }
              />
            </label>
          </div>
          {!hasSelectedDayHistory ? (
            <div className="today-empty">
              <h2>No saved check-ins for this day.</h2>
              <p>Daily history starts when you record check-ins in Dojo.</p>
            </div>
          ) : habitsLoading ? (
            <div className="today-empty" role="status"><p>Loading habits…</p></div>
          ) : habitsError && habits.length === 0 ? (
            <div className="today-empty" role="alert">
              <h2>Could not load habits.</h2>
              <p>{habitsError}</p>
              <button onClick={() => window.location.reload()}>Try again</button>
            </div>
          ) : habits.length === 0 ? (
            <div className="today-empty">
              <img
                className="empty-character"
                src={getCharacterImage(level)}
                alt={`Dojo character, level ${level}`}
              />
              <h2>You do not have any habits yet.</h2>
              <p>Add your first habit to start building your streak.</p>
              <button onClick={() => navigate("/habits")}>
                + Add First Habit
              </button>
            </div>
          ) : (
            <>
              <CharacterCard level={level} xp={currentXp} nextLevelXp={100} />
              <section className="today-habits">
                {habitsError && <p className="habits-form-error" role="alert">{habitsError}</p>}
                <div className="section-heading">
                  <div>
                    <h2>Your Habits</h2>
                    <p>
                      {completedCount} of {viewedHabits.length} completed{" "}
                      {isPastDay ? "that day" : "today"} · {earnedXp} XP earned
                    </p>
                  </div>
                  <button
                    className="add-habit-button"
                    onClick={() => navigate("/habits")}
                  >
                    + Add Habit
                  </button>
                </div>
                <div className="habit-list">
                  {viewedHabits.map((habit) => (
                    <HabitRow
                      key={habit.id}
                      habit={habit}
                      onToggle={
                        isPastDay ? undefined : () => toggleYesNo(habit)
                      }
                      onIncrement={
                        isPastDay ? undefined : () => increment(habit)
                      }
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
        {hasSelectedDayHistory && (
          <aside className="today-sidebar">
            <section className="today-card progress-card">
              <h3>{isPastDay ? "Daily Progress" : "Today's Progress"}</h3>
              <ProgressRing
                completed={completedCount}
                total={viewedHabits.length}
                size={150}
              />
              <p className="card-description">
                {viewedHabits.length
                  ? `${Math.round((completedCount / viewedHabits.length) * 100)}% completed`
                  : "0% completed"}
              </p>
            </section>
            <HabitMixCard
              categories={habitTypes}
              colors={habitTypeColors}
              totalHabits={habits.length}
            />
            <section className="today-card streak-card">
              <h3>Current Streak</h3>
              <div className="streak-value">
                <Flame className="streak-icon" />
                <strong>{streak}</strong>
                <span>days</span>
              </div>
              <p className="card-description">
                {streak
                  ? "Keep your daily routine going."
                  : "Your streak will start when you build your daily routine."}
              </p>
            </section>
          </aside>
        )}
      </div>
      {showLevelUp && (
        <LevelUpModal
          level={level}
          totalXp={totalXp}
          onClose={dismissLevelUp}
        />
      )}
    </div>
  );
}

export default TodayPage;
