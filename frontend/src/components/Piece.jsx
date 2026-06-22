import { Note, Notes } from "./Note.jsx";
import * as Tone from "tone";

const symMap = {};

for (let i = 0; i < Notes.length; i++) {
  symMap[Notes[i].sym] = Notes[i];
}

export class Piece {
  #title;
  #description;
  #navStr;
  #backgroundImageURL;
  #LH;
  #RH;
  
  constructor(title, description, navStr, backgroundImageURL, LH, RH) {
    this.#title = title;
    this.#description = description;
    this.#navStr = navStr;
    this.#backgroundImageURL = backgroundImageURL;
    this.#LH = LH;
    this.#RH = RH;
  }

  get title() {
    return this.#title;
  }

  get description() {
    return this.#description;
  }

  get navStr() {
    return this.#navStr;
  }

  get backgroundImageURL() {
    return this.#backgroundImageURL;
  }

  #displayOneHand = (arr, synthRef, barsRef, sideEffect) => {
    async function timeline() {
      let currentTime = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].note !== "R") {
          Tone.Transport.schedule(time => {
            symMap[arr[i].note].attack(synthRef, barsRef, sideEffect)(time);
          }, currentTime);

          Tone.Transport.schedule(time => {
            symMap[arr[i].note].release(synthRef, barsRef, sideEffect)(time);
          }, currentTime + arr[i].duration - 0.05); // release slightly before the next note
        }
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
      if (this.#LH[i].note !== "R") {
        LHMap[currentTime] = this.#LH[i].note;
      }
      currentTime += 100 * this.#LH[i].duration;
    }
    currentTime = 0;
    for (let i = 0; i < this.#RH.length; i++) {
      if (this.#RH[i].note !== "R") {
        RHMap[currentTime] = this.#RH[i].note;
      }
      currentTime += 100 * this.#RH[i].duration;
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