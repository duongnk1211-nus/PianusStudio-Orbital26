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
import { AudioRecord } from "../AudioRecord.jsx";

describe('AudioRecord', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('constructor works well', () => {
      const R = new AudioRecord();
      expect(R.actions).toEqual([]);
      expect(R.duration).toBe(2.0);
    });
  });

  describe('static generate()', () => {
    it('id getter works well', () => {
      const R = AudioRecord.generate(7, ["C4"]);
      expect(R.id).toBe(7);
    });

    it('a record that has a single note attack at 0, release just before the end', () => {
      const R = AudioRecord.generate(1, ["C4"]);

      expect(R.actions).toEqual([
        { type: "attack", sym: "C4", time: 0 },
        { type: "release", sym: "C4", time: 1.95 },
      ]);
    });

    it('produces exactly 2 actions per note', () => {
      const R = AudioRecord.generate(3, ["C4", "D4", "E4", "F4"]);
      expect(R.actions).toHaveLength(8);
    });

    it('the record\'s total duration stays fixed at 2.0s', () => {
      const short = AudioRecord.generate(1, ["C4"]);
      const long = AudioRecord.generate(2, ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]);

      expect(short.duration).toBe(2.0);
      expect(long.duration).toBe(2.0);
    });
  });

  describe('display()', () => {
    it('schedules triggerAttack/triggerRelease directly on the synth', async () => {
      const synthRef = { current: { triggerAttack: vi.fn(), triggerRelease: vi.fn() } };
      const R = AudioRecord.generate(1, ["G5"]);

      await R.display(synthRef)();

      expect(synthRef.current.triggerAttack).toHaveBeenCalledWith("G5", 0);
      expect(synthRef.current.triggerRelease).toHaveBeenCalledWith("G5", 1.95);
    });

    it('schedules Tone.Transport.stop() exactly once, at the record\'s duration', async () => {
      const synthRef = { current: { triggerAttack: vi.fn(), triggerRelease: vi.fn() } };
      const R = AudioRecord.generate(1, ['A5']);

      await R.display(synthRef)();

      expect(Tone.Transport.stop).toHaveBeenCalledTimes(1);
      expect(Tone.Transport.schedule).toHaveBeenLastCalledWith(expect.any(Function), 2.0);
    });
  });
});