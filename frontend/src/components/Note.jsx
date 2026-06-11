import "../styles/Piano.css";
import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

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

  get active() {
    return this.#active;
  }

  get type() {
    return this.#type;
  }

  #computedLeftForNote = () => {
    if (this.#type === "white") {
      return this.#offset * (WHITE_KEY_WIDTH + WHITE_KEY_GAP);
    } else {
      return (this.#offset + 1) * (WHITE_KEY_WIDTH + WHITE_KEY_GAP) 
              - WHITE_KEY_GAP / 2 - BLACK_KEY_WIDTH / 2;
    }
  }

  attack = (synthRef, barsRef, setActiveKeys) => async () => {
    await Tone.start();
    synthRef.current.triggerAttack(this.#sym);

    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.add(this.#key);
      return newSet;
    });

    barsRef.current.push({
      id: Date.now() + Math.random(),
      note: this.#sym,
      type: this.#type,
      left: this.#computedLeftForNote(),  // same formula you already use for black keys
      width: this.#type === "white" ? WHITE_KEY_WIDTH : BLACK_KEY_WIDTH,
      startTime: Date.now(),
      released: false,
      top: 400,
      height: 0,
    });
  }

  release = (synthRef, barsRef, setActiveKeys) => async() => {
    synthRef.current.triggerRelease(this.#sym);
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(this.#key);
        return newSet;
    });
    barsRef.current = barsRef.current.map(b =>
      b.note === this.#sym && !b.released ? { ...b, released: true } : b
    );
  }

  toHTML = (synthRef, barsRef, activeKeys,setActiveKeys) => {
    if (this.#type == "white") {
      return (
        <div
          key={this.#sym}
          onMouseDown={this.attack(synthRef, barsRef, setActiveKeys)}
          onMouseUp={this.release(synthRef, barsRef, setActiveKeys)}
          className={`white-key ${activeKeys.has(this.#key) ? 'active' : ''}`}
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
          className={`black-key ${activeKeys.has(this.#key) ? 'active' : ''}`}
          style={{ left: `${left}px` }}
          onMouseDown={this.attack(synthRef, barsRef, setActiveKeys)}
          onMouseUp={this.release(synthRef, barsRef, setActiveKeys)}
        >
          <span className="black-key-letter-label">
            {this.#key.toUpperCase()}
          </span>
        </div>
      );
    }
  }
}