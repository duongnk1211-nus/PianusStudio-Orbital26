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
  #keyActive = false;
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

  get type() {
    return this.#type;
  }

  get active() {
    return this.#active;
  }

  get keyActive() {
    return this.#keyActive;
  }
  
  get guide() {
    return this.#guide;
  }

  computedLeftForNote() {
    return this.#computedLeftForNote();
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

  attackForScoring = (synthRef, barsRef, sideEffect) => async () => {
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

  releaseForScoring = (synthRef, barsRef, sideEffect) => async() => {
    barsRef.current = barsRef.current.map(b =>
      b.note === this.#sym && !b.released ? { ...b, released: true } : b
    );
    sideEffect(this.#sym, false);
  }

  attackWithoutBars = (synthRef, barsRef, sideEffect) => async () => {
    await Tone.start();
    
    this.#keyActive = true;
    synthRef.current.triggerAttack(this.#sym);

    sideEffect(this.#sym, true);
  }

  releaseWithoutBars = (synthRef, barsRef, sideEffect) => async () => {
    this.#keyActive = false;
    synthRef.current.triggerRelease(this.#sym);
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