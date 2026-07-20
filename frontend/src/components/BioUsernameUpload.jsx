import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { apiFetch } from "./API";
import "../styles/Profile.css";

export function Username({ currentName, onChangeComplete }) {
  const [name, setName] = useState(currentName || '');
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [profile, setProfile] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    apiFetch('/user').then(setProfile);
  }, []);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  function handleUsernameChange(e) {
    const newName = e.target.value;
    if (newName.length > 30) {
      setError("Username cannot be over than 30 characters");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (newName.includes(" ")) {
      setError("Username cannot have space");
      setTimeout(() => setError(""), 2000);
      return;
    }
    setName(newName);
  }

  function handleBlur() {
    setEditing(false);
    setName(currentName || '');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      setEditing(false);
      updateName(name);
    } else if (e.key === 'Escape') {
      setName(currentName || '');
      setEditing(false);
    }
  }

  async function updateName(newName) {
    setUploading(true);
    try {
      const result = await supabase.auth.getSession();
      const session = result.data.session;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ username: newName })
      });
      if (!res.ok) throw new Error('Upload username failed!');
      const { name } = await res.json();
      onChangeComplete(name);
    } catch (err) {
      setName(currentName || '');
      setError(err.message);
      setTimeout(() => setError(""), 2000);
    } finally {
      setUploading(false);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    }
  }

  const rawRole = profile?.role;
  const role = (typeof rawRole === 'string' ? rawRole.trim() : rawRole);
  const displayRole = role && role !== 'null' && role !== 'undefined' ? role : '';

  return (
    <div className='profile-name-container'>
      {editing ? (
        <input
          id="profile-username-input"
          ref={inputRef}
          type="text"
          value={name}
          onBlur={handleBlur}
          onChange={handleUsernameChange}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <p onClick={() => setEditing(true)}>
          {name + (displayRole === '' ? '' : " (" + displayRole + ")")}
        </p>
      )}
      {uploading && <p style={{ color: '#0000008c',  top: '110px' }}>Uploading...</p>}
      {error ? (<p style={{ color: 'red',  top: '110px' }}>{error}</p>)
        : showMessage && <p style={{ color: 'green', width: '700px', top: '110px', textAlign: 'left' }}>Successful! Please wait a while to sync with system!</p>}
    </div>
  )
}

export function Bio({ currentBio, onChangeComplete }) {
  const [bio, setBio] = useState(currentBio || '');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  function handleBioChange(e) {
    const newBio = e.target.value;
    if (newBio.length > 800) {
      setError("Bio length cannot be over 800 characters including whitespace");
      return;
    }
    setBio(newBio);
  }

  function handleBlur() {
    setIsEditing(false);
    setBio(currentBio || '');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      updateBio(bio);
    } else if (e.key === 'Escape') {
      setBio(currentBio || '');
      setIsEditing(false);
    }
  }

  async function updateBio(newBio) {
    setUploading(true);
    try {
      const result = await supabase.auth.getSession();
      const session = result.data.session;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ bio: newBio })
      });
      if (!res.ok) throw new Error('Upload bio failed');
      const { bio } = await res.json();
      onChangeComplete(bio);
    } catch (err) {
      setBio(currentBio || '');
      setError(err.message);
      setTimeout(() => setError(""), 2000);
    } finally {
      setUploading(false);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    }
  }

  return (
    <div 
      className='bio-container'
      onClick={() => !isEditing && !bio && setIsEditing(true)}
      style={!bio && !isEditing ? { cursor: 'pointer' } : {}}
    >
      {isEditing ? (
        <input
          id="profile-bio-input"
          ref={inputRef}
          type="text"
          value={bio}
          onChange={handleBioChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <p onClick={() => setIsEditing(true)}>{bio}</p>
      )}
      {uploading && <p>Uploading...</p>}
      {error ? (<p style={{ color: 'red' }}>{error}</p>)
        : showMessage && <p style={{ color: 'green', width: '700px', textAlign: 'left' }}>Successful! Please wait a while to sync with system!</p>}
    </div>
  )
}