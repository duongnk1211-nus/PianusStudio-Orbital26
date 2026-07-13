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

  #displayOneHandForScoring = (arr, synthRef, barsRef, sideEffect) => {
    async function timeline() {
      let currentTime = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].chord !== "R") {
          for (const sym of arr[i].chord.split(" ")) {
            Tone.Transport.schedule(time => {
              symMap.get(sym).attackForScoring(synthRef, barsRef, sideEffect)(time);
            }, currentTime);

            Tone.Transport.schedule(time => {
              symMap.get(sym).releaseForScoring(synthRef, barsRef, sideEffect)(time);
            }, currentTime + arr[i].duration - 0.05); // release slightly before the next note
          }
        }
        currentTime += arr[i].duration;
      }

      return currentTime;
    }
    return timeline;
  }

  displayForScoring = (synthRef, barsRef, sideEffect) => async () => {
    const rhDuration = await this.#displayOneHandForScoring(this.#RH, synthRef, barsRef, sideEffect)();
    const lhDuration = await this.#displayOneHandForScoring(this.#LH, synthRef, barsRef, sideEffect)();
    const totalDuration = Math.max(rhDuration, lhDuration);

    Tone.Transport.schedule(() => {
      Tone.Transport.stop();
    }, totalDuration); // single stop, timed to whichever hand finishes last

  }

  #displayOneHandForDemoScoring = (arr, synthRef, barsRef, sideEffect) => {
    async function timeline() {
      let currentTime = 3.2;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].chord !== "R") {
          for (const sym of arr[i].chord.split(" ")) {
            Tone.Transport.schedule(time => {
              symMap.get(sym).attackWithoutBars(synthRef, barsRef, sideEffect)(time);
            }, currentTime);

            Tone.Transport.schedule(time => {
              symMap.get(sym).releaseWithoutBars(synthRef, barsRef, sideEffect)(time);
            }, currentTime + arr[i].duration - 0.05); // release slightly before the next note
          } 
        }
        currentTime += arr[i].duration;
      }

      return currentTime;
    }
    return timeline;
  }

  displayForDemoScoring = (synthRef, barsRef, sideEffect) => async () => {
    const rhDuration = await this.#displayOneHandForScoring(this.#RH, synthRef, barsRef, sideEffect)();
    const lhDuration = await this.#displayOneHandForScoring(this.#LH, synthRef, barsRef, sideEffect)();
    const rhDemoDuration = await this.#displayOneHandForDemoScoring(this.#RH, synthRef, barsRef, sideEffect)();
    const lhDemoDuration = await this.#displayOneHandForDemoScoring(this.#LH, synthRef, barsRef, sideEffect)();
    const totalDuration = Math.max(rhDuration, lhDuration, rhDemoDuration, lhDemoDuration);

    Tone.Transport.schedule(() => {
      Tone.Transport.stop();
    }, totalDuration); // single stop, timed to whichever hand finishes last

  }


  breakChords = () => {
    const RHMap = new Map(), LHMap = new Map();
    const timeSet = new Set();

    let currentTime = 0;
    for (let i = 0; i < this.#RH.length; i++) {
      if (this.#RH[i].chord !== "R") {
        RHMap.set(currentTime, i);
        timeSet.add(currentTime);
      }
      currentTime += this.#RH[i].duration;
    }
    currentTime = 0;
    for (let i = 0; i < this.#LH.length; i++) {
      if (this.#LH[i].chord !== "R") {
        LHMap.set(currentTime, i);
        timeSet.add(currentTime);
      }
      currentTime += this.#LH[i].duration;
    }

    let result = [];
    for (const t of timeSet) {
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