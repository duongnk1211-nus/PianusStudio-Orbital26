import { attack, release } from "./soundDisplayer.jsx";
import { Notes, getKeyMap } from "./noteList.jsx";

const KeyMap = getKeyMap();

const getNote = (e) => {
  return KeyMap[e.key];
}

export const handleKeyDown = (synthRef, setActiveKeys) => async (e) => {
  // console.log("Key pressed: ${e.key}");
  if (e.repeat) return;
  const n = getNote(e);
  if (n != null) attack(synthRef)(n);
  setActiveKeys(prev => {
    const newSet = new Set(prev);
    newSet.add(e.key);
    return newSet;
  });
};

export const handleKeyUp = (synthRef, setActiveKeys) => async (e) => {
  // console.log("Key released: ${e.key}");
  const n = getNote(e);
  if (n != null) release(synthRef)(n);
  setActiveKeys(prev => {
    const newSet = new Set(prev);
    newSet.delete(e.key);
      return newSet;
  });
}

export const handleMouseDown = (synthRef, setActiveKeys, n) => async () => {
  setActiveKeys(prev => {
    const newSet = new Set(prev);
    newSet.add(n.key);
    return newSet;
  })
  attack(synthRef)(n);
}

export const handleMouseUp = (synthRef, setActiveKeys, n) => async () => {
  setActiveKeys(prev => {
    const newSet = new Set(prev);
    newSet.delete(n.key);
    return newSet;
  });
  release(synthRef)(n);
}