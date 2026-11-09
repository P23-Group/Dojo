import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import TodayPage from "./pages/TodayPage";
import HabitsPage from "./pages/HabitsPage";
import ProgressPage from "./pages/ProgressPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<TodayPage />} />
          <Route path="habits" element={<HabitsPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
