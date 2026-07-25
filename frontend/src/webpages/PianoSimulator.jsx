import { useEffect, useState, useMemo } from "react";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { apiFetch } from "../components/API";
import { Notes } from "../components/Notes.jsx";
import { useKeyboard } from "../hooks/useKeyboard.jsx";
import { usePiano } from "../hooks/usePiano.jsx";
import { PianoLayout } from "../components/PianoLayout.jsx";
import { useRequireAuth } from "../hooks/useRequireAuth.jsx";

export default function PianoSimulator() {
  const authChecked = useRequireAuth();

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

  const sideEffect = useMemo(() => {
    return (sym, isAttack) => {};
  }, []);
  const { synthRef, barsRef, displayBars } = usePiano(sideEffect);
  useKeyboard(bindingOption, symMap, synthRef, barsRef, sideEffect);

  if (!authChecked || bindingOptionLoading) {
    return (
      <p>Loading...</p>
    );
  }

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