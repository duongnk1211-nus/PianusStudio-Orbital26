import { useState } from "react";
import { supabase } from "../components/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import '../styles/LoginSignup.css';
import { useAuth } from "../context/AuthContext.jsx"

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setAccessToken } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        username: username,
        password: password
      })
    });
    if (!response.ok) {
      const data = await response.json();
      setMessage("Error: " + data.detail);
      setLoading(false);
    } else {
      setMessage("Logged in successfully! Redirecting...");
      const data = await response.json();
      setAccessToken(data.access_token);
      setTimeout(() => {
        setLoading(false);
        navigate("/"); // Redirect to dashboard or home page after successful login
      }, 3000); // 3-second delay before redirecting
    }
  }
  
  // const handleForgotPassword = async (e) => {
  //   e.preventDefault()
  //   const { error } = await supabase.auth.resetPasswordForEmail(email, {
  //     redirectTo: 'https://pianus-studio-orbital26.vercel.app/update-password',
  //   });
    
  //   if (error) {
  //     setMessage('Error: ' + error.message);
  //   } else {
  //     setMessage('Password reset email sent! Check your inbox.');
  //   }
  // }
  
  return (
    <div className="body-login">
    <div className="login-container">
    <div className="go-back">
    &larr; {""}
    <Link to="/" style={{ color: "#030303e7" }}>
    {"Back to Home"}
    </Link>
    </div>
    <h2>Log In</h2>
    <h3 style={{ fontFamily: 'Amadeus', fontSize: "1.0rem", marginBottom: "1rem", color: "#070505c8" }}>Please log in to continue!</h3>
    <input
    type="username"
    placeholder="Username"
    value={username}
    onChange={e => setUsername(e.target.value)}
    style={{ width: "95%", marginBottom: "1rem", marginTop: "10px" }}
    />
    <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={e => setPassword(e.target.value)}
    style={{ width: "95%", marginBottom: "10px" }}
    />
    {/* <p style={{ marginLeft: "10px", marginBottom: "50px", color: "#1a1717", textAlign: 'left', fontSize: '14px' }}>Forgot Password ? Click <a href="#" onClick={handleForgotPassword} style={{cursor: "pointer", color: '#000000a5'}}>here</a> to reset!</p> */}
    <button onClick={handleLogin} disabled={loading} style={{ width: "40%", padding: "0.5rem", borderRadius: "5px" }}>
    {loading ? "Processing..." : "Sign In"}
    </button>
    <p style={{ marginTop: "10px", cursor: "pointer", color: "#1a1717" }}>
    Need an account? <Link to="/signup" style={{ color: "#1a1717e7" }}>Sign up</Link>
    </p>
    {message && <p style={{ color: message.includes("Error") ? "red" : "green" }}>{message}</p>}
    </div>
    </div>
  );
}