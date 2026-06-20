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
      let currentTime = Tone.now();
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
}