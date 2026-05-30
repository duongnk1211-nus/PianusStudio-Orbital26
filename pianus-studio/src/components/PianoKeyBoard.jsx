import { useEffect, useRef, useState } from "react";
import "../styles/Piano.css";
import * as Tone from "tone";
import { Notes, getKeyMap } from "./noteList.jsx";
import { setTone } from "./setTone.jsx";
import { handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp } from "./movementHandler.jsx";
import { attack, release } from "./soundDisplayer.jsx";

const NOTES = Notes;

const KeyMap = getKeyMap();

//Handling key press
export default function PianoKeyBoard(){
  const [activeKeys, setActiveKeys] = useState(new Set());

  const synthRef = useRef(null);

  useEffect(() => {
    setTone(synthRef);
    const a = handleKeyDown(synthRef, setActiveKeys);
    const b = handleKeyUp(synthRef, setActiveKeys);

    window.addEventListener("keydown", a);
    window.addEventListener("keyup", b);

    return () => {
      window.removeEventListener("keydown", a);
      window.removeEventListener("keyup", b);
    }
  }, []);

  const WHITE_KEY_WIDTH = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--white-key-width'));
  const WHITE_KEY_GAP = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--white-key-gap'));
  const BLACK_KEY_WIDTH = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--black-key-width'));

  const computedLeftForNote = (n) => {
    if (n.type === "white") {
        return n.offset * (WHITE_KEY_WIDTH + WHITE_KEY_GAP);
    } else {
        return (n.offset + 1) * (WHITE_KEY_WIDTH + WHITE_KEY_GAP) 
                - WHITE_KEY_GAP / 2 - BLACK_KEY_WIDTH / 2;
    }
  }

  return (
    <div className="key-rows">
        {/* White keys */}
        {NOTES.filter(n => n.type === "white").map((n) => (
          <div 
            key={n.note} 
            onMouseDown={ handleMouseDown(synthRef, setActiveKeys, n) }
            onMouseUp={ handleMouseUp(synthRef, setActiveKeys, n) }
            className={`white-key ${activeKeys.has(n.key) ? 'active' : ''}`}
          >
            <span className="white-key-letter-label">
                {n.key.toUpperCase()}
            </span>
          </div>
        ))}

        {/* Black keys */}
        {NOTES.filter(n => n.type === "black")
            .map((n) => {
            const left = computedLeftForNote(n);
            //console.log(`Black key ${n.note} left offset: ${left}px`);
            return (
              <div
                key={n.note}
                className={`black-key ${activeKeys.has(n.key) ? 'active' : ''}`}
                style ={{ left: `${left}px` }}
                onMouseDown={ handleMouseDown(synthRef, setActiveKeys, n) }
                onMouseUp={ handleMouseUp(synthRef, setActiveKeys, n) }
              >
                <span className="black-key-letter-label">
                    {n.key.toUpperCase()}
                </span>
              </div>
            );
        })}
    </div>
    )
}