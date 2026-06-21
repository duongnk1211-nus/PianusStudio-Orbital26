import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import "../styles/Piano.css";

const WHITE_KEY_WIDTH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--white-key-width'));
const WHITE_KEY_GAP = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--white-key-gap'));
const BLACK_KEY_WIDTH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--black-key-width'));

export class Note {
  #sym;
  #type;
  #key;
  #offset;
  #active = false;

  constructor(sym, key, offset) {
    this.#sym = sym;
    this.#type = (sym.includes("#") ? "black" : "white");
    this.#key = key;
    this.#offset = offset;
  }

  get sym() {
    return this.#sym;
  }

  get key() {
    return this.#key;
  }

  #computedLeftForNote = () => {
    if (this.#type === "white") {
      return this.#offset * (WHITE_KEY_WIDTH + WHITE_KEY_GAP);
    } else {
      return (this.#offset + 1) * (WHITE_KEY_WIDTH + WHITE_KEY_GAP) 
              - WHITE_KEY_GAP / 2 - BLACK_KEY_WIDTH / 2;
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
      width: this.#type === "white" ? WHITE_KEY_WIDTH : BLACK_KEY_WIDTH,
      startTime: Date.now(),
      released: false,
      top: 400,
      height: 0,
    });

    sideEffect(this.#sym);
  }

  release = (synthRef, barsRef) => async() => {
    this.#active = false;
    synthRef.current.triggerRelease(this.#sym);
    barsRef.current = barsRef.current.map(b =>
      b.note === this.#sym && !b.released ? { ...b, released: true } : b
    );
  }

  toHTML = (synthRef, barsRef, sideEffect) => {
    if (this.#type == "white") {
      return (
        <div
          key={this.#sym}
          onMouseDown={this.attack(synthRef, barsRef, sideEffect)}
          onMouseUp={this.release(synthRef, barsRef)}
          className={`white-key ${this.#active ? 'active' : ''}`}
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
          className={`black-key ${this.#active ? 'active' : ''}`}
          style={{ left: `${left}px` }}
          onMouseDown={this.attack(synthRef, barsRef, sideEffect)}
          onMouseUp={this.release(synthRef, barsRef)}
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