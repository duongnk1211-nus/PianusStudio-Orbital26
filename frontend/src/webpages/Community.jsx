import "../styles/Community.css";

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from "../components/API";
import { supabase } from '../components/supabaseClient'


export default function CommunityPage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilesById, setProfilesById] = useState({});
  const [commentsById, setCommentsById] = useState({});
  const [openCommentSection, setOpenCommentSection] = useState(false);
  const [activePostId, setActivePostId] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [startPosting, setStartPosting] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');

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

  async function OpenCommentSection(postId) {
    setOpenCommentSection(true);
    setActivePostId(postId);
    setNewComment('');
    try {
      const fetchedComments = await apiFetch(`/comments/${postId}`);
      if (!fetchedComments || fetchedComments.length === 0) {
        setComments([]);
        setCommentsById({});
        return;
      }
      setComments(fetchedComments);
      const uniqueUserIds = [...new Set(fetchedComments.map(c => c.user_id))];
      const entries = await Promise.all(
        uniqueUserIds.map(async userId => [userId, await get_user_by_id(userId)])
      );
      setCommentsById(Object.fromEntries(entries));
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  }

  async function handleSubmitComment(event) {
    event.preventDefault();
    if (!newComment.trim() || !activePostId) return;

    setSubmittingComment(true);
    try {
      const createdComment = await apiFetch(`/post/comment?post_id=${activePostId}`, {
        method: 'POST',
        body: JSON.stringify({ content: newComment.trim() }),
      });

      const commentPayload = Array.isArray(createdComment)
        ? createdComment[0]
        : createdComment;

      if (commentPayload) {
        setComments(prev => [commentPayload, ...prev]);
        if (user?.id) {
          setCommentsById(prev => ({
            ...prev,
            [user.id]: user,
          }));
        }
      }
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  }

  async function handleCreatePost(event) {
    event.preventDefault();
    if (!postTitle.trim() || !postDescription.trim()) return;

    try {
      const result = await supabase.auth.getSession();
      const session = result.data.session;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ title: postTitle.trim(), description: postDescription.trim() })
      });
      if (!res.ok) throw new Error('Create post failed!');
      const json = await res.json();
      setPosts(prev => [json[0] ?? json, ...prev]);
      setPostTitle('');
      setPostDescription('');
      setStartPosting(false);
    } catch (err) {
      console.log(err.message);
    }
  }

  if (loading) {
      return (
        <div>Server is waking up...</div>
      )
    }

    return (
      <div className="community-page">
        <div className="community-page-buttons">
          <button style={{ width: '120px', fontWeight: 'bold', letterSpacing: '1px' }} onClick={() => navigate("/")}>Return</button>
          <button onClick={() => setStartPosting(true)} style={{ background: 'linear-gradient(135deg, #31eaff, #2736de)', border: 'None', color: '#1a06f2' }} >+ Create Post</button>
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
                <h5 onClick={() => OpenCommentSection(post.id)}>Comment</h5>
                <h4>{created_at}</h4>
              </div>
            </div>
          )
        })}
        {openCommentSection && (
          <div className="community-page-comment-overlay" onClick={() => setOpenCommentSection(false)}>
            <div className="community-page-comment-section" onClick={(e) => e.stopPropagation()}>
              <button
                className="community-page-comment-close"
                onClick={() => {
                  setOpenCommentSection(false)
                  setComments([])
                  setCommentsById({})
                }}
                aria-label="Close comments"
              >
                ×
              </button>
              <div className="community-page-comment-list">
                {comments?.length > 0 ? [...comments]
                  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                  .map(comment => {
                    const profile = commentsById[comment.user_id];
                    const avatar_url = profile?.avatar_url || "/avatar.png";
                    const rawRole = profile?.role;
                    const role = (typeof rawRole === 'string' ? rawRole.trim() : rawRole);
                    const displayRole = role && role !== 'null' && role !== 'undefined' ? role : '';
                    const created_at = new Date(comment.created_at).toLocaleString();

                    return (
                      <div className="community-page-comments" key={comment.id}>
                        <img src={avatar_url} alt="avatar" />
                        <div className="community-page-comments-body">
                          <p>{profile?.username}{displayRole ? ` (${displayRole})` : ''}</p>
                          <h1>{comment.content}</h1>
                          <h2>{created_at}</h2>
                        </div>
                      </div>
                    );
                  }) : <p className="community-page-comment-empty">No comments yet.</p>}
              </div>
              <form className="community-page-comment-form" onSubmit={handleSubmitComment}>
                <textarea
                  className="community-page-comment-input"
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                  placeholder="Write a comment..."
                  rows="3"
                />
                <button type="submit" className="community-page-comment-send" disabled={!newComment.trim() || submittingComment}>
                  {submittingComment ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        )}
        {startPosting && (
          <div className="community-page-comment-overlay" onClick={() => setStartPosting(false)}>
            <div className="community-page-comment-section" onClick={(e) => e.stopPropagation()}>
              <button
                className="community-page-comment-close"
                onClick={() => setStartPosting(false)}
                aria-label="Close create post"
              >
                ×
              </button>
              <form className="community-page-post-form" onSubmit={handleCreatePost}>
                <h3>Create Post</h3>
                <label className="community-page-post-field">
                  <span>Title</span>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(event) => setPostTitle(event.target.value)}
                    placeholder="Enter a title"
                  />
                </label>
                <label className="community-page-post-field">
                  <span>Description</span>
                  <textarea
                    value={postDescription}
                    onChange={(event) => setPostDescription(event.target.value)}
                    placeholder="Write your post here..."
                    rows="6"
                  />
                </label>
                <button type="submit" className="community-page-comment-send">
                  Upload
                </button>
              </form>
            </div>
          </div>
        )}
      </div >
    )
  }