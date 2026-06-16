import { useState } from "react";
import { supabase } from "../components/supabaseClient";
import { Link } from "react-router-dom";
import "../styles/LoginSignup.css";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  
  const isMatch = password === confirmPassword;

  const handleSignup = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:8000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        email: email,
        username: username,
        password: password
      })
    });
    if (!response.ok) {
      const data = await response.json();
      setMessage("Error: " + data.detail);
      setLoading(false);
    } else {
      setMessage("Sign‑up successful! Check your email & Sign in using your new credentials!");
      setLoading(false);
    }
  }
  
  return (
    <div className="body-signup">
    <div className="signup-container">
    <div className="go-back">
    &larr; {" "}
    <Link to="/" style={{ color: "#030303e7" }}>
    {"Back to Home"}
    </Link>
    </div>
    <h2>Registration</h2>
    <h3>Please sign up to continue!</h3>
    <div style={{ marginBottom: "40px" }}>
    <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={e => setEmail(e.target.value)}
    style={{ width: "95%", marginBottom: "1rem" }}
    />
    <input
    type="username"
    placeholder="Username"
    value={username}
    onChange={e => setUsername(e.target.value)}
    style={{ width: "95%", marginBottom: "1rem" }}
    />
    <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={e => setPassword(e.target.value)}
    style={{ width: "95%", marginBottom: "1rem" }}
    />
    <input
    type="password"
    placeholder="Retype Password"
    value={confirmPassword}
    onChange={e => setConfirmPassword(e.target.value)}
    style={{ width: "95%", marginBottom: "1rem" }}
    />
    <p style={{
      color: isMatch ? "green" : "red",
      fontSize: "0.9rem",
      fontWeight: "bold",
    }}>
    {confirmPassword.length > 0
      ? isMatch
      ? "Passwords match ✅"
      : "Passwords do not match ❌"
      : ""}
      </p>
      </div>
      <button onClick={handleSignup} disabled={loading} style={{ borderRadius: "10px" }}>
      {loading ? "Processing..." : "Sign Up"}
      </button>
      <p style={{ marginTop: "10px", cursor: "pointer", color: "#1a1717" }}>
      Already have an account? <Link to="/login" style={{ color: "#1a17179f" }}>Log in</Link>
      </p>
      {message && <p style={{ color: message.includes("successful") ? "green" : "red" }}>{message}</p>}
      </div>
      </div >
    );
  }