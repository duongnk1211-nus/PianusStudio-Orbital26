import { useEffect, useState, useMemo } from "react";
import * as Tone from "tone";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { apiFetch } from "../components/API";
import { Notes } from "../components/Notes.jsx";
import { useNavigate } from "react-router-dom";
import { useKeyboard } from "../hooks/useKeyboard.jsx";
import { usePiano } from "../hooks/usePiano.jsx";
import { PianoLayout } from "../components/PianoLayout.jsx";

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
  const [profileLoading, setProfileLoading] = useState(true);
  
  useEffect(() => {
    apiFetch('/user').then(setProfile);
    setProfileLoading(false);
  }, []);
  
  const sideEffect = useMemo(() => {
    return (sym, isAttack) => {};
  }, []);
  const { synthRef, barsRef, displayBars } = usePiano(sideEffect);
  useKeyboard(profile, symMap, synthRef, barsRef, sideEffect);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAttackingRight, setIsAttackingRight] = useState([false, false, false, false, false]);
  const [isAttackingLeft, setIsAttackingLeft] = useState([false, false, false, false, false]);
  
  const flipPlaying = async () => {
    const prev = isPlaying;
    if (prev === false) {
      if (Tone.Transport.state === "stopped") {
        synthRef.current?.releaseAll();
        Tone.Transport.cancel();
        P.display(synthRef, barsRef, sideEffect, setIsAttackingRight, setIsAttackingLeft)();
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

  if (profileLoading) {
    return (
      <p>Loading...</p>
    );
  }

  return (
    <PianoLayout 
      header={P.title} 
      backgroundImageURL={P.backgroundImageURL} 
      displayBars={displayBars}
      synthRef={synthRef}
      barsRef={barsRef}
      sideEffect={sideEffect}
      isPlaying={isPlaying}
      flipPlaying={flipPlaying}
      isAttackingRight={isAttackingRight}
      setIsAttackingRight={setIsAttackingRight}
      isAttackingLeft={isAttackingLeft}
      setIsAttackingLeft={setIsAttackingLeft}
    />
  );
}