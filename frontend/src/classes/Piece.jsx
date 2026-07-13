import { Notes } from "../components/Notes.jsx";
import * as Tone from "tone";

const symMap = new Map();

for (let i = 0; i < Notes.length; i++) {
  symMap.set(Notes[i].sym, Notes[i]);
}

export class Piece {
  #duration;
  #actions;
  
  constructor(duration, actions) {
    this.#duration = duration;
    this.#actions = actions;
  }

  get duration() {
    return this.#duration;
  }

  set duration(duration) {
    this.#duration = duration;
  }

  addAction(action) {
    this.#actions.push(action);
  }

  get actions() {
    return this.#actions;
  }

  display = (synthRef, barsRef, sideEffect) => {
    const actions = this.#actions;
    const duration = this.#duration;
    async function timeline() {
      for (let i = 0; i < actions.length; i++) {
        if (actions[i].type === "attack") {
          Tone.Transport.schedule(time => {
            symMap.get(actions[i].sym).attack(synthRef, barsRef, sideEffect, "")(time);
          }, actions[i].time);
        } else {
          Tone.Transport.schedule(time => {
            symMap.get(actions[i].sym).release(synthRef, barsRef, sideEffect)(time);
          }, actions[i].time);
        }
      }
      Tone.Transport.schedule(time => {
        Tone.Transport.stop();
      }, duration);
    }
    return timeline;
  }
}