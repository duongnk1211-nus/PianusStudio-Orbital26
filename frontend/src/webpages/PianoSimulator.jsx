import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { Link, useNavigate } from "react-router-dom";
import { Note, Notes } from "../components/Note.jsx";
import { addEffect } from "../components/AddEffect.jsx";

export default function PianoSimulator() {
  const KeyMap = {};
  for (let i = 0; i < Notes.length; i++) {
    if (Notes[i].key.length === 1) KeyMap[Notes[i].key] = Notes[i];
  }
  const synthRef = useRef(null);
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const [displayBars, setDisplayBars] = useState([]);

  addEffect(KeyMap, synthRef, barsRef, rafRef, setDisplayBars);

  const Navigate = useNavigate();

  const goBack = () => { Navigate(-1); };

  return (
    <div className="Piano">
      <button onClick={goBack}>Return</button>
      <div className="piano-wrapper">
        <div>
        <img src="/PianusStudio.png"/>
        <h1>Piano Simulator</h1>
        </div>
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