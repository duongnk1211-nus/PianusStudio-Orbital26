import { useEffect, useRef, useState, useMemo } from "react";
import * as Tone from "tone";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { apiFetch } from "../components/API";
import { supabase } from "../components/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Note, Notes } from "../components/Note.jsx";
import { keyMaps } from "../components/keyMaps.jsx";

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

  useEffect(() => {
    for (const note of Notes) {
      note.key = " ";
    }
    const bindingOption = profile ? profile.binding_option : 1;
    const keyMap = new Map(Object.entries(keyMaps[bindingOption]));
    const noteMap = new Map();
    for (const [sym, key] of keyMap) {
      if (key !== " "){
        noteMap.set(key, symMap.get(sym));
        symMap.get(sym).key = key;
      }
    }

    const handleKeyDown = async (e) => {
      if (e.key === " ") return;
      const note = noteMap.get(e.key);
      if (note) {
        e.preventDefault();
        if (e.repeat) return;
        note.attack(synthRef, barsRef, sideEffect)();
      }
    };
    const handleKeyUp = async (e) => {
      if (e.key === " ") return;
      const note = noteMap.get(e.key);
      if (note) {
        e.preventDefault();
        note.release(synthRef, barsRef, sideEffect)();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, [profile]);

  useEffect(() => {
    synthRef.current = new Tone.Sampler({
      urls: { "D#1": "Ds1.mp3", "F#1": "Fs1.mp3", A1: "A1.mp3", C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3", A2: "A2.mp3", C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3", A3: "A3.mp3", C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", A4: "A4.mp3", C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3", A5: "A5.mp3", C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3", A6: "A6.mp3", C7: "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3", A7: "A7.mp3", C8: "C8.mp3" },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    const GROW_SPEED = 1;
    const FLY_SPEED = 1;

    const tick = () => {
      barsRef.current = barsRef.current
        .map(b => {
          if (!b.released) {
            return { ...b, height: b.height + GROW_SPEED, top: b.top - GROW_SPEED };
          } else {
            return { ...b, top: b.top - FLY_SPEED };
          }
        })
        .filter(b => b.top + b.height > -600);

      setDisplayBars([...barsRef.current]);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    for (const note of Notes) {
      note.release(synthRef, barsRef, sideEffect)();
      note.unsetGuide();
    }
    
    return () => {
      cancelAnimationFrame(rafRef.current);
      synthRef.current?.releaseAll();
      synthRef.current?.dispose();
      barsRef.current = [];
      rafRef.current = null;
      setDisplayBars([]);
    }
  }, []);

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