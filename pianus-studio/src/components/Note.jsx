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

  #computedLeftForNote = () => {
    if (this.#type === "white") {
      return this.#offset * (WHITE_KEY_WIDTH + WHITE_KEY_GAP);
    } else {
      return (this.#offset + 1) * (WHITE_KEY_WIDTH + WHITE_KEY_GAP) 
              - WHITE_KEY_GAP / 2 - BLACK_KEY_WIDTH / 2;
    }
  }

  attack = (synthRef, barsRef) => async () => {
    this.#active = true;
    await Tone.start();
    synthRef.current.triggerAttack(this.#sym);

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

  release = (synthRef, barsRef) => async() => {
    this.#active = false;
    synthRef.current.triggerRelease(this.#sym);
    barsRef.current = barsRef.current.map(b =>
      b.note === this.#sym && !b.released ? { ...b, released: true } : b
    );
  }

  toHTML = (synthRef, barsRef) => {
    if (this.#type == "white") {
      return (
        <div
          key={this.#sym}
          onMouseDown={this.attack(synthRef, barsRef)}
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
          onMouseDown={this.attack(synthRef, barsRef)}
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