import { attack, release } from "./soundDisplayer.jsx";
import { Notes, getKeyMap, computedLeftForNote } from "./noteList.jsx";

const WHITE_KEY_WIDTH = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--white-key-width'));
const WHITE_KEY_GAP = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--white-key-gap'));
const BLACK_KEY_WIDTH = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--black-key-width'));

const KeyMap = getKeyMap();

const getNote = (e) => {
  return KeyMap[e.key];
}

const attackNote = (synthRef, barsRef, setActiveKeys, n) => {
  attack(synthRef)(n);
  setActiveKeys(prev => {
    const newSet = new Set(prev);
    newSet.add(n.key);
    return newSet;
  });
  barsRef.current.push({
    id: Date.now() + Math.random(),
    note: n.note,
    type: n.type,
    left: computedLeftForNote(n),  // same formula you already use for black keys
    width: n.type === "white" ? WHITE_KEY_WIDTH : BLACK_KEY_WIDTH,
    startTime: Date.now(),
    released: false,
    top: 400,
    height: 0,
  });
}

const releaseNote = (synthRef, barsRef, setActiveKeys, n) => {
  release(synthRef)(n);
  setActiveKeys(prev => {
    const newSet = new Set(prev);
    newSet.delete(n.key);
      return newSet;
  });
  barsRef.current = barsRef.current.map(b =>
    b.note === n.note && !b.released ? { ...b, released: true } : b
  );
}

export const handleKeyDown = (synthRef, barsRef, setActiveKeys) => async (e) => {
  // console.log("Key pressed: ${e.key}");
  if (e.repeat) return;
  const n = getNote(e);
  if (n == null) return;
  attackNote(synthRef, barsRef, setActiveKeys, n);
};

export const handleKeyUp = (synthRef, barsRef, setActiveKeys) => async (e) => {
  // console.log("Key released: ${e.key}");
  const n = getNote(e);
  if (n == null) return;
  releaseNote(synthRef, barsRef, setActiveKeys, n);
}

export const handleMouseDown = (synthRef, barsRef, setActiveKeys, n) => async () => {
  attackNote(synthRef, barsRef, setActiveKeys, n);
}

export const handleMouseUp = (synthRef, barsRef, setActiveKeys, n) => async () => {
  releaseNote(synthRef, barsRef, setActiveKeys, n);
}