import { useEffect, useRef, useState, useMemo } from "react";
import * as Tone from "tone";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { Link, useNavigate } from "react-router-dom";
import { Note, Notes } from "../components/Note.jsx";
import { addEffect } from "../components/AddEffect.jsx";

export default function Display({ P }) {
  const navigate = useNavigate();
  const KeyMap = useMemo(() => {
    console.log(P.backgroundImageURL);
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
  const [isPlaying, setIsPlaying] = useState(false);
  const sideEffect = useMemo(() => {
    return (sym, isAttack) => {console.log((isAttack ? "Attack " : "Release ") + sym)};
  }, []);

  const goBack = () => {
    navigate(-1);
  }

  const flipPlaying = () => {
    const prev = isPlaying;
    if (prev == false) {
      if (Tone.Transport.state == "stopped") {
        P.display(synthRef, barsRef, sideEffect)();
      }
      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
      synthRef.current?.releaseAll();
    }
    setIsPlaying(!prev);
  }

  addEffect(KeyMap, synthRef, barsRef, rafRef, setDisplayBars, sideEffect);
  useEffect(() => {
    Tone.Transport.stop();
    const handleStop = () => {
      setIsPlaying(false);
    };

    Tone.Transport.on("stop", handleStop);

    return () => {
      Tone.Transport.off("stop", handleStop);
    };
  }, []);

  return (
    <div className="Piano" style={{ backgroundImage: `url(${P.backgroundImageURL})` }}>
      <button className="return-button" onClick={goBack}>Return</button>
      <div className="piano-wrapper">
        <div>
        <img src="/PianusStudio.png" style={{background: '#517edfbc'}} />
        <h1>{P.title}</h1>
        {/* <p style={{color: '#e7a53c', fontFamily: 'Dancing Script'}}>By Dao Quang Linh</p> */}
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
          {Notes.map(n => n.toHTML(synthRef, barsRef, sideEffect))}
        </div>
      </div>
    </div>
  );
}