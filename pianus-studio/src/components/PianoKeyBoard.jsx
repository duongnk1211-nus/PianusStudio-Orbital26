import { useEffect, useRef, useState } from "react";
import "../styles/Piano.css";
import * as Tone from "tone";

const NOTES = [
  { note: "C3",  type: "white", key: "z" },
  { note: "C#3", type: "black", key: "s" },
  { note: "D3",  type: "white", key: "x" },
  { note: "D#3", type: "black", key: "d" },
  { note: "E3",  type: "white", key: "c" },
  { note: "F3",  type: "white", key: "v" },
  { note: "F#3", type: "black", key: "g" },
  { note: "G3",  type: "white", key: "b" },
  { note: "G#3", type: "black", key: "h" },
  { note: "A3",  type: "white", key: "n" },
  { note: "A#3", type: "black", key: "j" },
  { note: "B3",  type: "white", key: "m" },
  { note: "C4",  type: "white", key: "q" },
  { note: "C#4", type: "black", key: "2" },
  { note: "D4",  type: "white", key: "w" },
  { note: "D#4", type: "black", key: "3" },
  { note: "E4",  type: "white", key: "e" },
  { note: "F4",  type: "white", key: "r" },
  { note: "F#4", type: "black", key: "5" },
  { note: "G4",  type: "white", key: "t" },
  { note: "G#4", type: "black", key: "6" },
  { note: "A4",  type: "white", key: "y" },
  { note: "A#4", type: "black", key: "7" },
  { note: "B4",  type: "white", key: "u" },
  { note: "C5",  type: "white", key: "i" },
  { note: "C#5", type: "black", key: "9" },
  { note: "D5",  type: "white", key: "o" },
  { note: "D#5", type: "black", key: "0" },
  { note: "E5",  type: "white", key: "p" },
  { note: "F5",  type: "white", key: "[" },
  { note: "F#5", type: "black", key: "=" },
  { note: "G5",  type: "white", key: "]" },
  { note: "G#5", type: "black", key: "  " },
  { note: "A5",  type: "white", key: "   " },
  { note: "A#5", type: "black", key: "    " },
  { note: "B5",  type: "white", key: "     " },
  { note: "C6",  type: "white", key: "      " },
];

const BLACK_KEY_LEFT_OFFSETS = {
  "C#3":  0, "D#3":  1, "F#3":  3, "G#3":  4, "A#3":  5,
  "C#4":  7, "D#4":  8, "F#4": 10, "G#4": 11, "A#4": 12,
  "C#5": 14, "D#5": 15, "F#5": 17, "G#5": 18, "A#5": 19,
};

//Handling key press
export default function PianoKeyBoard(){
  const [activeKeys, setActiveKeys] = useState(new Set());

  const synthRef = useRef(null);

  const getNote = (e) => {
    console.log(e.key);
    if (e.key == "") return null;
    for (let i = 0; i < NOTES.length; i++) {
      if (NOTES[i].key == e.key) return NOTES[i];
    }
    return null;
  }

  const attack = async (n) => {
    await Tone.start();
    synthRef.current.triggerAttack(n.note);
  }

  const release = async (n) => {
    synthRef.current.triggerRelease(n.note);
  }

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
    const handleKeyDown = async (e) => {
      // console.log("Key pressed: ${e.key}");
      if (e.repeat) return;
      const n = getNote(e);
      if (n != null) attack(n);
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.add(e.key);
        return newSet;
      });
    }

    const handleKeyUp = async (e) => {
      // console.log("Key released: ${e.key}");
      const n = getNote(e);
      if (n != null) release(n);
      setActiveKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key);
        return newSet;
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, []);

  const WHITE_KEY_WIDTH = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--white-key-width'));
  const WHITE_KEY_GAP = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--white-key-gap'));
  const BLACK_KEY_WIDTH = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--black-key-width'));

  return (
    <div className="key-rows">
        {/* White keys */}
        {NOTES.filter(n => n.type === "white").map((n) => (
          <div 
            key={n.note} 
            onMouseDown={async () => {
              setActiveKeys(prev => {
                const newSet = new Set(prev);
                newSet.add(n.key);
                return newSet;
              })
              attack(n);
            }}
            onMouseUp={async () => {
              setActiveKeys(prev => {
                const newSet = new Set(prev);
                  newSet.delete(n.key);
                  return newSet;
              })
              release(n);
            }}
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
            const offset = BLACK_KEY_LEFT_OFFSETS[n.note];
            if (offset === undefined) return null;
            const left = (offset + 1) * (WHITE_KEY_WIDTH + WHITE_KEY_GAP)
                      - WHITE_KEY_GAP / 2 - BLACK_KEY_WIDTH / 2;
            //console.log(`Black key ${n.note} left offset: ${left}px`);
            return (
              <div
                key={n.note}
                className={`black-key ${activeKeys.has(n.key) ? 'active' : ''}`}
                style ={{ left: `${left}px` }}
                onMouseDown={async () => {
                  setActiveKeys(prev => {
                    const newSet = new Set(prev);
                    newSet.add(n.key);
                    return newSet;
                  })
                  attack(n);
                }}
                onMouseUp={async () => {
                  setActiveKeys(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(n.key);
                    return newSet;
                  })
                  release(n);
                }}
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