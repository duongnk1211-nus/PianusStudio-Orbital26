import { Notes } from "../components/Notes.jsx";
import * as Tone from "tone";

const symMap = new Map();

for (let i = 0; i < Notes.length; i++) {
  symMap.set(Notes[i].sym, Notes[i]);
}

export class Piece {
  #title;
  #description;
  #navStr;
  #backgroundImageURL;
  #RH;
  #LH;
  
  constructor(title, description, navStr, backgroundImageURL, RH, LH) {
    this.#title = title;
    this.#description = description;
    this.#navStr = navStr;
    this.#backgroundImageURL = backgroundImageURL;
    this.#RH = RH;
    this.#LH = LH;
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
        if (arr[i].chord !== "R") {
          for (const sym of arr[i].chord.split(" ")) {
            Tone.Transport.schedule(time => {
              symMap.get(sym).attack(synthRef, barsRef, sideEffect)(time);
            }, currentTime);

            Tone.Transport.schedule(time => {
              symMap.get(sym).release(synthRef, barsRef, sideEffect)(time);
            }, currentTime + arr[i].duration - 0.05); // release slightly before the next note
          }
        }
        currentTime += arr[i].duration;
      }

      Tone.Transport.schedule(time => {
        Tone.Transport.stop();
      }, currentTime);
    }
    return timeline;
  }

  display = (synthRef, barsRef, sideEffect) => () => {
    this.#displayOneHand(this.#RH, synthRef, barsRef, sideEffect)();
    this.#displayOneHand(this.#LH, synthRef, barsRef, sideEffect)();
  }

  breakChords = () => {
    const RHMap = new Map(), LHMap = new Map();

    let currentTime = 0;
    for (let i = 0; i < this.#RH.length; i++) {
      if (this.#RH[i].chord !== "R") {
        RHMap.set(currentTime, i);
      }
      currentTime += 100 * this.#RH[i].duration;
    }
    currentTime = 0;
    for (let i = 0; i < this.#LH.length; i++) {
      if (this.#LH[i].chord !== "R") {
        LHMap.set(currentTime, i);
      }
      currentTime += 100 * this.#LH[i].duration;
    }

    let totTime = currentTime;
    let result = [];
    for (let t = 0; t <= totTime; t++) {
      let s = new Set();
      if (RHMap.get(t) !== undefined) {
        const i = RHMap.get(t);
        for (const sym of this.#RH[i].chord.split(" ")) {
          s.add(sym);
        }
      }
      if (LHMap.get(t) !== undefined) {
        const i = LHMap.get(t);
        for (const sym of this.#LH[i].chord.split(" ")) {
          s.add(sym);
        }
      }
      
      if (s.size > 0) {
        result.push(s);
      }
    }
    return result;
  }
}