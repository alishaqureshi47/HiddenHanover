import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../api/firebase";
import "./Header.css";

function Header({ user }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");   // ✅ send back to landing page after logout
  };

  return (
    <header className="header">
      {/* 🌿 Logo + Title */}
      <div className="header-left">
        <span className="logo">🌿</span>
        <h1 className="site-title">Hidden Hanover</h1>
        <span className="logo">🌿</span>
      </div>

      {/* 👤 Profile */}
      {user && (
        <div className="profile-wrapper">
          <div 
            className="profile-info"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="profile-avatar"
            />
            <span className="profile-name">{user.displayName}</span>
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button 
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
