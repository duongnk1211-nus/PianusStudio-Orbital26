import { Notes } from "../components/Notes.jsx";
import { Record } from "../classes/Record.jsx";
import * as Tone from "tone";

const DEFAULT_DURATION = 2.0;

const symMap = new Map();

for (let i = 0; i < Notes.length; i++) {
  symMap.set(Notes[i].sym, Notes[i]);
}

export class AudioRecord extends Record {
  constructor() {
    super(DEFAULT_DURATION, []);
  }

  static generate(symList) {
    const result = new AudioRecord();
    const n = symList.length, d = DEFAULT_DURATION / n;
    let curr = 0.0;
    for (let i = 0; i < n; i++) {
      result.addAction({ type: "attack", sym: symList[i], time: curr });
      result.addAction({ type: "release", sym: symList[i], time: curr + d - 0.05 });
      curr += d;
    }
    return result;
  }

  // @Override
  display = (synthRef) => {
    const actions = this.actions;
    const duration = this.duration;
    async function timeline() {
      for (let i = 0; i < actions.length; i++) {
        if (actions[i].type === "attack") {
          Tone.Transport.schedule(time => {
            symMap.get(actions[i].sym).attackWithoutVisual(synthRef)(time);
          }, actions[i].time);
        } else {
          Tone.Transport.schedule(time => {
            symMap.get(actions[i].sym).releaseWithoutVisual(synthRef)(time);
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