import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import "../styles/Piano.css";

const WKWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--white-key-width'));
const WKGap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--white-key-gap'));
const BKWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--black-key-width'));

export class Note {
  #sym;
  #type;
  #key;
  #offset;
  #active = false;
  #guide = false;

  constructor(sym, offset) {
    this.#sym = sym;
    this.#type = (sym.includes("#") ? "black" : "white");
    this.#key = " ";
    this.#offset = offset;
  }

  get sym() {
    return this.#sym;
  }

  get key() {
    return this.#key;
  }

  set key(newKey) {
    this.#key = newKey;
  }

  #computedLeftForNote = () => {
    if (this.#type === "white") {
      return this.#offset * (WKWidth + WKGap);
    } else {
      let result = this.#offset * (WKWidth + WKGap);
      const x = (3 * WKWidth + 2 * WKGap - 2 * BKWidth) / 3;
      const y = (4 * WKWidth + 3 * WKGap - 3 * BKWidth) / 4;

      if (this.#sym.includes("C")) {
        result += x;
      } else if (this.#sym.includes("D")) {
        result += 2 * x + BKWidth;
      } else if (this.#sym.includes("F")) {
        result += y;
      } else if (this.#sym.includes("G")) {
        result += 2 * y + BKWidth;
      } else {
        result += 3 * y + 2 * BKWidth;
      }
      
      return result;
    }
  }

  attack = (synthRef, barsRef, sideEffect) => async () => {
    await Tone.start();
    
    this.#active = true;
    synthRef.current.triggerAttack(this.#sym);

    barsRef.current.push({
      id: Date.now() + Math.random(),
      note: this.#sym,
      type: this.#type,
      left: this.#computedLeftForNote(),
      width: this.#type === "white" ? WKWidth : BKWidth,
      startTime: Date.now(),
      released: false,
      top: 400,
      height: 0,
    });
    sideEffect(this.#sym, true);
  }

  release = (synthRef, barsRef, sideEffect) => async() => {
    this.#active = false;
    synthRef.current.triggerRelease(this.#sym);
    barsRef.current = barsRef.current.map(b =>
      b.note === this.#sym && !b.released ? { ...b, released: true } : b
    );
    sideEffect(this.#sym, false);
  }

  setGuide = async() => {
    this.#guide = true;
  }

  unsetGuide = async() => {
    this.#guide = false;
  }

  toHTML = (synthRef, barsRef, sideEffect) => {
    if (this.#type == "white") {
      return (
        <div
          key={this.#sym}
          onMouseDown={this.attack(synthRef, barsRef, sideEffect)}
          onMouseUp={this.release(synthRef, barsRef, sideEffect)}
          className={`white-key ${this.#active ? 'active' : ''} ${(this.#guide && !this.#active) ? 'guide' : ''}`}
        >
          <span className="white-key-letter-label">
            {this.#key.toUpperCase()}
          </span>
        </div>
      );
    }
    else {
      const left = this.#computedLeftForNote();
      return (
        <div
          key={this.#sym}
          className={`black-key ${this.#active ? 'active' : ''} ${(this.#guide && !this.#active) ? 'guide' : ''}`}
          style={{ left: `${left}px` }}
          onMouseDown={this.attack(synthRef, barsRef, sideEffect)}
          onMouseUp={this.release(synthRef, barsRef, sideEffect)}
        >
          <span className="black-key-letter-label">
            {this.#key.toUpperCase()}
          </span>
        </div>
      );
    }
  }
}

export const Notes = [
  new Note("C3", 0),
  new Note("D3", 1),
  new Note("E3", 2),
  new Note("F3", 3),
  new Note("G3", 4),
  new Note("A3", 5),
  new Note("B3", 6),
  new Note("C4", 7),
  new Note("D4", 8),
  new Note("E4", 9),
  new Note("F4", 10),
  new Note("G4", 11),
  new Note("A4", 12),
  new Note("B4", 13),
  new Note("C5", 14),
  new Note("D5", 15),
  new Note("E5", 16),
  new Note("F5", 17),
  new Note("G5", 18),
  new Note("A5", 19),
  new Note("B5", 20),
  new Note("C6", 21),

  new Note("C#3", 0),
  new Note("D#3", 0),
  new Note("F#3", 3),
  new Note("G#3", 3),
  new Note("A#3", 3),
  new Note("C#4", 7),
  new Note("D#4", 7),
  new Note("F#4", 10),
  new Note("G#4", 10),
  new Note("A#4", 10),
  new Note("C#5", 14),
  new Note("D#5", 14),
  new Note("F#5", 17),
  new Note("G#5", 17),
  new Note("A#5", 17),
];