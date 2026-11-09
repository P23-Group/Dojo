import { useRef, useState } from "react";
import "./Header.css";
import { Bell, Search } from "lucide-react";

function Header({ isAuthenticated = false, userName = "User" }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef(null);
  const openSearch = () => {
    setSearchOpen((open) => !open);
    if (!searchOpen) window.setTimeout(() => searchInput.current?.focus(), 120);
  };

  return (
    <header className="app-header">
      <div className="header-user">
        <div
          className={`header-search-container ${searchOpen ? "search-open" : ""}`}
        >
          <button
            className="header-search-button"
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={openSearch}
          >
            <Search size={20} />
          </button>
          <div className="header-search">
            <input
              ref={searchInput}
              type="search"
              placeholder="Search habits..."
              aria-label="Search habits"
              tabIndex={searchOpen ? 0 : -1}
            />
          </div>
        </div>

        <button
          className="notification-button"
          type="button"
          aria-label="Notifications"
        >
          <Bell />
        </button>

        <a
          className="header-user-link"
          href={isAuthenticated ? "/profile" : "/login"}
          aria-label={
            isAuthenticated
              ? "Open user profile"
              : "Sign in or create an account"
          }
        >
          <span className="user-avatar">
            {userName.charAt(0).toUpperCase()}
          </span>
          <span className="user-info">
            <span className="user-name">{userName}</span>
          </span>
        </a>
      </div>
    </header>
  );
}

export default Header;
