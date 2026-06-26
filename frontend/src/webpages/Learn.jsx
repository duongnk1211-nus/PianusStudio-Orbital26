import { useEffect, useRef, useState, useMemo } from "react";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { apiFetch } from "../components/API";
import { useNavigate } from "react-router-dom";
import { Notes } from "../components/Notes.jsx";
import { useKeyboard } from "../hooks/useKeyboard.jsx";
import { usePiano } from "../hooks/usePiano.jsx";
import { PianoLayout } from "../components/PianoLayout.jsx";

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
  
  useEffect(() => {
    apiFetch('/user').then(setProfile);
  }, []);
  
  const sideEffect = useMemo(() => {
    return (sym, isAttack) => {
      if (isAttack) {
        addActiveKey(sym);
      } else {
        removeActiveKey(sym);
      }
    };
  }, []);
  const { synthRef, barsRef, displayBars } = usePiano(sideEffect);
  useKeyboard(profile, symMap, synthRef, barsRef, sideEffect);

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
    <PianoLayout 
      header={P.title} 
      backgroundImageURL={P.backgroundImageURL} 
      displayBars={displayBars}
      synthRef={synthRef}
      barsRef={barsRef}
      sideEffect={sideEffect}
      isStarted={isStarted}
      start={start}
    />
  );
}