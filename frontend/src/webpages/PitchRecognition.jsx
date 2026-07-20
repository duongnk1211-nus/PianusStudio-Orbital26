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

export default function PitchRecognition({ R }) {
  const total = R.actions.length / 2;
  const ansList = useMemo(() => {
    let result = [];
    for (let i = 0; i < R.actions.length; i++) {
      if (R.actions[i].type === "attack") {
        result.push(R.actions[i].sym);
      }
    }
    return result;
  });

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
  
  const [status, setStatus] = useState("stopped");
  const statusRef = useRef(status);

  useEffect(() => { statusRef.current = status; }, [status]);

  const lastAttackRef = useRef({});
  const MIN_NOTE_LENGTH = 0.05;

  const [outList, setOutList] = useState([]);

  const sideEffect = useMemo(() => {
    return (sym, isAttack) => {
      if (statusRef.current !== "recording") return;
      if (isAttack) {
        setOutList(prev => {
          const newOutList = [...prev];
          newOutList.push(sym);
          return newOutList;
        });
      }
    };
  }, []);

  useEffect(() => {
    if (outList.length >= total) {
      flipRecording();
    }
  }, [outList]);

  const flipPlaying = async () => {
    await Tone.start();
    if (statusRef.current === "stopped") {
      if (Tone.Transport.state === "stopped") {
        synthRef.current?.releaseAll();
        Tone.Transport.cancel();
        R.display(synthRef, barsRef, sideEffect)();
      }
      Tone.Transport.start();
      setStatus("playing");
    } else {
      Tone.Transport.pause();
      synthRef.current?.releaseAll();
      setStatus("stopped");
    }
  }

  const [correctNotes, setCorrectNotes] = useState(null);

  const flipRecording = async () => {
    if (statusRef.current === "stopped") {
      Tone.Transport.cancel();
      lastAttackRef.current = {};
      Tone.Transport.seconds = 0;
      Tone.Transport.start();
      setStatus("recording");
    } else {
      let num = 0;
      for (let i = 0; i < outList.length; i++) {
        if (outList[i] === ansList[i]) num++;
      }
      setCorrectNotes(num);
      
      Tone.Transport.pause();
      synthRef.current?.releaseAll();
      Tone.Transport.stop();
      setStatus("stopped");

      setOutList([]);
    }
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

  if (profileLoading) {
    return (
      <p>Loading...</p>
    );
  }

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
      correctNotes={correctNotes}
      setCorrectNotes={setCorrectNotes}
      total={total}
    />
  );
}