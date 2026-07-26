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
import { Record } from "../Record.jsx";

function makeRefs() {
  return {
    synthRef: { current: { triggerAttack: vi.fn(), triggerRelease: vi.fn() } },
    barsRef: { current: [] },
    sideEffect: vi.fn(),
  };
}

describe('Record', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('duration getter/setter', () => {
    it('duration getter works well', () => {
      const R = new Record(2.5, []);
      expect(R.duration).toBe(2.5);
    });

    it('duration setter works well', () => {
      const R = new Record(2.5, []);
      R.duration = 4.0;
      expect(R.duration).toBe(4.0);
    });
  });

  describe('actions getter / addAction()', () => {
    it('actions getter works well', () => {
      const initial = [{ type: "attack", sym: "C4", time: 0 }];
      const R = new Record(1.0, initial);
      expect(R.actions).toBe(initial);
    });

    it('addAction() appends a new action to the end of the actions array', () => {
      const R = new Record(1.0, []);

      R.addAction({ type: "attack", sym: "C4", time: 0 });
      R.addAction({ type: "release", sym: "C4", time: 0.5 });

      expect(R.actions).toHaveLength(2);
      expect(R.actions[0]).toMatchObject({ type: "attack", sym: "C4" });
      expect(R.actions[1]).toMatchObject({ type: "release", sym: "C4" });
    });
  });

  describe('display() scheduling', () => {
    it('schedules an attack for an "attack" action', async () => {
      const { synthRef, barsRef, sideEffect } = makeRefs();
      const R = new Record(1.0, [
        { type: "attack", sym: "A5", time: 0.3 },
      ]);

      await R.display(synthRef, barsRef, sideEffect)();

      expect(synthRef.current.triggerAttack).toHaveBeenCalledWith("A5", 0.3);
      expect(barsRef.current).toHaveLength(1);
      expect(barsRef.current[0]).toMatchObject({ note: "A5", released: false });
      expect(sideEffect).toHaveBeenCalledWith("A5", true);
    });

    it('schedules a release for a non-"attack" action', async () => {
      const { synthRef, barsRef, sideEffect } = makeRefs();
      const R = new Record(1.0, [
        { type: "attack", sym: "B5", time: 0 },
        { type: "release", sym: "B5", time: 0.7 },
      ]);

      await R.display(synthRef, barsRef, sideEffect)();

      expect(synthRef.current.triggerRelease).toHaveBeenCalledWith("B5", 0.7);
      expect(barsRef.current[0].released).toBe(true);
      expect(sideEffect).toHaveBeenNthCalledWith(1, "B5", true);
      expect(sideEffect).toHaveBeenNthCalledWith(2, "B5", false);
    });

    it('processes multiple actions across different syms independently', async () => {
      const { synthRef, barsRef, sideEffect } = makeRefs();
      const R = new Record(1.0, [
        { type: "attack", sym: "C6", time: 0 },
        { type: "attack", sym: "G5", time: 0.1 },
        { type: "release", sym: "C6", time: 0.4 },
        { type: "release", sym: "G5", time: 0.5 },
      ]);

      await R.display(synthRef, barsRef, sideEffect)();

      expect(barsRef.current).toHaveLength(2);
      expect(barsRef.current.find(b => b.note === "C6").released).toBe(true);
      expect(barsRef.current.find(b => b.note === "G5").released).toBe(true);
    });

    it('schedules Tone.Transport.stop() exactly once, at the record\'s own duration', async () => {
      const { synthRef, barsRef, sideEffect } = makeRefs();
      const R = new Record(1.25, []);

      await R.display(synthRef, barsRef, sideEffect)();

      expect(Tone.Transport.stop).toHaveBeenCalledTimes(1);
      expect(Tone.Transport.schedule).toHaveBeenLastCalledWith(expect.any(Function), 1.25);
    });
  });
});