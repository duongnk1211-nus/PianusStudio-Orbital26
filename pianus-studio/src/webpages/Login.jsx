import { useState } from "react"
import { supabase } from "../components/supabaseClient"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAuth = async () => {
    setLoading(true)
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setMessage(error ? error.message : "Logged in successfully!")
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      setMessage(error ? error.message : "Sign‑up successful! Check your email.")
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>{isLogin ? "Log In" : "Sign Up"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <button onClick={handleAuth} disabled={loading} style={{ width: "100%", padding: "0.5rem" }}>
        {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
      </button>
      <p style={{ marginTop: "1rem", cursor: "pointer", color: "blue" }}
         onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
      </p>
      {message && <p>{message}</p>}
    </div>
  )
}
