import { Notes } from "../components/Notes.jsx";
import * as Tone from "tone";

const symMap = new Map();

for (let i = 0; i < Notes.length; i++) {
  symMap.set(Notes[i].sym, Notes[i]);
}

export class Piece {
  #id;
  #title;
  #description;
  #navStr;
  #backgroundImageURL;
  #author;
  #difficultyLevel;
  #pianoDeco1;
  #pianoDeco2;
  #pianoDeco3;
  #pianoDeco4;
  #pianoDeco5;
  #pianoDeco6;
  #RH;
  #LH;

  constructor(id, title, description, navStr, backgroundImageURL, author, difficultyLevel, pianoDeco1, pianoDeco2, pianoDeco3, pianoDeco4, pianoDeco5, pianoDeco6, RH, LH) {
    this.#id = id;
    this.#title = title;
    this.#description = description;
    this.#navStr = navStr;
    this.#backgroundImageURL = backgroundImageURL;
    this.#author = author;
    this.#difficultyLevel = difficultyLevel;
    this.#pianoDeco1 = pianoDeco1;
    this.#pianoDeco2 = pianoDeco2;
    this.#pianoDeco3 = pianoDeco3;
    this.#pianoDeco4 = pianoDeco4;
    this.#pianoDeco5 = pianoDeco5;
    this.#pianoDeco6 = pianoDeco6;
    this.#RH = RH;
    this.#LH = LH;
  }

  get id() {
    return this.#id;
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

  get author() {
    return this.#author;
  }

  get difficultyLevel() {
    return this.#difficultyLevel;
  }

  get pianoDeco1() {
    return this.#pianoDeco1;
  }

  get pianoDeco2() {
    return this.#pianoDeco2;
  }

  get pianoDeco3() {
    return this.#pianoDeco3;
  }

  get pianoDeco4() {
    return this.#pianoDeco4;
  }

  get pianoDeco5() {
    return this.#pianoDeco5;
  }

  get pianoDeco6() {
    return this.#pianoDeco6;
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