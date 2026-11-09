import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./SettingsPage.css";

function SettingsPage() {
  const { setHabits, setDailyLogs } = useOutletContext();
  const [resetDone, setResetDone] = useState(false);
  const resetData = () => {
    if (!window.confirm("Reset all habits and check-in history? This cannot be undone.")) return;
    localStorage.removeItem("dojo.habits");
    localStorage.removeItem("dojo.dailyLogs");
    localStorage.removeItem("dojo.levelNoticeSeen");
    setHabits([]);
    setDailyLogs({});
    setResetDone(true);
  };

  return (
    <div className="settings-page">
      <header>
        <h1>Settings</h1>
        <p>Reset your local test data whenever you want to start fresh.</p>
      </header>
      <section className="settings-card">
        <h2>Test data</h2>
        <div className="settings-row">
          <div>
            <strong>Reset all data</strong>
            <p>Remove all habits, check-ins, and earned XP from this browser.</p>
          </div>
          <button className="settings-reset-button" type="button" onClick={resetData}>
            Reset data
          </button>
        </div>
        {resetDone && <p className="settings-reset-status" role="status">Data reset. You can start testing from zero.</p>}
      </section>
    </div>
  );
}

export default SettingsPage;
