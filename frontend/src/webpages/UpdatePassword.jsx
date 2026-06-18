import { useState } from "react";
import { supabase } from "../components/supabaseClient";
import { useNavigate } from "react-router-dom";
import "../styles/LoginSignup.css";

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    
    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Password updated successfully! Redirecting...')
      setTimeout(() => {
        setLoading(false)
        navigate("/") // Redirect to dashboard or home page after successful login
      }, 2000) // 2-second delay before redirecting
    }
    setLoading(false)
  }
  
  return (
    <div className="LoginSignup">
      <div className="updatepassword-container">
        <p style={{color: '#000000', fontWeight: 'bold', marginBottom:'30px'}}>Reset password:</p>    
        <form onSubmit={handleUpdatePassword}>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">{loading ? 'Processing...' : 'Update Password'}</button>
          <p style={{marginTop: '10px', color: message.includes("Error") ? "red" : "green"}}>{message}</p>
        </form>
      </div>
    </div>
  );
}
