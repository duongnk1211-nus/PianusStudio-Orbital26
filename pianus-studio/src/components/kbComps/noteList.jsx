const WhiteNotes = [
    { note: "C3", type: "white", key: "z", offset: 0 },
    { note: "D3", type: "white", key: "x", offset: 1 },
    { note: "E3", type: "white", key: "c", offset: 2 },
    { note: "F3", type: "white", key: "v", offset: 3 },
    { note: "G3", type: "white", key: "b", offset: 4 },
    { note: "A3", type: "white", key: "n", offset: 5 },
    { note: "B3", type: "white", key: "m", offset: 6 },
    { note: "C4", type: "white", key: "q", offset: 7 },
    { note: "D4", type: "white", key: "w", offset: 8 },
    { note: "E4", type: "white", key: "e", offset: 9 },
    { note: "F4", type: "white", key: "r", offset: 10 },
    { note: "G4", type: "white", key: "t", offset: 11 },
    { note: "A4", type: "white", key: "y", offset: 12 },
    { note: "B4", type: "white", key: "u", offset: 13 },
    { note: "C5", type: "white", key: "i", offset: 14 },
    { note: "D5", type: "white", key: "o", offset: 15 },
    { note: "E5", type: "white", key: "p", offset: 16 },
    { note: "F5", type: "white", key: "[", offset: 17 },
    { note: "G5", type: "white", key: "]", offset: 18 },
    { note: "A5", type: "white", key: "\\", offset: 19 },
    { note: "B5", type: "white", key: "     ", offset: 20 },
    { note: "C6", type: "white", key: "      ", offset: 21 },
];

const BlackNotes = [
    { note: "C#3", type: "black", key: "s", offset: 0 },
    { note: "D#3", type: "black", key: "d", offset: 1 },
    { note: "F#3", type: "black", key: "g", offset: 3 },
    { note: "G#3", type: "black", key: "h", offset: 4 },
    { note: "A#3", type: "black", key: "j", offset: 5 },
    { note: "C#4", type: "black", key: "2", offset: 7 },
    { note: "D#4", type: "black", key: "3", offset: 8 },
    { note: "F#4", type: "black", key: "5", offset: 10 },
    { note: "G#4", type: "black", key: "6", offset: 11 },
    { note: "A#4", type: "black", key: "7", offset: 12 },
    { note: "C#5", type: "black", key: "9", offset: 14 },
    { note: "D#5", type: "black", key: "0", offset: 15 },
    { note: "F#5", type: "black", key: "=", offset: 17 },
    { note: "G#5", type: "black", key: "  ", offset: 18 },
    { note: "A#5", type: "black", key: "    ", offset: 19 },
];

export const Notes = [
    ...WhiteNotes,
    ...BlackNotes,
];

export const getKeyMap = () => {
    const result = {};
    for (let i = 0; i < Notes.length; i++) {
        if (Notes[i].key.length === 1) result[Notes[i].key] = Notes[i];
    }
    return result;
}

const WHITE_KEY_WIDTH = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--white-key-width'));
const WHITE_KEY_GAP = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--white-key-gap'));
const BLACK_KEY_WIDTH = parseFloat(getComputedStyle(document.documentElement)
              .getPropertyValue('--black-key-width'));

export const computedLeftForNote = (n) => {
  if (n.type === "white") {
    return n.offset * (WHITE_KEY_WIDTH + WHITE_KEY_GAP);
  } else {
    return (n.offset + 1) * (WHITE_KEY_WIDTH + WHITE_KEY_GAP) 
            - WHITE_KEY_GAP / 2 - BLACK_KEY_WIDTH / 2;
  }
}