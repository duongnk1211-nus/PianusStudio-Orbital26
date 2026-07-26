import { describe, it, expect, vi } from 'vitest';
import { Note } from '../Note.jsx';

function makeRefs() {
  return {
    synthRef: { current: { triggerAttack: vi.fn(), triggerRelease: vi.fn() } },
    barsRef: { current: [] },
    sideEffect: vi.fn(),
  };
}

describe('Note', () => {
  describe('type classification', () => {
    it('five random white keys have type = "white"', () => {
      const sample = ["E3", "D4", "G4", "F5", "C6"];
      for (const sym of sample) {
        expect(new Note(sym, 0).type).toBe("white");
      }
    });
    it('five random black keys have type = "black"', () => {
      const sample = ["F#3", "C#4", "A#4", "D#5", "G#5"];
      for (const sym of sample) {
        expect(new Note(sym, 0).type).toBe("black");
      }
    });
  });

  describe('attack() / release() lifecycle', () => {
    it('a random note walks through four methods sequentially: attack -> repeat attack (no-op) -> release -> repeat release(no-op)', async () => {
      const { synthRef, barsRef, sideEffect } = makeRefs();
      const sym = "F#5";
      const n = new Note(sym, 0);
      const t = [0.05, 0.06, 0.1, 0.11];

      await n.attack(synthRef, barsRef, sideEffect, "")(t[0]);
      expect(n.active).toBe(true);
      expect(synthRef.current.triggerAttack).toHaveBeenCalledWith(sym, t[0]);
      expect(barsRef.current).toHaveLength(1);
      expect(barsRef.current[0]).toMatchObject({ note: sym, released: false });
      expect(sideEffect).toHaveBeenCalledWith(sym, true);

      await n.attack(synthRef, barsRef, sideEffect, "")(t[1]);
      expect(synthRef.current.triggerAttack).toHaveBeenCalledTimes(1);
      expect(barsRef.current).toHaveLength(1);

      await n.release(synthRef, barsRef, sideEffect)(t[2]);
      expect(n.active).toBe(false);
      expect(synthRef.current.triggerRelease).toHaveBeenCalledWith(sym, t[2]);
      expect(barsRef.current[0].released).toBe(true);
      expect(sideEffect).toHaveBeenCalledWith(sym, false);

      await n.release(synthRef, barsRef, sideEffect)(t[3]);
      expect(synthRef.current.triggerRelease).toHaveBeenCalledTimes(1);
      expect(sideEffect).toHaveBeenCalledTimes(2);
    });

    it('a note when released does not affect the synthesia bars of other notes', async() => {
      const { synthRef, barsRef, sideEffect } = makeRefs();
      const n1 = new Note("C#5", 0);
      const n2 = new Note("G#4", 0);
      const n3 = new Note("D3", 0);
      const t_attack = 0.5;
      const t_release = 1.0;

      await n1.attack(synthRef, barsRef, sideEffect, "")(t_attack);
      await n2.attack(synthRef, barsRef, sideEffect, "")(t_attack);
      await n3.attack(synthRef, barsRef, sideEffect, "")(t_attack);
      await n1.release(synthRef, barsRef, sideEffect)(t_release);

      const [b1, b2, b3] = barsRef.current;
      expect(b1.released).toBe(true);
      expect(b2.released).toBe(false);
      expect(b2.released).toBe(false);
    });
  });

  describe('guide flag', () => {
    it('a random note walks through setGuide() and unsetGuide() sequentially', async () => {
      const sym = "C6";
      const n = new Note(sym, 0);
      expect(n.guide).toBe(false);
      await n.setGuide();
      expect(n.guide).toBe(true);
      await n.unsetGuide();
      expect(n.guide).toBe(false);
    });
  });

  describe('attackWithoutVisual() / releaseWithoutVisual()', () => {
    it('attackWithoutVisual() and releaseWithoutVisual() call synthRef (for tone) only', async () => {
      const synthRef = { current: { triggerAttack: vi.fn(), triggerRelease: vi.fn() } };
      const sym = "C#3";
      const n = new Note(sym, 0);
      const t_attack = 0.2;
      const t_release = 0.4;

      await n.attackWithoutVisual(synthRef)(t_attack);
      await n.releaseWithoutVisual(synthRef)(t_release);

      expect(synthRef.current.triggerAttack).toHaveBeenCalledWith(sym, t_attack);
      expect(synthRef.current.triggerRelease).toHaveBeenCalledWith(sym, t_release);
      expect(n.active).toBe(false);
    });
  });
});