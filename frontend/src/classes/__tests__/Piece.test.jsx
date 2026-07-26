import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock('tone', () => ({
  start: vi.fn().mockResolvedValue(undefined),
  Transport: {
    schedule: vi.fn((callback, time) => callback(time)),
    stop: vi.fn(),
    start: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    seconds: 0,
    state: 'stopped',
  },
}));

import * as Tone from "tone";
import { Piece } from "../Piece_simplified.jsx";

function makeRefs() {
  return {
    synthRef: { current: { triggerAttack: vi.fn(), triggerRelease: vi.fn() } },
    barsRef: { current: [] },
    sideEffect: vi.fn(),
  };
}

describe('Piece', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor validation', () => {
    it('throws when RH and LH total durations differ', () => {
      expect(() => new Piece('T', 'D', 'n', '/i.jpg',
        [{ chord: 'C4', duration: 1.0 }],
        [{ chord: 'E4', duration: 1.5 }]
      )).toThrow();
    });
  
    it('does not throw when totals match, even with a different number of entries per hand', () => {
      expect(() => new Piece('T', 'D', 'n', '/i.jpg',
        [{ chord: 'C4', duration: 0.5 }, { chord: 'D4', duration: 0.5 }],
        [{ chord: 'E3', duration: 1.0 }]
      )).not.toThrow();
    });
  });

  describe('getters', () => {
    it('exposes the values passed into the constructor', () => {
      const p = new Piece("T", "D", "n", "/img.png", [], []);

      expect(p.title).toBe("T");
      expect(p.description).toBe("D");
      expect(p.navStr).toBe("n");
      expect(p.backgroundImageURL).toBe("/img.png");
    });
  });

  describe('breakChords()', () => {
    it('creates a breakpoint with only right-hand data when only RH has a chord at that time', () => {
      const p = new Piece("T", "D", "n", "/img.png",
        [{ chord: "C4 E4 G4", duration: 1.0, fingers: "1 3 5" }],
        [{ chord: "", duration: 1.0 }]
      );

      const result = p.breakChords();

      expect(result).toHaveLength(1);
      expect(result[0].chord).toEqual(new Set(["C4", "E4", "G4"]));
      expect(result[0].rightFingers).toBe("1 3 5");
      expect(result[0].leftFingers).toBe("");
    });

    it('creates a breakpoint with only left-hand data when only LH has a chord at that time', () => {
      const p = new Piece("T", "D", "N", "/i.png",
        [{ chord: '', duration: 1.0 }],
        [{ chord: "G3 B3 D4", duration: 1.0, fingers: "5 3 1" }]
      );

      const result = p.breakChords();

      expect(result).toHaveLength(1);
      expect(result[0].chord).toEqual(new Set(["G3", "B3", "D4"]));
      expect(result[0].leftFingers).toBe("5 3 1");
      expect(result[0].rightFingers).toBe("");
    });

    it('merges RH and LH chords into one breakpoint when they land at the same time', () => {
      const p = new Piece("T", "D", "N", "/i.png",
        [{ chord: "C5 E5 G5", duration: 1.0, fingers: "1 3 5" }],
        [{ chord: "C4 E4 G4", duration: 1.0, fingers: "5 3 1" }]
      );

      const result = p.breakChords();

      expect(result).toHaveLength(1);
      expect(result[0].chord).toEqual(new Set(["C5", "E5", "G5", "C4", "E4", "G4"]));
      expect(result[0].rightFingers).toBe("1 3 5");
      expect(result[0].leftFingers).toBe("5 3 1");
    });

    it('skips rests as their own breakpoint, while still advancing the timing offset correctly', () => {
      const p = new Piece("T", "D", "N", "/i.png",
        [
          { chord: "", duration: 0.5 },
          { chord: "D4", duration: 1.0, fingers: "2" },
        ],
        [{ chord: "", duration: 1.5 }]
      );

      const result = p.breakChords();

      expect(result).toHaveLength(1);
      expect(result[0].chord).toEqual(new Set(["D4"]));
      expect(result[0].rightFingers).toBe("2");
      expect(result[0].leftFingers).toBe("");
    });
  });

  describe('display() scheduling', () => {
    it('schedules an attack then a release for a right-hand chord', async () => {
      const { synthRef, barsRef, sideEffect } = makeRefs();
      const P = new Piece("T", "D", "N", "/i.png",
        [{ chord: "F5", duration: 0.5, fingers: "4" }],
        [{ chord: "", duration: 0.5 }]
      );

      await P.display(synthRef, barsRef, sideEffect, vi.fn(), vi.fn())();

      expect(synthRef.current.triggerAttack).toHaveBeenCalledWith("F5", 0);
      expect(synthRef.current.triggerRelease).toHaveBeenCalledWith("F5", 0.45);
      expect(barsRef.current).toHaveLength(1);
      expect(barsRef.current[0]).toMatchObject({ note: "F5", addOn: "right", released: true });
      expect(sideEffect).toHaveBeenNthCalledWith(1, "F5", true);
      expect(sideEffect).toHaveBeenNthCalledWith(2, "F5", false);
    });

    it('schedules an attack then a release for a left-hand chord', async () => {
      const { synthRef, barsRef, sideEffect } = makeRefs();
      const P = new Piece("T", "D", "N", "/i.png",
        [{ chord: "", duration: 0.5 }],
        [{ chord: "F5", duration: 0.5, fingers: "4" }]
      );

      await P.display(synthRef, barsRef, sideEffect, vi.fn(), vi.fn())();

      expect(barsRef.current[0]).toMatchObject({ note: "F5", addOn: "left", released: true });
    });

    it('toggles setIsAttacking true then false for a scheduled finger', async () => {
      const { synthRef, barsRef, sideEffect } = makeRefs();
      const setIsAttackingRight = vi.fn();
      const P = new Piece("T", "D", "N", "/i.png",
        [{ chord: "C6", duration: 0.5, fingers: "5" }],
        [{ chord: "", duration: 0.5 }]
      );

      await P.display(synthRef, barsRef, sideEffect, setIsAttackingRight, vi.fn())();

      expect(setIsAttackingRight).toHaveBeenCalledTimes(2);
      const afterAttack = setIsAttackingRight.mock.calls[0][0](new Array(5).fill(false));
      expect(afterAttack[4]).toBe(true);
      const afterRelease = setIsAttackingRight.mock.calls[1][0](afterAttack);
      expect(afterRelease[4]).toBe(false);
    });

    it('schedules Tone.Transport.stop() exactly once, using the shared total duration', async () => {
      const { synthRef, barsRef, sideEffect } = makeRefs();
      const p = new Piece("T", "D", "n", "/i.png",
        [{ chord: "", duration: 1.0 }],
        [{ chord: "", duration: 1.0 }]
      );
    
      await p.display(synthRef, barsRef, sideEffect, vi.fn(), vi.fn())();
    
      expect(Tone.Transport.stop).toHaveBeenCalledTimes(1);
    });
  });
});