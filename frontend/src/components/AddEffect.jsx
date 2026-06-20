import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Note, Notes } from "./Note.jsx";

export function addEffect(KeyMap, synthRef, barsRef, rafRef, setDisplayBars) {
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

    for (let i = 0; i < Notes.length; i++) {
      Notes[i].release(synthRef, barsRef)();
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(rafRef.current);
      synthRef.current?.releaseAll();
      synthRef.current?.dispose();
      barsRef.current = [];
      rafRef.current = null;
      setDisplayBars([]);
    }
  }, []);
}