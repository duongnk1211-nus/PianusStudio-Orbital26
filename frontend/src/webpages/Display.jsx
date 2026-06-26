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

export default function Display({ P }) {
  const navigate = useNavigate();
  const goBack = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
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
  const [bindingOption, setBindingOption] = useState(1);

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

  const [isPlaying, setIsPlaying] = useState(false);

  const flipPlaying = () => {
    const prev = isPlaying;
    if (prev == false) {
      if (Tone.Transport.state == "stopped") {
        P.display(synthRef, barsRef, sideEffect)();
      }
      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
      synthRef.current?.releaseAll();
    }
    setIsPlaying(!prev);
  }

  useEffect(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    const handleStop = () => {
      setIsPlaying(false);
    };
    Tone.Transport.on("stop", handleStop);
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.Transport.off("stop", handleStop);
    };
  }, []);

  return (
    <div className="Piano" style={{ backgroundImage: `url(${P.backgroundImageURL})` }}>
      <button className="return-button" onClick={goBack} style={{width:'65px', paddingBottom:'3px'}}>Return</button>
      <div className="piano-wrapper">
        <div>
        <img src="/PianusStudio.png" style={{background: '#517edfbc'}} />
        <h1>{P.title}</h1>
        {/* <p style={{color: '#e7a53c', fontFamily: 'Dancing Script'}}>By Dao Quang Linh</p> */}
        </div>
        <button className={isPlaying ? "pause-button" : "play-button"} onClick={flipPlaying}>
          {isPlaying ? "Pause" : "Play"}
        </button>
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