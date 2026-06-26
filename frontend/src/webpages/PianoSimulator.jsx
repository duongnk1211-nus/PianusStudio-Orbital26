import { useEffect, useState, useMemo } from "react";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { apiFetch } from "../components/API";
import { Notes } from "../components/Note.jsx";
import { useKeyboard } from "../hooks/useKeyboard.jsx";
import { usePiano } from "../hooks/usePiano.jsx";
import { PianoLayout } from "../components/PianoLayout.jsx";

export default function PianoSimulator() {
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
    return (sym, isAttack) => {};
  }, []);
  const { synthRef, barsRef, displayBars } = usePiano(sideEffect);
  useKeyboard(profile, symMap, synthRef, barsRef, sideEffect);

  return (
    <PianoLayout 
      header={"Piano Simulator"}
      backgroundImageURL={"BackGroundForPiano.jpg"} 
      displayBars={displayBars}
      synthRef={synthRef}
      barsRef={barsRef}
      sideEffect={sideEffect}
    />
  );
}