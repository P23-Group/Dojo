import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import SideBar from "../components/SideBar";
import Header from "../components/Header";
import {
  finalizeDailyLogs,
  getLocalDateKey,
  readStoredValue,
} from "../utils/dailyHabits";
import { getHabits } from "../api/habits";

import "./AppLayout.css";

function AppLayout() {
  const [habits, setHabits] = useState([]);
  const [habitsLoading, setHabitsLoading] = useState(true);
  const [habitsError, setHabitsError] = useState("");
  const [dailyLogs, setDailyLogs] = useState(() =>
    finalizeDailyLogs(
      readStoredValue("dojo.dailyLogs", {}),
      habits,
      getLocalDateKey(),
    ),
  );

  const refreshHabits = useCallback(async () => {
    setHabitsLoading(true);
    setHabitsError("");
    try {
      const result = await getHabits();
      setHabits(Array.isArray(result) ? result : []);
    } catch (error) {
      setHabitsError(error.message);
    } finally {
      setHabitsLoading(false);
    }
  }, []);
  useEffect(() => {
    refreshHabits();
  }, [refreshHabits]);
  useEffect(
    () => localStorage.setItem("dojo.dailyLogs", JSON.stringify(dailyLogs)),
    [dailyLogs],
  );
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 20);
    const timer = window.setTimeout(() => {
      setDailyLogs((current) =>
        finalizeDailyLogs(current, habits, getLocalDateKey()),
      );
    }, tomorrow.getTime() - Date.now());
    return () => window.clearTimeout(timer);
  }, [habits]);

  return (
    <div className="app-layout">
      <SideBar habits={habits} />

      <div className="app-main">
        <Header />

        <main className="app-content">
          <Outlet context={{ habits, setHabits, dailyLogs, setDailyLogs, habitsLoading, habitsError, refreshHabits, setHabitsError }} />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
