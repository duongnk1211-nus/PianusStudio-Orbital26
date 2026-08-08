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
  const [postingRecordDescription, setPostingRecordDescription] = useState('');
  const [optionIndex, setOptionIndex] = useState('None');

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

  const [recordUploadMessage, setRecordUploadMessage] = useState(null); 

  useEffect(() => {
    if (optionIndex == 'None') {
      setRecordUploadMessage(null);
      return;
    }

    let cancelled = false;

    const checkRecord = async () => {
      try {
        const result = await supabase.auth.getSession();
        const session = result.data.session;
        await apiFetch(`/record/${optionIndex}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (cancelled) return;
        setRecordUploadMessage(null);
      } catch (err) {
        setRecordUploadMessage(`Error: your recording ${optionIndex} is not available.`);
      }
    };

    checkRecord();

    return () => {
      cancelled = true;
    };
  }, [optionIndex]);

  function incOptionIndex() {
    setOptionIndex(prev => (prev === 3 ? 'None' : prev === 'None' ? 1 : prev + 1));
  }

  function decOptionIndex() {
    setOptionIndex(prev => (prev === 1 ? 'None' : prev === 'None' ? 3 : prev - 1));
  }

  async function handleCreatePost(event) {
    event.preventDefault();
    const title = postTitle.trim();
    const description = postDescription.trim();
    let record1 = null;
    let title_record1 = null;
    if(optionIndex !== 'None') {
      if(optionIndex === 1) {
        record1 = user?.first_record;
      }
      if(optionIndex === 2) {
        record1 = user?.second_record;
      }
      if(optionIndex === 3) {
        record1 = user?.third_record;
      }
      title_record1 = postingRecordDescription.trim();
      if(record1 === null) title_record1 = null;
    }

    if (!title || !description) return;
    if (title.length > 100 || description.length > 1500) return;

    try {
      const result = await supabase.auth.getSession();
      const session = result.data.session;
      const fetchResult = await apiFetch(`/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ title, description, record1, title_record1 })
      });
      const json = fetchResult;
      setPosts(prev => [json[0] ?? json, ...prev]);
      setPostTitle('');
      setPostDescription('');
      setStartPosting(false);
    } catch (err) {
      console.log(err.message || `Create post failed!`);
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
        let isRecordAvailable = false;
        let postedRecordTitle = null;
        let postedRecordUrl = null;
        if(post.record1) {
          isRecordAvailable = true;
          postedRecordTitle = post.title_record1 || 'Untitled';
          if(postedRecordTitle.length > 50) {
            recordTitle = recordTitle.slice(0, 50) + '...';
          }
          postedRecordUrl = post.record1;
        }

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
            {isRecordAvailable && (
              <div className="community-page-posted-record">
                <p>{postedRecordTitle || 'Untitled'}</p>
                <button onClick={() => navigate('/recording-for-posts', { state: { focus: postedRecordUrl } })}>Play</button>
              </div>
            )}
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
        <div className="community-page-post-overlay" onClick={() => setStartPosting(false)}>
          <div className="community-page-post-section" onClick={(e) => e.stopPropagation()}>
            <button
              className="community-page-post-close"
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
                  onChange={(event) => setPostTitle(event.target.value.slice(0, 100))}
                  placeholder="Enter a title"
                />
              </label>
              <label className="community-page-post-field">
                <span>Description</span>
                <textarea
                  value={postDescription}
                  onChange={(event) => setPostDescription(event.target.value.slice(0, 1500))}
                  placeholder="Write your post here..."
                  rows="6"
                />
              </label>
              <label className="community-page-post-field">
                <span>Choose your recording</span>
                <input
                  type="text"
                  value={postingRecordDescription}
                  onChange={(event) => setPostingRecordDescription(event.target.value.slice(0, 1500))}
                  placeholder={optionIndex === 'None' ? "Your recording will not appear if there is no selected recording" : "Your recording title"}
                />
                <div className="community-page-posting-record">
                  <button type="button" onClick={decOptionIndex}>{"<<"}</button>
                  <div className="property-current-option">
                    {optionIndex === 'None' ? 'None' : 'Recording' + ' ' + optionIndex}
                  </div>
                  <button type="button" onClick={incOptionIndex}>{">>"}</button>
                </div>
                {recordUploadMessage && 
                  <p className="record-upload-message">{recordUploadMessage}</p>}
              </label>
              <button type="submit" className="community-page-post-send" disabled={recordUploadMessage}>
                Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </div >
  )
}