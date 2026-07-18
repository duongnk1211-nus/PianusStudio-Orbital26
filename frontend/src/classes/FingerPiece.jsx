import { Notes } from "../components/Notes.jsx";
import * as Tone from "tone";

const symMap = new Map();

for (let i = 0; i < Notes.length; i++) {
  symMap.set(Notes[i].sym, Notes[i]);
}

export class FingerPiece {
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

  #displayOneHand = (arr, synthRef, barsRef, sideEffect, addOn, setIsAttacking) => {
    async function timeline() {
      let currentTime = 0;
      for (let i = 0; i < arr.length; i++) {
        let C = arr[i].chord != "" ? arr[i].chord.split(" ") : [];
        let F = arr[i].fingers ? arr[i].fingers.split(" ").map(f => parseInt(f)) : [];

        for (const sym of C) {
          Tone.Transport.schedule(time => {
            symMap.get(sym).attack(synthRef, barsRef, sideEffect, addOn)(time);
          }, currentTime);

          Tone.Transport.schedule(time => {
            symMap.get(sym).release(synthRef, barsRef, sideEffect)(time);
          }, currentTime + arr[i].duration - 0.05); // release slightly before the next note
        }

        for (const f of F) {
          Tone.Transport.schedule(time => {
            (async() => {
              setIsAttacking(prev => {
              const newIsAttacking = [...prev];
              newIsAttacking[f - 1] = true;
              return newIsAttacking;
              });
            })(time);
          }, currentTime);

          Tone.Transport.schedule(time => {
            (async() => {
              setIsAttacking(prev => {
                const newIsAttacking = [...prev];
                newIsAttacking[f - 1] = false;
                return newIsAttacking;
              });
            })(time);
          }, currentTime + arr[i].duration - 0.05); // release slightly before the next note
        }
        currentTime += arr[i].duration;
      }

      Tone.Transport.schedule(time => {
        Tone.Transport.stop();
      }, currentTime);
    }
    return timeline;
  }

  display = (synthRef, barsRef, sideEffect, setIsAttackingRight, setIsAttackingLeft) => () => {
    this.#displayOneHand(this.#RH, synthRef, barsRef, sideEffect, "right", setIsAttackingRight)();
    this.#displayOneHand(this.#LH, synthRef, barsRef, sideEffect, "left", setIsAttackingLeft)();
  }

  breakChords = () => {
    const RHMap = new Map(), LHMap = new Map();
    const timeSet = new Set();

    let currentTimeRight = 0;
    for (let i = 0; i < this.#RH.length; i++) {
      if (this.#RH[i].chord !== "") {
        RHMap.set(currentTimeRight, i);
        timeSet.add(currentTimeRight);
      }
      currentTimeRight += this.#RH[i].duration;
    }
    let currentTimeLeft = 0;
    for (let i = 0; i < this.#LH.length; i++) {
      if (this.#LH[i].chord !== "") {
        LHMap.set(currentTimeLeft, i);
        timeSet.add(currentTimeLeft);
      }
      currentTimeLeft += this.#LH[i].duration;
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
      result.push({
        chord: s, 
        rightFingers: RHMap.get(t) !== undefined ? this.#RH[RHMap.get(t)].fingers : "", 
        leftFingers: LHMap.get(t) !== undefined ? this.#LH[LHMap.get(t)].fingers : ""}
      );
    }
    return result;
  }
}