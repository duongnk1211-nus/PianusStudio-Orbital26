import { useEffect, useRef, useState } from "react";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import * as Tone from "tone";
import { Note } from "./Note.jsx";
import { Link } from "react-router-dom";

const Notes = [
  new Note("C3", "z", 0),
  new Note("D3", "x", 1),
  new Note("E3", "c", 2),
  new Note("F3", "v", 3),
  new Note("G3", "b", 4),
  new Note("A3", "n", 5),
  new Note("B3", "m", 6),
  new Note("C4", "q", 7),
  new Note("D4", "w", 8),
  new Note("E4", "e", 9),
  new Note("F4", "r", 10),
  new Note("G4", "t", 11),
  new Note("A4", "y", 12),
  new Note("B4", "u", 13),
  new Note("C5", "i", 14),
  new Note("D5", "o", 15),
  new Note("E5", "p", 16),
  new Note("F5", "[", 17),
  new Note("G5", "]", 18),
  new Note("A5", "\\", 19),
  new Note("B5", "     ", 20),
  new Note("C6", "      ", 21),

  new Note("C#3", "s", 0),
  new Note("D#3", "d", 1),
  new Note("F#3", "g", 3),
  new Note("G#3", "h", 4),
  new Note("A#3", "j", 5),
  new Note("C#4", "2", 7),
  new Note("D#4", "3", 8),
  new Note("F#4", "5", 10),
  new Note("G#4", "6", 11),
  new Note("A#4", "7", 12),
  new Note("C#5", "9", 14),
  new Note("D#5", "0", 15),
  new Note("F#5", "=", 17),
  new Note("G#5", "  ", 18),
  new Note("A#5", "    ", 19),
];

const KeyMap = {};
for (let i = 0; i < Notes.length; i++) {
  if (Notes[i].key.length === 1) KeyMap[Notes[i].key] = Notes[i];
}

export default function PianoKeyboard() {
  const synthRef = useRef(null);
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const [displayBars, setDisplayBars] = useState([]);

  useEffect(() => {
    synthRef.current = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    const GROW_SPEED = 1;    // px per frame while held
    const FLY_SPEED = 1;    // px per frame after release

    const tick = () => {
      barsRef.current = barsRef.current
        .map(b => {
          if (!b.released) {
            return { ...b, height: b.height + GROW_SPEED, top: b.top - GROW_SPEED };
          } else {
            return { ...b, top: b.top - FLY_SPEED };
          }
        })
        .filter(b => b.top + b.height > -600);  // remove bars fully off screen

      setDisplayBars([...barsRef.current]);  // trigger re-render
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const handleKeyDown = async (e) => {
      if (e.repeat) return;  // ignore auto-repeats
      const note = KeyMap[e.key];
      if (note) {
        note.attack(synthRef, barsRef)();
      }
    };
    const handleKeyUp = async (e) => {
      const note = KeyMap[e.key];
      if (note) {
        note.release(synthRef, barsRef)();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
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
          {Notes.map(n => n.toHTML(synthRef, barsRef))}
        </div>
      </div>
    </div>
  );
}