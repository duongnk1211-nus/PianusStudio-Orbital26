import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../components/API";
import { PieceList } from "../components/PieceList";
import "../styles/Profile.css";

export default function ViewProfile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const goBack = () => { navigate(-1); }

  useEffect(() => {
    apiFetch(`/profile/${username}`)
      .then(setProfile)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [username]);


  if (!profile || loading) {
    return (
      <div>
        <p>Server is waking up, this may take ~30 seconds...</p>
      </div>
    );
  }

  const lastSignIn = new Date(profile.last_sign_in_at).toLocaleString();
  const rawRole = profile?.role;
  const role = (typeof rawRole === 'string' ? rawRole.trim() : rawRole);
  const displayRole = role && role !== 'null' && role !== 'undefined' ? role : '';

  return (
    <div className='profile-page'>
      <button className='return-btn' onClick={goBack}>Return</button>
      <div className='avatar-wrap'>
        <p><img src="/PianusStudio.png" alt="PianusStudio Logo" style={{ position: 'relative', top: '4px', height: '20px', width: '20px' }} /> Pianus Studio</p>
        {profile.role && <p>{profile?.role || ''}</p>}
        <div className='avatar-preview' style={{ cursor: 'pointer' }}>
          <div className='avatar-profile'>
            <img src={profile.avatar_url || './avatar.png'} alt="Avatar" />
          </div>
        </div>
        <div className='profileName-container'>
          <p>
            {profile.username + (displayRole === '' ? '' : " (" + displayRole + ")")}
          </p>
        </div>
      </div>
      <div className='bio-wrap'>
        <p style={{ position: 'absolute', top: '40px', left: '30px', marginBottom: '0px' }}>Bio:</p>
        <div className='bio-container'>
          <p>{profile.bio}</p>
        </div>
        <p style={{ position: 'absolute', top: '220px' }}>Top Achievement:</p>
        <div className='profile-top-score'>
          <p>Piece: <span style={{ color: '#efac48' }}>{PieceList[profile.top_piece_number - 1].title}</span></p>
          <p>Top score: <span style={{ color: '#efac48' }}>{profile.top_score}</span></p>
        </div>
        <p style={{ position: 'absolute', bottom: '40px', left: '30px', marginBottom: '0px' }}>Last signed in: {lastSignIn}</p>
      </div>
    </div>
  );
}