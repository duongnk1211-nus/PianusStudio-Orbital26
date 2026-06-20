import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { Link, useNavigate } from "react-router-dom";
import { Note, Notes } from "../components/Note.jsx";
import { addEffect } from "../components/AddEffect.jsx";
import { P1 } from "../components/PianoPieces/P1.jsx";

export default function Piece() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  }
  const KeyMap = {};
  for (let i = 0; i < Notes.length; i++) {
    if (Notes[i].key.length === 1) KeyMap[Notes[i].key] = Notes[i];
  }
  const synthRef = useRef(null);
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const [displayBars, setDisplayBars] = useState([]);

  addEffect(KeyMap, synthRef, barsRef, rafRef, setDisplayBars);
  useEffect(() => {
    const handleStop = () => {
      setIsPlaying(false); // your React state update
    };

    Tone.Transport.on("stop", handleStop);

    return () => {
      Tone.Transport.off("stop", handleStop);
    };
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);
  const flipPlaying = () => {
    const prev = isPlaying;
    if (prev == false) {
      if (Tone.Transport.state === "stopped") {
        P1.display(synthRef, barsRef)();
      }
      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
      synthRef.current?.releaseAll();
    }
    setIsPlaying(!prev);
  }

  return (
    <div className="Piano" style={{backgroundImage: "url('/P1.jpg')"}}>
      <button className="return-button" onClick={goBack}>Return</button>
      <div className="piano-wrapper">
        <div>
        <img src="/PianusStudio.png" style={{background: '#517edfbc'}} />
        <h1>⭐Twinkle Twinkle Little Star⭐</h1>
        <p style={{color: '#e7a53c', fontFamily: 'Dancing Script'}}>By Dao Quang Linh</p>
        </div>
        <button className={isPlaying ? "pause-button" : "play-button"} onClick={flipPlaying}>
          {isPlaying ? "Pause" : "Play"}
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
          {Notes.map(n => n.toHTML(synthRef, barsRef))}
        </div>
      </div>
    </div>
  );
}