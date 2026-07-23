import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../components/API";
import { supabase } from "../components/supabaseClient";
import AvatarUpload from "../components/AvatarUpload";
import { Bio, Username } from "../components/BioUsernameUpload";
import { PieceList } from "../components/PieceList";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [slowLoad, setSlowLoad] = useState(false);
  const [scores, setScores] = useState(null);
  const [maxScore, setMaxScore] = useState(null);

  const goBack = () => { navigate(-1); }

  useEffect(() => {
    async function load() {
      const timer = setTimeout(() => setSlowLoad(true), 3000);

      // Both fetches together, once, on mount
      const [profileData, { data: { user } }, listScores] = await Promise.all([
        apiFetch('/user'),
        supabase.auth.getUser(),
        apiFetch('/user/scores')
      ]);
      clearTimeout(timer);
      setSlowLoad(false);

      setProfile(profileData);
      setUser(user);
      setScores(listScores);
      setMaxScore(listScores.reduce((max, obj) => obj.top_score > max.top_score ? obj : max));
    }
    load();
  }, [scores]);

  const [isRecorded, setIsRecorded] = useState([false, false, false]);

  async function updateRecordings() {
    try {
      const result = await supabase.auth.getSession();
      const session = result.data.session;
      const data = await apiFetch('/records', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
      });

      const row = data?.[0];
      if (!row) {
        console.warn('updateRecordings: /records returned no row', data);
        setIsRecorded([false, false, false]);
        return;
      }

      setIsRecorded([
        Boolean(row.first_record),
        Boolean(row.second_record),
        Boolean(row.third_record),
      ]);
    } catch (err) {
      console.error('updateRecordings failed:', err);
      setIsRecorded([false, false, false]);
    }
  }

  useEffect(() => {
    updateRecordings();
  }, []);

  const [deleteError, setDeleteError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteRecording = (id) => async () => {
    try {
      const result = await supabase.auth.getSession();
      const session = result.data.session;
      await apiFetch(`/record/${id + 1}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        }
      });
      setDeleteError(`Recording ${id + 1} was successfully deleted!!!`);
    } catch (err) {
      console.error(`handleDeleteRecording(${id}) failed:`, err);
      setDeleteError(err.message || `Failed to delete recording ${id + 1}. Please try again.`);
    } finally {
      setShowDeleteDialog(true);
      updateRecordings();
    }
  }

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
    <div className='profile-page' id="profile-page">
      <button className='return-btn' onClick={goBack}>Return</button>
      <div className='avatar-section'>
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
      <div className='bio-section'>
        <p style={{ position: 'absolute', top: '40px', left: '30px', marginBottom: '0px' }}>Bio:</p>
        <Bio
          currentBio={profile.bio}
          onChangeComplete={(bio) => setProfile(p => ({ ...p, bio: bio }))}
        />
        <p style={{position: 'absolute', top:'250px'}}>Top Achievement:</p>
        <div className='profile-top-score'>
          <p>Piece: <span style={{color: '#efac48'}}>{PieceList[maxScore.piece_number-1].title}</span></p>
          <p>Top score: <span style={{color: '#efac48'}}>{maxScore.top_score}</span></p>
        </div>
        <p style={{ position: 'absolute', bottom: '40px', left: '30px', marginBottom: '0px' }}>Last signed in: {lastSignIn}</p>
      </div>

      <h1>User's Personal Pieces</h1>

      <div className="recordings-container">
        {[1, 2, 3].map((num) => {
          const idx = num - 1;
          return (
            <div className="recording-item" key={num}>
              <h2 className="recording-title">Piece {num}</h2>
              <div className="recording-options">
                <button 
                  className={`listen-btn ${isRecorded[idx] ? "" : "disabled"}`}
                  onClick={() => navigate('/recording', { state: { focus: num } })}
                >
                  Listen
                </button>
                <button
                  className={`delete-btn ${isRecorded[idx] ? "" : "disabled"}`}
                  onClick={handleDeleteRecording(idx)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}

        {showDeleteDialog && (
          <div className="modal-overlay">
            <div className="deleted-modal">
              <p>{deleteError}</p>      
              <button
                className="ok-btn"
                onClick={() => setShowDeleteDialog(false)}
              >
                OK
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}