//import {useState, useRef, useCallback} from "react";
import '../styles/Piano.css'

const NOTES = [
  { note: "C4",  freq: 261.63, type: "white", key: "a" },
  { note: "C#4", freq: 277.18, type: "black", key: "w" },
  { note: "D4",  freq: 293.66, type: "white", key: "s" },
  { note: "D#4", freq: 311.13, type: "black", key: "e" },
  { note: "E4",  freq: 329.63, type: "white", key: "d" },
  { note: "F4",  freq: 349.23, type: "white", key: "f" },
  { note: "F#4", freq: 369.99, type: "black", key: "t" },
  { note: "G4",  freq: 392.00, type: "white", key: "g" },
  { note: "G#4", freq: 415.30, type: "black", key: "y" },
  { note: "A4",  freq: 440.00, type: "white", key: "h" },
  { note: "A#4", freq: 466.16, type: "black", key: "u" },
  { note: "B4",  freq: 493.88, type: "white", key: "j" },
  { note: "C5",  freq: 523.25, type: "white", key: "k" },
  { note: "C#5", freq: 554.37, type: "black", key: "o" },
  { note: "D5",  freq: 587.33, type: "white", key: "l" },
  { note: "D#5", freq: 622.25, type: "black", key: "p" },
  { note: "E5",  freq: 659.25, type: "white", key: ";" },
];

const BLACK_KEY_LEFT_OFFSETS = {
  "C#4": 0, "D#4": 1, "F#4": 3, "G#4": 4, "A#4": 5,
  "C#5": 7, "D#5": 8,
};

export default function PianoKeyBoard(){
  const WHITE_KEY_WIDTH = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--white-key-width'));
  const WHITE_KEY_GAP = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--white-key-gap'));

  return (
    <div className="key-rows">
        {/* White keys */}
        {NOTES.filter(n => n.type === "white").map((n) => (
            <div key={n.note} className="white-key">
                <span className="white-key-letter-label">
                    {n.key.toUpperCase()}
                </span>
            </div>
        ))}

        {/* Black keys */}
        {NOTES.filter(n => n.type === "black")
            .map((n) => {
            const offset = BLACK_KEY_LEFT_OFFSETS[n.note];
            if (offset === undefined) return null;
            const left = offset * (WHITE_KEY_WIDTH + WHITE_KEY_GAP)
                       + WHITE_KEY_WIDTH - 14 + WHITE_KEY_GAP;
            console.log(`Black key ${n.note} left offset: ${left}px`);
            return (
              <div
                key={n.note}
                className="black-key"
                style ={{ left: `${left}px` }}
              />
            );
        })}
    </div>
    )
}