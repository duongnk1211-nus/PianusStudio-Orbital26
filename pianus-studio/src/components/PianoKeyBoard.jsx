import { useEffect, useRef, useState } from "react";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import * as Tone from "tone";
import { Notes, getKeyMap, computedLeftForNote } from "./kbComps/noteList.jsx";
import { setTone } from "./kbComps/setTone.jsx";
import { handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp } from "./kbComps/movementHandler.jsx";
import { attack, release } from "./kbComps/soundDisplayer.jsx";
import { Link } from "react-router-dom";

const NOTES = Notes;

const KeyMap = getKeyMap();

//Handling key press
export default function PianoKeyBoard() {
  const [activeKeys, setActiveKeys] = useState(new Set());

  const synthRef = useRef(null);
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const [displayBars, setDisplayBars] = useState([]);

  useEffect(() => {
    setTone(synthRef);

    const GROW_SPEED = 3;    // px per frame while held
    const FLY_SPEED = 3;    // px per frame after release

    const tick = () => {
      barsRef.current = barsRef.current
        .map(b => {
          if (!b.released) {
            return { ...b, height: b.height + GROW_SPEED, top: b.top - GROW_SPEED }
          } else {
            return { ...b, top: b.top - FLY_SPEED }
          }
        })
        .filter(b => b.top + b.height > -600);  // remove bars fully off screen

      setDisplayBars([...barsRef.current]);  // trigger re-render
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const a = handleKeyDown(synthRef, barsRef, setActiveKeys);
    const b = handleKeyUp(synthRef, barsRef, setActiveKeys);

    window.addEventListener("keydown", a);
    window.addEventListener("keyup", b);

    return () => {
      window.removeEventListener("keydown", a);
      window.removeEventListener("keyup", b);
    }
  }, []);

  return (
    <div className="piano-container">
      <div className="return-button">
        <Link to="/">Return</Link>
      </div>
      <div className="piano-wrapper">
        <div className="synthesia-container">
          {displayBars.map(b => (
            <div
              key={b.id}
              className={`synthesia-bar ${b.type}`}
              style={{
                left: `${b.left}px`,
                width: `${b.width - 2}px`,
                height: `${b.height}px`,
                top: `${b.top}px`,
              }}
            />
          ))}
        </div>
        <div className="key-rows">
          {NOTES.filter(n => n.type === "white").map((n) => (
            <div
              key={n.note}
              onMouseDown={handleMouseDown(synthRef, barsRef, setActiveKeys, n)}
              onMouseUp={handleMouseUp(synthRef, barsRef, setActiveKeys, n)}
              className={`white-key ${activeKeys.has(n.key) ? 'active' : ''}`}
            >
              <span className="white-key-letter-label">
                {n.key.toUpperCase()}
              </span>
            </div>
          ))}


          {NOTES.filter(n => n.type === "black").map((n) => {
            const left = computedLeftForNote(n);
            return (
              <div
                key={n.note}
                className={`black-key ${activeKeys.has(n.key) ? 'active' : ''}`}
                style={{ left: `${left}px` }}
                onMouseDown={handleMouseDown(synthRef, barsRef, setActiveKeys, n)}
                onMouseUp={handleMouseUp(synthRef, barsRef, setActiveKeys, n)}
              >
                <span className="black-key-letter-label">
                  {n.key.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
