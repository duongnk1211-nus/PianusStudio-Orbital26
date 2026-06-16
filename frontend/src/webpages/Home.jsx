import "../styles/Home.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx"

function IsLoggedIn() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);
  
  const { accessToken, setAccessToken } = useAuth();
  const [data, setData] = useState(null);
  const [displayName, setDisplayName] = useState("Loading...");
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    if (!accessToken) {
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    }
    
    const fetchData = async () => {
      const response = await fetch("http://localhost:8000/users/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        console.log("you are dumb");
      } else {
        console.log("you are the goat");
      }
      const temp = await response.json();
      setData(temp);
      setDisplayName(temp.username);
    }

    fetchData();
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [accessToken]);
  
  const handleLogout = async () => {
    setLoading(true);
    
    await fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    setAccessToken(null);
    setMenuOpen(false);
    setLoading(false);
  };
  
  const avatarUrl = "/avatar.png";
  

  return (!accessToken)
  ? (
    <div className="auth-links">
      <Link to="/login">
        <button className="auth-button login">Login</button>
      </Link>
      <Link to="/signup">
        <button className="auth-button signup">Sign Up</button>
      </Link>
    </div>
  ) : (
    <div className="user-avatar" ref={menuRef}>
      <button
        className="avatar-button"
        onClick={() => setMenuOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={menuOpen}
      >
        <div className="avatar">
          <img src={avatarUrl} alt="avatar" />
        </div>
        <span className="user-name">
          {displayName.length > 18 ? ' ' + displayName.slice(0, 15) + '...' : ' ' + displayName}
        </span>
      </button>
      
      {menuOpen && (
        <div className="avatar-menu" role="menu">
          <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
          <Link to="/settings" onClick={() => setMenuOpen(false)}>Settings</Link>
          <a href="#" onClick={(e) => {
            e.preventDefault();
            handleLogout();
          }}>{loading ? 'Processing...' : 'Log out'}</a>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="body">
      <div className="header">
        <IsLoggedIn />
        <h1>Welcome to PianusStudio</h1>
        <img src="/PianusStudio.png" alt="PianusStudio Logo" className="logo" />
        <p>Your gateway to piano music, lessons, and more...</p>
      </div>
      
      <nav>
        <Link to="/about">About Us</Link>
        <Link to="/piano-simulator">Piano Simulator</Link>
        <Link to="/lessons">Lessons</Link>
        <Link to="/library">Music Library</Link>
        <Link to="/practice-tools">Practice Tools</Link>
        <Link to="/community">Community</Link>
        <Link to="/contact">Contact Us</Link>
      </nav>
      
      <main>
        <h2>Explore Our Features</h2>
        <div className="features">
          <div className="feature-card">
            <h3>Piano Simulator</h3>
            <p>Experience playing the piano in a virtual environment.</p>
            <Link to="/piano-simulator">Try Now</Link>
          </div>
          <div className="feature-card">
            <h3>Online Lessons</h3>
            <p>Interactive tutorials to improve your piano skills.</p>
            <Link to="/lessons">Go to Lessons</Link>
          </div>
          <div className="feature-card">
            <h3>Music Library</h3>
            <p>Access classical and modern music pieces.</p>
            <Link to="/library">Browse Library</Link>
          </div>
          <div className="feature-card">
            <h3>Practice Tools</h3>
            <p>Metronome, chord finder, and more.</p>
            <Link to="/practice-tools">Try Tools</Link>
          </div>
          <div className="feature-card">
            <h3>Community Forum</h3>
            <p>Connect with other piano enthusiasts.</p>
            <Link to="/community">Join Forum</Link>
          </div>
        </div>
      </main>
      
      <footer className="footer">
        <p>&copy; 2026 PianusStudio | By Nguyen Khanh Duong & Dao Quang Linh</p>
      </footer>
    </div>
  );
}