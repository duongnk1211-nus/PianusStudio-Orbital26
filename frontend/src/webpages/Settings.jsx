import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../components/API";
import { supabase } from "../components/supabaseClient";
import "../styles/Settings.css";

export default function SettingsPage() {
  const navigate = useNavigate();
  const goBack = () => { navigate(-1); };

  const [profile, setProfile] = useState(null);
  useEffect(() => {
    apiFetch('/user').then(setProfile);
  }, []);

  const lim = useMemo(() => 6, []);
  const [optionIndex, setOptionIndex] = useState(1);
  const incOptionIndex = () => {
    const prev = optionIndex;
    if (prev == 6) {
      setOptionIndex(1);
    } else {
      setOptionIndex(prev + 1);
    }
  }
  const decOptionIndex = () => {
    const prev = optionIndex;
    if (prev == 1) {
      setOptionIndex(6);
    } else {
      setOptionIndex(prev - 1);
    }
  }

  useEffect(() => {
    setOptionIndex(profile ? profile.binding_option : 1);
  }, [profile]);

  const [savedIndex, setSavedIndex] = useState(profile ? profile.binding_option : 1);

  const handleChangeBindingOption = (id) => async() => {
    const result = await supabase.auth.getSession();
    const session = result.data.session;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ binding_option: id })
    });
    if (!res.ok) throw new Error('Update binding option failed!');
    setSavedIndex(id);
  }

  return (
    <div className="Settings">
      <button className="return-button" onClick={goBack}>
        Return
      </button>
      <div className="top-bar">
        <p><img src="/PianusStudio.png" alt="PianusStudio Logo" style={{ position: 'relative', top: '4px', height: '20px', width: '20px' }} /> Pianus Studio</p>
      </div>

      <h1>Settings</h1>

      <div className="settings-wrap">
        <div className="key-rebinding-box">
          <div className="property-name">
            ⌨️ Key Binding:
          </div>
          <button onClick={decOptionIndex}>{"<<"}</button>
          <div className="property-current-option">
            Option {optionIndex}
          </div>
          <button onClick={incOptionIndex}>{">>"}</button>
          <button className="save-button" onClick={handleChangeBindingOption(optionIndex)}>Save</button>
        </div>
        <p className="property-saved-option">Currently saving: Option {savedIndex}</p>
      </div>
      <img src={`/KeyBinding/Option${optionIndex}.png`} />
    </div>
  );
}