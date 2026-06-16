import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../components/API'
//import { supabase } from '../components/supabaseClient'
import AvatarUpload from '../components/AvatarUpload'
import '../styles/Profile.css'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  const goBack = () => {navigate(-1);}

  useEffect(() => {
    apiFetch('/user').then(setProfile)
  }, [])

  if (!profile) return <p>Loading...</p>

  return (
    <div className='profile-page'>
      <button onClick={goBack}>Return</button>
      <AvatarUpload
        currentUrl={profile.avatar_url}
        onUploadComplete={(url) => setProfile(p => ({ ...p, avatar_url: url }))}
      />
    </div>
  )
}