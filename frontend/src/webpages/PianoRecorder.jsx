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
import { Record } from "../classes/Record.jsx";
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

  const [P, setP] = useState(new Record(
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
        const newP = new Record(prev.duration, [...prev.actions]);
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
      setP(new Record(0.0, []));
      Tone.Transport.seconds = 0;
      Tone.Transport.start();
      setStatus("recording");
    } else {
      const D = Tone.Transport.seconds;
      const openSyms = Object.entries(lastAttackRef.current);
      setP(prev => {
        const newP = new Record(D, [...prev.actions]);
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

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const saveRecord = (id) => async() => {
    setIsSaving(true);

    try {
      const result = await supabase.auth.getSession();
      const session = result.data.session;
      await apiFetch('/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ position: id, record: { duration: P.duration, actions: P.actions } })
      });
      setSaveError(`Recording ${id} was successfully saved!!!`)
    } catch (err) {
      setSaveError(err.message || `Failed to save recording ${id}. Please try again.`);
    } finally {
      setIsSaving(false);
    }

    setShowSaveDialog(false);
    setIsFetched(true);
  }

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
      showSaveDialog={showSaveDialog}
      setShowSaveDialog={setShowSaveDialog}
      saveRecord={saveRecord}
      isSaving={isSaving}
      setIsSaving={setIsSaving}
      isFetched={isFetched}
      setIsFetched={setIsFetched}
      saveError={saveError}
    />
  );
}