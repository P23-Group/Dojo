import { NavLink } from "react-router-dom";
import {
  House,
  TrendingUp,
  ChartNoAxesColumn,
  ChartPie,
  Settings,
} from "lucide-react";

import "./SideBar.css";

const categoryConfig = [
  { name: "All habits", color: "#7C3AED" },
  { name: "Health", color: "#22C55E" },
  { name: "Learning", color: "#3B82F6" },
  { name: "Productivity", color: "#F59E0B" },
  { name: "Dangerous", color: "#EF4444" },
];

function getCategory(habit) {
  if (habit.type === "Harmful") return "Dangerous";
  if (habit.category === "Fitness") return "Health";

  return habit.category;
}

function SideBar({ habits = [] }) {
  const categories = categoryConfig.map((category) => {
    const count =
      category.name === "All habits"
        ? habits.length
        : habits.filter((habit) => getCategory(habit) === category.name).length;

    return { ...category, count };
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-symbol">D</div>
        <span className="logo-name">Dojo</span>
      </div>

      <p className="sidebar-section-title">MENU</p>

      <nav className="sidebar-navigation" aria-label="Main navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <House size={20} />
          <span>Today</span>
        </NavLink>

        <NavLink
          to="/habits"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <ChartNoAxesColumn size={20} />
          <span>Habits</span>
        </NavLink>

        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <TrendingUp size={20} />
          <span>Progress</span>
        </NavLink>

        <NavLink
          to="/stats"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <ChartPie size={20} />
          <span>Stats</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-divider"></div>

      <div className="sidebar-categories">
        <p className="sidebar-section-title">CATEGORIES</p>

        <div className="category-list">
          {categories.map((category) => (
            <button className="category-link" key={category.name} type="button">
              <span
                className="category-dot"
                style={{ backgroundColor: category.color }}
              ></span>

              <span className="category-name">{category.name}</span>

              <span className="category-count">{category.count}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
