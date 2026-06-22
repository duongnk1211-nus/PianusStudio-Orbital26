import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../components/API";
import { supabase } from "../components/supabaseClient";
import "../styles/Settings.css";

function KeyRebindingBox() {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    apiFetch('/user').then(setProfile);
  }, []);

  const lim = useMemo(() => 6, []);
  const [optionIndex, setOptionIndex] = useState(1);
  const incOptionIndex = () => {
    const prev = optionIndex;
    if (prev == 5) {
      setOptionIndex(1);
    } else {
      setOptionIndex(prev + 1);
    }
  }
  const decOptionIndex = () => {
    const prev = optionIndex;
    if (prev == 1) {
      setOptionIndex(5);
    } else {
      setOptionIndex(prev - 1);
    }
  }

  useEffect(() => {
    setOptionIndex(profile ? profile.binding_option : 1);
  }, [profile]);

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
  }

  return (
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
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const goBack = () => { navigate(-1); };

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
        <KeyRebindingBox />
      </div>

    </div>
  );
}