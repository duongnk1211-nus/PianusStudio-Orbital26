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
import { useRequireAuth } from "../hooks/useRequireAuth.jsx";

function SaveDialog({
  showSaveDialog,
  setShowSaveDialog,
  saveRecord,
  isSaving,
  setIsSaving,
}) {
  return showSaveDialog && (
    <div className="modal-overlay">
      <div className="save-modal">
        <h2>Save Recording</h2>
        <p>Choose a save slot.</p>
        <div className="save-slots">
          <button onClick={saveRecord(1)}>
            Recording 1
          </button>
          <button onClick={saveRecord(2)}>
            Recording 2
          </button>
          <button onClick={saveRecord(3)}>
            Recording 3
          </button>
        </div>
        <button
          className="cancel-btn"
          onClick={() => setShowSaveDialog(false)}
        >
          Don't Save
        </button>

        {isSaving && (
          <div className="saving-message">
            Saving...
          </div>
        )}
      </div>
    </div>
  );
}

function SaveDoneDialog({
  isFetched,
  setIsFetched,
  saveError,
}) {
  return isFetched && (
    <div className="modal-overlay">
      <div className="fetched-modal">
        <p>{saveError}</p>
              
        <button
          className="ok-btn"
          onClick={() => setIsFetched(false)}
        >
          OK
        </button>

      </div>
    </div>
  );
}

export default function PianoRecorder() {
  const authChecked = useRequireAuth();

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
  
  const [bindingOption, setBindingOption] = useState(null);
  const [bindingOptionLoading, setBindingOptionLoading] = useState(true);
  
  useEffect(() => {
    apiFetch('/user/binding-option')
      .then((data) => {
        setBindingOption(data?.binding_option ?? 1);
        setBindingOptionLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setBindingOptionLoading(false);
      });
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
  useKeyboard(bindingOption, symMap, synthRef, barsRef, sideEffect);

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

  if (!authChecked || bindingOptionLoading) {
    return (
      <p>Loading...</p>
    );
  }

  return (
    <PianoLayout 
      header={"Recording Studio"} 
      backgroundImageURL={"/PianoRecorder.png"} 
      displayBars={displayBars}
      synthRef={synthRef}
      barsRef={barsRef}
      sideEffect={sideEffect}
      status={status}
      flipPlaying={flipPlaying}
      flipRecording={flipRecording}
      showSaveDialog={showSaveDialog}
      setShowSaveDialog={setShowSaveDialog}
    >
      <SaveDialog
        showSaveDialog={showSaveDialog}
        setShowSaveDialog={setShowSaveDialog}
        saveRecord={saveRecord}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
      />

      <SaveDoneDialog
        isFetched={isFetched}
        setIsFetched={setIsFetched}
        saveError={saveError}
      />
    </PianoLayout>
  );
}