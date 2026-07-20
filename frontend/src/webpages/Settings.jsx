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

  const optionLimit = 6;
  const [optionIndex, setOptionIndex] = useState(1);
  const incOptionIndex = () => {
    const prev = optionIndex;
    if (prev == optionLimit) {
      setOptionIndex(1);
    } else {
      setOptionIndex(prev + 1);
    }
  }
  const decOptionIndex = () => {
    const prev = optionIndex;
    if (prev == 1) {
      setOptionIndex(optionLimit);
    } else {
      setOptionIndex(prev - 1);
    }
  }

  const [savedIndex, setSavedIndex] = useState(1);

  useEffect(() => {
    setOptionIndex(profile ? profile.binding_option : 1);
    setSavedIndex(profile ? profile.binding_option : 1);
  }, [profile]);

  const [isSaving, setIsSaving] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleChangeBindingOption = (id) => async() => {
    setIsSaving(true);

    try {
      const result = await supabase.auth.getSession();
      const session = result.data.session;
      await apiFetch('/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ binding_option: id })
      });
      setSaveError(`Binding option ${id} was successfully saved!!!`);
    } catch (err) {
      setSaveError(err.message || `Failed to save the binding option.`);
    } finally {
      setIsSaving(false);
    }
    console.log("GOAT");
    console.log(saveError);

    setIsFetched(true);
  }

  return (
    <div className="settings-page" id="settings-page">
      <button className="settings-return-btn" onClick={goBack}>
        Return
      </button>
      <div className="top-bar">
        <p><img src="/PianusStudio.png" alt="PianusStudio Logo" style={{ position: 'relative', top: '4px', height: '20px', width: '20px' }} /> Pianus Studio</p>
      </div>

      <h1>Settings</h1>

      <div className="settings-container">
        <div className="key-rebinding-box">
          <div className="property-name">
            ⌨️ Key Binding:
          </div>
          <button onClick={decOptionIndex}>{"<<"}</button>
          <div className="property-current-option">
            Option {optionIndex}
          </div>
          <button onClick={incOptionIndex}>{">>"}</button>
          <button className="settings-save-btn" onClick={handleChangeBindingOption(optionIndex)}>Save</button>
        </div>
        <p className="property-saved-option">Currently saving: Option {savedIndex}</p>
      </div>
      <img src={`/KeyBinding/Option${optionIndex}.png`} />

      { isFetched && 
        <div className="modal-overlay">
          <div className="settings-save-modal">
            <p>{saveError}</p>

            <button
              className="ok-btn"
              onClick={() => setIsFetched(false)}
            >
              OK
            </button>
          </div>
        </div>
      }
    </div>
  );
}