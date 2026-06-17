import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../components/API'
import { supabase } from '../components/supabaseClient'
import AvatarUpload from '../components/AvatarUpload'
import { Bio, Username } from '../components/BioUsernameUpload'
import '../styles/Profile.css'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [user, setUser] = useState(null)

  const goBack = () => { navigate(-1); }

  useEffect(() => {
    async function load() {
      // Both fetches together, once, on mount
      const [profileData, { data: { user } }] = await Promise.all([
        apiFetch('/user'),
        supabase.auth.getUser()
      ])
      setProfile(profileData)
      setUser(user)
    }
    load()
  }, [])


  if (!profile || !user) return <p>Loading...</p>

  const lastSignIn = new Date(user.last_sign_in_at).toLocaleString();

  return (
    <div className='profile-page'>
      <button onClick={goBack}>Return</button>
      <div className='avatar-wrap'>
        <p><img src="/PianusStudio.png" alt="PianusStudio Logo" style={{ position: 'relative', top: '4px', height: '20px', width: '20px' }} /> Pianus Studio</p>
        {profile.role && <p>{profile?.role || ''}</p>}
        <AvatarUpload
          currentUrl={profile.avatar_url}
          onUploadComplete={(url) => setProfile(p => ({ ...p, avatar_url: url }))}
        />
        <Username 
          currentName={profile.username}
          onChangeComplete={(name) => setProfile(p => ({ ...p, username: name }))}
        />
      </div>
      <div className='bio-wrap'>
        <p style={{ position: 'absolute', top: '40px', left: '30px', marginBottom: '0px' }}>Bio:</p>
        <Bio
          currentBio={profile.bio}
          onChangeComplete={(bio) => setProfile(p => ({ ...p, bio: bio }))}
        />
        <p style={{ position: 'absolute', bottom: '40px', left: '30px', marginBottom: '0px' }}>Last signed in: {lastSignIn}</p>
      </div>
    </div>
  )
}