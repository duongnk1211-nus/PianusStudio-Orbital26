import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../components/API";
import { supabase } from "../components/supabaseClient";
import AvatarUpload from "../components/AvatarUpload";
import { Bio, Username } from "../components/BioUsernameUpload";
import "../styles/Profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [slowLoad, setSlowLoad] = useState(false);

  const goBack = () => { navigate(-1); }

  useEffect(() => {
    async function load() {
      const timer = setTimeout(() => setSlowLoad(true), 3000);

      // Both fetches together, once, on mount
      const [profileData, { data: { user } }] = await Promise.all([
        apiFetch('/user'),
        supabase.auth.getUser()
      ]);
      clearTimeout(timer);
      setSlowLoad(false);

      setProfile(profileData);
      setUser(user);
    }
    load();
  }, []);


  if (!profile || !user) {
    return (
    <div>
      <p>Loading...</p>
      {slowLoad && <p style={{ color: 'gray', fontSize: '0.8rem' }}>
        Server is waking up, this may take ~30 seconds...
      </p>}
    </div>
    );
  }

  const lastSignIn = new Date(user.last_sign_in_at).toLocaleString();

  return (
    <div className='profile-page'>
      <button className='return-btn' onClick={goBack}>Return</button>
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

      <div className='pieces-container'>
        <div className='piece-wrap' id="first-piece-wrap">
          <h2 className="piece-title">Piece 1</h2>
          <button className="listen-button"n>Listen</button>
        </div>

        <div className='piece-wrap' id="second-piece-wrap">
          <h2 className="piece-title">Piece 2</h2>
          <button className="listen-button">Listen</button>
        </div>

        <div className='piece-wrap' id="third-piece-wrap">
          <h2 className="piece-title">Piece 3</h2>
          <button className="listen-button">Listen</button>
        </div>
      </div>
    </div>
  );
}