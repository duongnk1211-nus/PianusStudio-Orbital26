import { useEffect, useState, useMemo, useRef } from "react";
import * as Tone from "tone";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { apiFetch } from "../components/API";
import { supabase } from "../components/supabaseClient";
import { Notes } from "../components/Notes.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useKeyboard } from "../hooks/useKeyboard.jsx";
import { usePiano } from "../hooks/usePiano.jsx";
import { PianoLayout } from "../components/PianoLayout.jsx";
import { Record } from "../classes/Record.jsx";

export default function RecordingDisplayer() {
  const navigate = useNavigate();
  const location = useLocation();
  const position = location.state?.focus ?? 1;

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

  const sideEffect = useMemo(() => {
    return (sym, isAttack) => {};
  }, []);

  const { synthRef, barsRef, displayBars } = usePiano(sideEffect);
  useKeyboard(profile, symMap, synthRef, barsRef, sideEffect);

  const [P, setP] = useState(null);
  const [recordLoading, setRecordLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadRecord() {
      setRecordLoading(true);
      setFetchError(null);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const data = await apiFetch(`/record/${position}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const raw = data?.record;
        if (!raw) {
          if (!cancelled) setFetchError("No recording found at this position.");
          return;
        }
        if (!cancelled) setP(new Record(raw.duration, raw.actions ?? []));
      } catch (err) {
        console.error(`Failed to load record at position ${position}:`, err);
        if (!cancelled) setFetchError(err.message || "Failed to load this recording.");
      } finally {
        if (!cancelled) setRecordLoading(false);
      }
    }

    loadRecord();
    return () => {
      cancelled = true;
    };
  }, []);


  const [isPlaying, setIsPlaying] = useState(false);
  const statusRef = useRef("stopped");

  useEffect(() => {
    statusRef.current = isPlaying ? "playing" : "stopped";
  }, [isPlaying]);

  const flipPlaying = async () => {
    const prev = isPlaying;
    if (prev === false) {
      if (Tone.Transport.state === "stopped") {
        synthRef.current?.releaseAll();
        Tone.Transport.cancel();
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

  if (recordLoading) {
    return (
      <p>Loading...</p>
    );
  }

  if (fetchError) {
    return (
      <div>
        <button onClick={goBack}>Return</button>
        <p>{fetchError}</p>
      </div>
    );
  }

  return (
    <PianoLayout
      header={"Recording Displayer"}
      backgroundImageURL={"BackGroundForPiano.jpg"}
      displayBars={displayBars}
      synthRef={synthRef}
      barsRef={barsRef}
      sideEffect={sideEffect}
      isPlaying={isPlaying}
      flipPlaying={flipPlaying}
      disabled={recordLoading}
    />
  );
}