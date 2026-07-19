import { Piece } from "../../classes/Piece.jsx";

const P9 = new Piece(
  "9",
  "Moonlight Sonata",
  "Moonlight Sonata is a masterpiece of piano composition, known for its haunting melody and emotional depth. This piece showcases the piano's ability to convey a wide range of emotions, from gentle serenity to passionate intensity.",
  "moonlightsonata",
  "/Pieces/P9.png",
  "Ludwig van Beethoven",
  "3",
  "/AssetsForPiano/cloud.png",
  "/AssetsForPiano/shiningMoon.png",
  "/AssetsForPiano/cloud.png",
  "/AssetsForPiano/cloud.png",
  "/AssetsForPiano/shiningWhite.png",
  "/AssetsForPiano/cloud.png",
  [
    // Measure 1 (i: C#m)
    { chord: 'G#3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 }, { chord: 'E4', duration: 0.5 },
    { chord: 'G#3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 }, { chord: 'E4', duration: 0.5 },
    { chord: 'G#3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 }, { chord: 'E4', duration: 0.5 },
    { chord: 'G#3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 }, { chord: 'E4', duration: 0.5 },

    // Measure 2 (i: C#m, sustained)
    { chord: 'G#3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 }, { chord: 'E4', duration: 0.5 },
    { chord: 'G#3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 }, { chord: 'E4', duration: 0.5 },
    { chord: 'G#3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 }, { chord: 'E4', duration: 0.5 },
    { chord: 'G#3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 }, { chord: 'E4', duration: 0.5 },

    // Measure 3 (iv: F#m)
    { chord: 'F#3', duration: 0.5 }, { chord: 'A3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 },
    { chord: 'F#3', duration: 0.5 }, { chord: 'A3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 },
    { chord: 'F#3', duration: 0.5 }, { chord: 'A3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 },
    { chord: 'F#3', duration: 0.5 }, { chord: 'A3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 },

    // Measure 4 (V: G#7)
    { chord: 'G#3', duration: 0.5 }, { chord: 'B3', duration: 0.5 }, { chord: 'D#4', duration: 0.5 },
    { chord: 'G#3', duration: 0.5 }, { chord: 'B3', duration: 0.5 }, { chord: 'D#4', duration: 0.5 },
    { chord: 'G#3', duration: 0.5 }, { chord: 'B3', duration: 0.5 }, { chord: 'D#4', duration: 0.5 },
    { chord: 'G#3', duration: 0.5 }, { chord: 'B3', duration: 0.5 }, { chord: 'D#4', duration: 0.5 },

    // Measure 5 (i: C#m — melody entrance would layer on top here)
    { chord: 'G#3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 }, { chord: 'E4', duration: 0.5 },
    { chord: 'G#3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 }, { chord: 'E4', duration: 0.5 },
    { chord: 'G#3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 }, { chord: 'E4', duration: 0.5 },
    { chord: 'G#3', duration: 0.5 }, { chord: 'C#4', duration: 0.5 }, { chord: 'E4', duration: 0.5 },

    // Measure 6 (VI: A maj)
    { chord: 'A3', duration: 1 }, { chord: 'C#4', duration: 1 }, { chord: 'F#4', duration: 1 },
    { chord: 'A3', duration: 1 }, { chord: 'C#4', duration: 1 }, { chord: 'F#4', duration: 1 },
    { chord: 'A3', duration: 1 }, { chord: 'C#4', duration: 1 }, { chord: 'F#4', duration: 1 },
    { chord: 'A3', duration: 1 }, { chord: 'C#4', duration: 1 }, { chord: 'F#4', duration: 1 },

    // Measure 7 (V: G#7)
    { chord: 'G#3', duration: 1 }, { chord: 'B3', duration: 1 }, { chord: 'D#4', duration: 1 },
    { chord: 'G#3', duration: 1 }, { chord: 'B3', duration: 1 }, { chord: 'D#4', duration: 1 },
    { chord: 'G#3', duration: 1 }, { chord: 'B3', duration: 1 }, { chord: 'D#4', duration: 1 },
    { chord: 'G#3', duration: 1 }, { chord: 'B3', duration: 1 }, { chord: 'D#4', duration: 1 },

    // Measure 8 (i: C#m — cadence)
    { chord: 'G#3', duration: 1 }, { chord: 'C#4', duration: 1 }, { chord: 'E4', duration: 1 },
    { chord: 'G#3', duration: 1 }, { chord: 'C#4', duration: 1 }, { chord: 'E4', duration: 1 },
    { chord: 'G#3', duration: 1 }, { chord: 'C#4', duration: 1 }, { chord: 'E4', duration: 1 },
    { chord: 'G#3', duration: 1 }, { chord: 'C#4', duration: 1 }, { chord: 'E4', duration: 1 },
  ],

  [
    // Measure 1 (i)
    { chord: 'C#3', duration: 3.0 }, { chord: 'G#3', duration: 3.0 },
    // Measure 2 (i)
    { chord: 'C#3', duration: 3.0 }, { chord: 'G#3', duration: 3.0 },
    // Measure 3 (iv)
    { chord: 'F#3', duration: 3.0 }, { chord: 'C#4', duration: 3.0 },
    // Measure 4 (V)
    { chord: 'G#3', duration: 3.0 }, { chord: 'D#4', duration: 3.0 },
    // Measure 5 (i)
    { chord: 'C#3', duration: 3.0 }, { chord: 'G#3', duration: 3.0 },

    // Measure 6 (VI)
    { chord: 'F#3', duration: 6.0 }, { chord: 'A3', duration: 6.0 },
    // Measure 7 (V)
    { chord: 'G#3', duration: 6.0 }, { chord: 'D#4', duration: 6.0 },
    // Measure 8 (i)
    { chord: 'C#3', duration: 6.0 }, { chord: 'G#3', duration: 6.0 },
  ]
);

export default P9;