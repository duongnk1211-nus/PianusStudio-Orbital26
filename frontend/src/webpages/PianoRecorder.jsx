import { useEffect, useState, useMemo, useRef } from "react";
import * as Tone from "tone";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { apiFetch } from "../components/API.jsx";
import { Notes } from "../components/Notes.jsx";
import { useNavigate } from "react-router-dom";
import { useKeyboard } from "../hooks/useKeyboard.jsx";
import { usePiano } from "../hooks/usePiano.jsx";
import { PianoLayout } from "../components/PianoLayout.jsx";
import { Piece } from "../classes/Piece.jsx";
import { supabase } from "../components/supabaseClient";

export default function PianoRecorder() {
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
  
  useEffect(() => {
    apiFetch('/user').then(setProfile);
  }, []);
  
  const [status, setStatus] = useState("stopped");
  const statusRef = useRef(status);

  const [P, setP] = useState(new Piece(
    0.0,
    []
  ));

  useEffect(() => { statusRef.current = status; }, [status]);

  const lastAttackRef = useRef({});
  const MIN_NOTE_LENGTH = 0.05;

  const sideEffect = useMemo(() => {
    return (sym, isAttack) => {
      if (statusRef.current !== "recording") return;
      let t = Tone.Transport.seconds;

      if (isAttack) {
        if (lastAttackRef.current[sym] !== undefined) return;
        lastAttackRef.current[sym] = t;
      } else {
        const attackTime = lastAttackRef.current[sym];
        if (attackTime === undefined) return;
        t = Math.max(attackTime + MIN_NOTE_LENGTH, t);
        delete lastAttackRef.current[sym];
      }

      setP(prev => {
        const newP = new Piece(prev.duration, [...prev.actions]);
        newP.addAction({ type: isAttack ? "attack" : "release", sym, time: t });
        return newP;
      });
    };
  }, []);


  const flipPlaying = async () => {
    await Tone.start();
    if (statusRef.current === "stopped") {
      if (Tone.Transport.state === "stopped") {
        synthRef.current?.releaseAll();
        Tone.Transport.cancel();
        P.display(synthRef, barsRef, sideEffect)();
      }
      Tone.Transport.start();
      setStatus("playing");
    } else {
      Tone.Transport.pause();
      synthRef.current?.releaseAll();
      setStatus("stopped");
    }
  }

  const flipRecording = async () => {
    if (statusRef.current === "stopped") {
      Tone.Transport.cancel();
      lastAttackRef.current = {};
      setP(new Piece(0.0, []));
      Tone.Transport.seconds = 0;
      Tone.Transport.start();
      setStatus("recording");
    } else {
      const D = Tone.Transport.seconds;
      const openSyms = Object.entries(lastAttackRef.current);
      setP(prev => {
        const newP = new Piece(D, [...prev.actions]);
        for (const [sym, attackTime] of openSyms) {
          newP.addAction({ type: "release", sym, time: Math.max(D, attackTime + MIN_NOTE_LENGTH) });
        }
        return newP;
      });
      Tone.Transport.pause();
      synthRef.current?.releaseAll();
      Tone.Transport.stop();
      setStatus("stopped");
    }
  }

  const saveRecording = async () => {
    let message = null;
    if (!P.actions || P.actions.length === 0) {
      message = "Nothing to save — record something first.";
    }

    try {
      await apiFetch('/piece', {
        method: 'POST',
        body: JSON.stringify({ piece: { duration: P.duration, actions: P.actions } }),
      });
      message = "Recording saved successfully!";
    } catch (err) {
      console.error(err);
      message = err.message || "Failed to save recording. Please try again.";
    }
    alert(message);
  };

  const { synthRef, barsRef, displayBars } = usePiano(sideEffect);
  useKeyboard(profile, symMap, synthRef, barsRef, sideEffect);

  useEffect(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    const handleStop = () => {
      setStatus("stopped");
    };
    Tone.Transport.on("stop", handleStop);
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.Transport.off("stop", handleStop);
    };
  }, []);

  return (
    <PianoLayout 
      header={"Recording Studio"} 
      backgroundImageURL={"BackGroundForPiano.jpg"} 
      displayBars={displayBars}
      synthRef={synthRef}
      barsRef={barsRef}
      sideEffect={sideEffect}
      status={status}
      flipPlaying={flipPlaying}
      flipRecording={flipRecording}
      saveRecording={saveRecording}
    />
  );
}