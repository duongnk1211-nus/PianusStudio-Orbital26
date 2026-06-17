import { useState, useRef } from 'react'
import { supabase } from './supabaseClient'

export default function AvatarUpload({ currentUrl, onUploadComplete }) {
  const [localPreview, setLocalPreview] = useState(null)
  const [showMessage, setShowMessage] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const displayUrl = localPreview || currentUrl

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please pick an image file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File must be under 2MB')
      return
    }

    setLocalPreview(URL.createObjectURL(file))
    uploadFile(file)
  }

  async function uploadFile(file) {
    setUploading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const formData = new FormData()
      formData.append('file', file)  // 'file' must match FastAPI's parameter name

      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/avatar`, {
        method: 'POST',
        headers: {
          // Do NOT set Content-Type here — browser sets it automatically with the correct boundary for multipart/form-data
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })
      if (!res.ok) throw new Error('Upload failed')

      const { avatar_url } = await res.json()
      setLocalPreview(null)
      onUploadComplete(avatar_url)  // Tell parent component the new URL
    } catch (err) {
      setLocalPreview(null)
      setError(err.message)
      setTimeout(() => setError(""), 200000);
    } finally {
      setUploading(false)
      setShowMessage(true)
      setTimeout(() => {
        setShowMessage(false);
      }, 200000);
    }
  }

  return (
    <div>
      {/* Clicking the image triggers the hidden file input */}
      <div className='avatar-preview' style={{ cursor: 'pointer' }}>
        <div className='avatar-profile'>
          <img src={displayUrl || './avatar.png'} alt="Avatar" onClick={() => inputRef.current.click()} />
          <span className="overlay-text">Change Image</span>
          {uploading && <p style={{ width: '400px', top: '110px' }}>Uploading...</p>}
          {error ? (<p style={{ color: 'red', width: '400px', top: '110px' }}>{error}</p>) 
          : showMessage && <p style={{color: 'green', width: '400px', textAlign: 'left', top: '110px'}}>Successful! Please wait a while to sync with system!</p>}
        </div>
      </div>

      {/* Hidden — triggered programmatically above */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"       // only show image files in file picker
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
}