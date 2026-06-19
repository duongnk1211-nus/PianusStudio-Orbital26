import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Settings.css";

function KeyRebindingBox() {
  const optionNumber = 5;
  const [index, setIndex] = useState(1);

  const setPrev = () => { setIndex(index === 1 ? 5 : index - 1); };
  const setNext = () => { setIndex(index === 5 ? 1 : index + 1); };

  return (
    <div className="key-rebinding-box">
      <div className="property-name">
        ⌨️ Key Binding:
      </div>
      <button onClick={setPrev}>{"<<"}</button>
      <div className="property-current-option">
        Option {index}
      </div>
      <button onClick={setNext}>{">>"}</button>
      <button className="preview-button">Preview</button>
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();

  const goBack = () => { navigate(-1); }

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