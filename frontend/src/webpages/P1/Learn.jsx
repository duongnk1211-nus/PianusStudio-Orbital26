import { useEffect, useRef, useState, useMemo } from "react";
import * as Tone from "tone";
import "../../styles/Piano.css";
import "../../styles/Synthesia.css";
import { Link, useNavigate } from "react-router-dom";
import { Note, Notes } from "../../components/Note.jsx";
import { addEffect } from "../../components/AddEffect.jsx";
import { P1 } from "../../components/PianoPieces/P1.jsx";

export default function P1Learn() {
  const navigate = useNavigate();
  const KeyMap = useMemo(() => {
    const map = {};
    for (let i = 0; i < Notes.length; i++) {
      if (Notes[i].key.length === 1) map[Notes[i].key] = Notes[i];
    }
    return map;
  }, []);
  const symMap = useMemo(() => {
    const map = {};
    for (let i = 0; i < Notes.length; i++) {
      map[Notes[i].sym] = Notes[i];
    }
    return map;
  }, []);
  const synthRef = useRef(null);
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const [displayBars, setDisplayBars] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const chords = useMemo(() => {
    return P1.breakChords();
  }, []);
  const [activeKeys, setActiveKeys] = useState(new Set());
  const currentIndexRef = useRef(-1);

  const goBack = () => {
    navigate(-1);
  };

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
        console.log("remove " + item);
        symMap[item].unsetGuide();
      }
    }
    if (id >= chords.length) {
      setTimeout(() => {
        alert("Lesson completed!");
        goBack();
      }, 1000);
      return;
    }
    for (const item of chords[id]) {
      console.log("add " + item);
      symMap[item].setGuide();
    }
    currentIndexRef.current = id;
    setActiveKeys(new Set());
  };

  const start = () => {
    setIsStarted(true);
    handleChangeIndex(0);
  };

  const sideEffect = useMemo(() => {
    return (sym, isAttack) => {
      if (isAttack) {
        addActiveKey(sym);
      } else {
        removeActiveKey(sym);
      }
    };
  }, []);

  addEffect(KeyMap, synthRef, barsRef, rafRef, setDisplayBars, sideEffect);

  return (
    <div className="Piano" style={{backgroundImage: "url('/P1.jpg')"}}>
      <button className="return-button" onClick={goBack}>Return</button>
      <div className="piano-wrapper">
        <div>
        <img src="/PianusStudio.png" style={{background: '#517edfbc'}} />
        <h1>⭐Twinkle Twinkle Little Star⭐</h1>
        <p style={{color: '#e7a53c', fontFamily: 'Dancing Script'}}>By Dao Quang Linh</p>
        </div>
        <button className={isStarted ? "restart-button" : "start-button"} onClick={start}>
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