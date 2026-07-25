import "../styles/Community.css";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from "../components/API";
import { supabase } from '../components/supabaseClient'


export default function CommunityPage() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true);
  const [profilesById, setProfilesById] = useState({});

  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      // fast-path: if there's definitely no session, skip the wait entirely
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }

      try {
        const [userData, listPosts] = await Promise.all([
          apiFetch('/user'),
          apiFetch('/posts')
        ]);
        setUser(userData);
        setPosts(listPosts);
      } catch (err) {
        console.error(err);
        navigate('/login'); // covers real auth failures (expired/invalid token, etc.)
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function get_user_by_id(id) {
    try {
      const result = await apiFetch(`/profile-by-id/${id}`)
        .catch(err => console.error(err))
        .finally(() => setLoading(false));

      console.log(result)
      return result;
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    async function loadProfiles() {
      const uniqueUserIds = [...new Set(posts.map(p => p.user_id))];
      const entries = await Promise.all(
        uniqueUserIds.map(async id => [id, await get_user_by_id(id)])
      );
      setProfilesById(Object.fromEntries(entries));
    }
    if (posts.length > 0) loadProfiles();
  }, [posts]);


  if(loading) {
    return (
      <div>Server is waking up...</div>
    )
  }

  return (
    <div className="community-page">
      <div className="community-page-buttons">
        <button style={{ width: '120px', fontWeight: 'bold', letterSpacing: '1px' }} onClick={() => navigate("/")}>Return</button>
        <button style={{ background: 'linear-gradient(135deg, #31eaff, #2736de)', border: 'None', color: '#1a06f2' }} >+ Create Post</button>
      </div>
      {posts.map(post => {
        const profile = profilesById[post.user_id];
        const avatar_url = profile?.avatar_url || "/avatar.png";
        const rawRole = profile?.role;
        const role = (typeof rawRole === 'string' ? rawRole.trim() : rawRole);
        const displayRole = role && role !== 'null' && role !== 'undefined' ? role : '';
        const created_at = new Date(post.created_at).toLocaleString()

        return (
          <div className="community-page-post" key={post.id}>
            <div
              className="community-page-post-header"
              onClick={() => navigate(`/user-profile/${profile?.username}`)}
              role="button"
              tabIndex={0}
            >
              <img src={avatar_url} alt="avatar" />
              <p>{profile?.username}{displayRole ? ` (${displayRole})` : ''}</p>
            </div>
            <h2>{post.title}</h2>
            <h3>{post.description}</h3>
            <div className="community-page-post-footer">
              <h5>Comment</h5>
              <h4>{created_at}</h4>
            </div>
          </div>
        )
      })}
    </div>
  )
}