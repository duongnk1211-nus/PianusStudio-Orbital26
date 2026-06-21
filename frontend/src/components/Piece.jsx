import { Note, Notes } from "./Note.jsx";
import * as Tone from "tone";

const symMap = {};

for (let i = 0; i < Notes.length; i++) {
  symMap[Notes[i].sym] = Notes[i];
}

export class Piece {
  #title;
  #LH;
  #RH;
  
  constructor(title, LH, RH) {
    this.#title = title;
    this.#LH = LH;
    this.#RH = RH;
  }

  get title() {
    return this.#title;
  }

  #displayOneHand = (arr, synthRef, barsRef, sideEffect) => {
    async function timeline() {
      let currentTime = 0;
      for (let i = 0; i < arr.length; i++) {
        Tone.Transport.schedule(time => {
          symMap[arr[i].note].attack(synthRef, barsRef, sideEffect)();
        }, currentTime);

        Tone.Transport.schedule(time => {
          symMap[arr[i].note].release(synthRef, barsRef, sideEffect)();
        }, currentTime + arr[i].duration - 0.05); // release slightly before the next note

        currentTime += arr[i].duration;
      }

      Tone.Transport.schedule(time => {
        Tone.Transport.stop();
      }, currentTime); // release slightly before the next note
    }
    return timeline;
  }

  display = (synthRef, barsRef, sideEffect) => () => {
    this.#displayOneHand(this.#LH, synthRef, barsRef, sideEffect)();
    this.#displayOneHand(this.#RH, synthRef, barsRef, sideEffect)();
  }

  breakChords = () => {
    const LHMap = {}, RHMap = {};
    
    let currentTime = 0;
    for (let i = 0; i < this.#LH.length; i++) {
      LHMap[currentTime] = this.#LH[i].note;
      currentTime += 10 * this.#LH[i].duration;
    }
    currentTime = 0;
    for (let i = 0; i < this.#RH.length; i++) {
      RHMap[currentTime] = this.#RH[i].note;
      currentTime += 10 * this.#RH[i].duration;
    }

    let totTime = currentTime;
    let result = [];
    for (let t = 0; t <= totTime; t++) {
      let s = new Set();
      if (LHMap[t] !== undefined) s.add(LHMap[t]);
      if (RHMap[t] !== undefined) s.add(RHMap[t]);

      if (s.size > 0) {
        result.push(s);
      }
    }
    return result;
  }
}