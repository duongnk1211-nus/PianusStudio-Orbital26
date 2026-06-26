import { useEffect, useRef, useState, useMemo } from "react";
import * as Tone from "tone";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { apiFetch } from "../components/API";
import { supabase } from "../components/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Note, Notes } from "../components/Note.jsx";
import { keyMaps } from "../components/keyMaps.jsx";
import { useKeyboard } from "../components/useKeyboard.jsx";
import { usePiano } from "../components/usePiano.jsx";

export default function PianoSimulator() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  const symMap = useMemo(() => {
    const map = new Map();
    for (let i = 0; i < Notes.length; i++) {
      map.set(Notes[i].sym, Notes[i]);
    }
    return map;
  }, []);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiFetch('/user').then(setProfile);
  }, []);

  const synthRef = useRef(null);
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const [displayBars, setDisplayBars] = useState([]);
  const sideEffect = useMemo(() => {
    return (sym, isAttack) => {};
  }, []);

  useKeyboard(profile, symMap, synthRef, barsRef, sideEffect);
  usePiano(synthRef, barsRef, rafRef, sideEffect, setDisplayBars);

  return (
    <div className="Piano">
      <button className="return-button" onClick={goBack} style={{width:'65px', marginLeft:'10px', marginRight:'50px', paddingBottom:'3px'}}>Return</button>
      <div className="piano-wrapper">
        <div>
        <img src="/PianusStudio.png"/>
        <h1>Piano Simulator</h1>
        </div>
        <div className="synthesia-container">
          {displayBars.map(b => (
            <div
              key={b.id}
              className={`synthesia-bar ${b.type}`}
              style={{
                left: `${b.left}px`,
                width: `${b.width - 2}px`,
                height: `${b.height}px`,
                top: `${b.top}px`,
              }}
            />
          ))}
        </div>
        <div className="key-rows">
          {Notes.map(n => n.toHTML(synthRef, barsRef, sideEffect))}
        </div>
      </div>
    </div>
  );
}