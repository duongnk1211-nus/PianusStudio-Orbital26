import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

export const attack = (synthRef) => async (n) => {
    await Tone.start();
    synthRef.current.triggerAttack(n.note);
}

export const release = (synthRef) => async(n) => {
    synthRef.current.triggerRelease(n.note);
}