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

export default function Learn({ P }) {
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
  const [bindingOption, setBindingOption] = useState(1);
  
  useEffect(() => {
    apiFetch('/user').then(setProfile);
  }, []);
  
  const synthRef = useRef(null);
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const completedRef = useRef(false);
  const [displayBars, setDisplayBars] = useState([]);
  const sideEffect = useMemo(() => {
    return (sym, isAttack) => {
      if (isAttack) {
        addActiveKey(sym);
      } else {
        removeActiveKey(sym);
      }
    };
  }, []);
  
  useKeyboard(profile, symMap, synthRef, barsRef, sideEffect);
  usePiano(synthRef, barsRef, rafRef, sideEffect, setDisplayBars);

  const [isStarted, setIsStarted] = useState(false);
  const chords = useMemo(() => {
    return P.breakChords();
  }, []);
  const [activeKeys, setActiveKeys] = useState(new Set());
  const currentIndexRef = useRef(-1);
  
  const isSubset = (setA, setB) => {
    if (setA.size > setB.size) return false;
    for (const item of setA) {
      if (!setB.has(item)) return false;
    }
    return true;
  };
  
  const addActiveKey = (sym) => {
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(sym);
      
      const idx = currentIndexRef.current;
      if (idx !== -1 && isSubset(chords[idx], newSet)) {
        queueMicrotask(() => handleChangeIndex(idx + 1));
      }
      return newSet;
    });
  };
  
  const removeActiveKey = (sym) => {
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(sym);
      return newSet;
    });
  };
  
  const handleChangeIndex = (id) => {
    const prev = currentIndexRef.current;
    if (prev !== -1) {
      for (const item of chords[prev]) {
        // console.log("remove " + item);
        symMap.get(item).unsetGuide();
      }
    }
    if (id >= chords.length) {
      if (!completedRef.current){
      setTimeout(() => {
        alert("Lesson completed!!!");
        goBack();
      }, 1000);
      completedRef.current = true;
    }
  }
    for (const item of chords[id]) {
      // console.log("add " + item);
      symMap.get(item).setGuide();
    }
    currentIndexRef.current = id;
    setActiveKeys(new Set());
  };
  
  const start = () => {
    setIsStarted(!isStarted);
    isStarted ? handleChangeIndex(-1) : handleChangeIndex(0);
  };
  
  return (
    <div className="Piano" style={{backgroundImage: `url(${P.backgroundImageURL})`}}>
      <button className="return-button" onClick={goBack} style={{width:'65px', marginLeft:'10px', paddingBottom:'3px'}}>Return</button>
      <div className="piano-wrapper">
        <div>
          <img src="/PianusStudio.png" style={{background: '#517edfbc'}} />
          <h1>{P.title}</h1>
          {/* <p style={{color: '#e7a53c', fontFamily: 'Dancing Script'}}>By Dao Quang Linh</p> */}
        </div>
        <button className={isStarted ? "restart-button" : "start-button"} onClick={start} style={{width:'70px', paddingBottom:'3px'}}>
          {isStarted ? "Restart" : "Start"}
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