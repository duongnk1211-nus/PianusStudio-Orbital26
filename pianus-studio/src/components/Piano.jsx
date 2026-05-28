import { useState, useEffect, useRef, useCallback } from "react";

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

// Black key left offset (in white-key units) from the start of the keyboard
const BLACK_KEY_OFFSETS = {
  "C#4": 0, "D#4": 1, "F#4": 3, "G#4": 4, "A#4": 5,
  "C#5": 7, "D#5": 8,
};

const WHITE_KEY_WIDTH = 44; // px
const WHITE_KEY_GAP   = 2;  // px

export default function Piano() {
  const audioCtxRef = useRef(null);
  const [activeNotes, setActiveNotes] = useState(new Set());
  const [lastNote, setLastNote]       = useState(null);
  const noteTimeoutRef = useRef(null);

  // Lazily create AudioContext on first interaction
  function getCtx() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  }

  const playNote = useCallback((freq) => {
    const ac = getCtx();

    // Triangle oscillator (body of the note)
    const osc1  = ac.createOscillator();
    const gain1 = ac.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(freq, ac.currentTime);
    gain1.gain.setValueAtTime(0.4, ac.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1.4);
    osc1.connect(gain1);
    gain1.connect(ac.destination);
    osc1.start();
    osc1.stop(ac.currentTime + 1.4);

    // Sine octave (shimmer)
    const osc2  = ac.createOscillator();
    const gain2 = ac.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2, ac.currentTime);
    gain2.gain.setValueAtTime(0.15, ac.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.8);
    osc2.connect(gain2);
    gain2.connect(ac.destination);
    osc2.start();
    osc2.stop(ac.currentTime + 0.8);
  }, []);

  const triggerNote = useCallback((noteObj) => {
    playNote(noteObj.freq);
    setLastNote(noteObj.note);
    setActiveNotes((prev) => new Set([...prev, noteObj.note]));

    clearTimeout(noteTimeoutRef.current);
    noteTimeoutRef.current = setTimeout(() => {
      setActiveNotes(new Set());
      setLastNote(null);
    }, 200);
  }, [playNote]);

  // Keyboard support
  useEffect(() => {
    const keyMap = Object.fromEntries(NOTES.map((n) => [n.key, n]));
    const pressed = new Set();

    function onKeyDown(e) {
      if (e.repeat || pressed.has(e.key)) return;
      const n = keyMap[e.key.toLowerCase()];
      if (n) { pressed.add(e.key); triggerNote(n); }
    }
    function onKeyUp(e) { pressed.delete(e.key); }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup",   onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup",   onKeyUp);
    };
  }, [triggerNote]);

  const whites = NOTES.filter((n) => n.type === "white");
  const blacks = NOTES.filter((n) => n.type === "black");

  return (
    <div style={styles.wrap}>
      <p style={styles.label}>Grand Piano</p>

      {/* Piano body */}
      <div style={styles.body}>
        <div style={styles.keysRow}>
          {/* White keys */}
          {whites.map((n) => (
            <div
              key={n.note}
              onMouseDown={() => triggerNote(n)}
              style={{
                ...styles.whiteKey,
                ...(activeNotes.has(n.note) ? styles.whiteKeyActive : {}),
              }}
            >
              <span style={styles.whiteKeyLabel}>
                {n.note.replace(/\d/, "")}
              </span>
            </div>
          ))}

          {/* Black keys — absolutely positioned */}
          {blacks.map((n) => {
            const offset = BLACK_KEY_OFFSETS[n.note];
            if (offset === undefined) return null;
            const left = offset * (WHITE_KEY_WIDTH + WHITE_KEY_GAP)
                       + WHITE_KEY_WIDTH - 14 + WHITE_KEY_GAP;
            return (
              <div
                key={n.note}
                onMouseDown={(e) => { e.stopPropagation(); triggerNote(n); }}
                style={{
                  ...styles.blackKey,
                  left,
                  ...(activeNotes.has(n.note) ? styles.blackKeyActive : {}),
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Note display */}
      <div style={styles.noteDisplay}>
        <div style={{ ...styles.dot, ...(lastNote ? styles.dotActive : {}) }} />
        <div style={{ ...styles.badge, ...(lastNote ? styles.badgeActive : {}) }}>
          {lastNote ?? "—"}
        </div>
      </div>

      <p style={styles.hint}>
        Click keys &nbsp;·&nbsp; Keyboard: <code>A S D F G H J K L</code> &nbsp;|&nbsp; sharps: <code>W E T Y U O P</code>
      </p>
    </div>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */
const styles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.25rem",
    padding: "2rem 1rem 1.5rem",
    fontFamily: "system-ui, sans-serif",
    userSelect: "none",
  },
  label: {
    fontSize: 11,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#999",
    fontWeight: 500,
    margin: 0,
  },
  body: {
    background: "#1a1a1a",
    borderRadius: 12,
    padding: "16px 16px 24px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
  },
  keysRow: {
    display: "flex",
    position: "relative",
    height: 180,
  },
  whiteKey: {
    width: WHITE_KEY_WIDTH,
    height: 180,
    background: "linear-gradient(180deg,#f8f8f5 0%,#fff 60%,#f0f0ea 100%)",
    border: "1px solid #c8c8c0",
    borderRadius: "0 0 6px 6px",
    marginRight: WHITE_KEY_GAP,
    cursor: "pointer",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 10,
    position: "relative",
    flexShrink: 0,
    boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2)",
    transition: "background 0.05s",
  },
  whiteKeyActive: {
    background: "linear-gradient(180deg,#d4e8ff 0%,#e8f4ff 100%)",
    borderColor: "#85b7eb",
  },
  whiteKeyLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "#aaa",
    letterSpacing: "0.05em",
  },
  blackKey: {
    width: 28,
    height: 110,
    background: "linear-gradient(180deg,#2a2a2a 0%,#111 70%,#1a1a1a 100%)",
    borderRadius: "0 0 4px 4px",
    cursor: "pointer",
    position: "absolute",
    zIndex: 2,
    top: 0,
    boxShadow: "inset 0 -3px 0 rgba(255,255,255,0.05), 2px 4px 8px rgba(0,0,0,0.5)",
    transition: "background 0.05s",
  },
  blackKeyActive: {
    background: "linear-gradient(180deg,#1a3a5c 0%,#0d2040 100%)",
  },
  noteDisplay: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#ccc",
    transition: "background 0.15s",
  },
  dotActive: {
    background: "#378add",
  },
  badge: {
    padding: "6px 16px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 500,
    background: "#f3f3f3",
    color: "#444",
    minWidth: 80,
    textAlign: "center",
    transition: "all 0.15s",
  },
  badgeActive: {
    background: "#e6f1fb",
    color: "#185fa5",
  },
  hint: {
    fontSize: 11,
    color: "#aaa",
    textAlign: "center",
    letterSpacing: "0.05em",
    margin: 0,
  },
};