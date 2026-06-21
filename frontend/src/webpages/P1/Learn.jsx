import { useEffect, useRef, useState, useMemo } from "react";
import * as Tone from "tone";
import "../../styles/Piano.css";
import "../../styles/Synthesia.css";
import { Link, useNavigate } from "react-router-dom";
import { Note, Notes } from "../../components/Note.jsx";
import { addEffect } from "../../components/AddEffect.jsx";
import { P1 } from "../../components/PianoPieces/P1.jsx";

export default function P1Learn() {
  const navigate = useNavigate();
  const KeyMap = useMemo(() => {
    const map = {};
    for (let i = 0; i < Notes.length; i++) {
      if (Notes[i].key.length === 1) map[Notes[i].key] = Notes[i];
    }
    return map;
  }, []);
  const synthRef = useRef(null);
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const [displayBars, setDisplayBars] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const chords = undefined;
  const [currentIndex, setCurrentIndex] = useState(null);

  const start = () => {
    if (!isStarted) {
      chords = P1.breakChords();
    }
    setIsStarted(true);
    setCurrentIndex(0);
    Tone.Transport.stop();
    Tone.Transport.start();
  }

  const goBack = () => {
    navigate(-1);
  }

  addEffect(KeyMap, synthRef, barsRef, rafRef, setDisplayBars, (sym) => {});

  return (
    <div className="Piano" style={{backgroundImage: "url('/P1.jpg')"}}>
      <button className="return-button" onClick={goBack}>Return</button>
      <div className="piano-wrapper">
        <div>
        <img src="/PianusStudio.png" style={{background: '#517edfbc'}} />
        <h1>⭐Twinkle Twinkle Little Star⭐</h1>
        <p style={{color: '#e7a53c', fontFamily: 'Dancing Script'}}>By Dao Quang Linh</p>
        </div>
        <button className={isStarted ? "restart-button" : "start-button"} onClick={start}>
          {isStarted ? "Restart" : "Start"}
        </button>
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
          {Notes.map(n => n.toHTML(synthRef, barsRef, (sym) => {}))}
        </div>
      </div>
    </div>
  );
}