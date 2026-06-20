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

  #displayOneHand = (arr, synthRef, barsRef) => {
    async function timeline() {
      let currentTime = 0;
      for (let i = 0; i < arr.length; i++) {
        Tone.Transport.schedule(time => {
          symMap[arr[i].note].attack(synthRef, barsRef)();
        }, currentTime);

        Tone.Transport.schedule(time => {
          symMap[arr[i].note].release(synthRef, barsRef)();
        }, currentTime + arr[i].duration - 0.05); // release slightly before the next note

        currentTime += arr[i].duration;
      }

      Tone.Transport.schedule(time => {
        Tone.Transport.stop();
      }, currentTime); // release slightly before the next note
    }
    return timeline;
  }

  display = (synthRef, barsRef) => () => {
    this.#displayOneHand(this.#LH, synthRef, barsRef)();
    this.#displayOneHand(this.#RH, synthRef, barsRef)();
  }

  breakChords = () => {
    const LHMap = {}, RHMap = {};
    
    let currentTime = 0;
    for (let i = 0; i < this.#LH.length; i++) {
      LHMap[currentTime] = this.#LH[i].note;
      currentTime += this.#LH[i].duration;
    }
    currentTime = 0;
    for (let i = 0; i < this.#RH.length; i++) {
      RHMap[currentTime] = this.#RH[i].note;
      currentTime += this.#RH[i].duration;
    }

    let totTime = currentTime;
    let arr = [], result = [];
    for (let t = 0; t <= totTime; t += 0.1) {
      arr = [];
      if (LHMap[t] !== undefined) arr.push(LHMap[t]);
      if (RHMap[t] !== undefined) arr.push(RHMap[t]);

      if (arr.length > 0) {
        result.push(arr);
      }
    }

    return result;
  }
}