import { useEffect } from "react";
import { Note, Notes } from "../components/Note.jsx";
import { keyMaps } from "../components/keyMaps.jsx";

export function useKeyboard(profile, symMap, synthRef, barsRef, sideEffect) {
  useEffect(() => {
    for (const note of Notes) {
      note.key = " ";
    }
    const bindingOption = profile ? profile.binding_option : 1;
    const keyMap = new Map(Object.entries(keyMaps[bindingOption]));
    const noteMap = new Map();
    for (const [sym, key] of keyMap) {
      if (key !== " "){
        noteMap.set(key, symMap.get(sym));
        symMap.get(sym).key = key;
      }
    }

    const handleKeyDown = async (e) => {
      if (e.key === " ") return;
      const note = noteMap.get(e.key);
      if (note) {
        e.preventDefault();
        if (e.repeat) return;
        note.attack(synthRef, barsRef, sideEffect)();
      }
    };
    const handleKeyUp = async (e) => {
      if (e.key === " ") return;
      const note = noteMap.get(e.key);
      if (note) {
        e.preventDefault();
        note.release(synthRef, barsRef, sideEffect)();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, [profile]);
}