import { Piece } from "../../classes/Piece.jsx";

const P11 = new Piece(
  "11",
  "Canon in D",
  `The canon was originally scored for three violins and basso continuo and paired with a gigue, known as Canon and Gigue for 3 violins and basso continuo. Both movements are in the key of D major. The piece is constructed as a true canon at the unison in three parts, with a fourth part as a ground bass throughout. Neither the date nor the circumstances of its composition are known, and the oldest surviving manuscript copy of the piece dates from 1838 to 1842.`,
  "canonind",
  "/Pieces/P11.png",
  "Johann Pachelbel",
  "4",
  "/AssetsForPiano/cloud.png",
  "/AssetsForPiano/shiningMoon.png",
  "/AssetsForPiano/cherryBlossom.png",
  "/AssetsForPiano/cloud.png",
  "/AssetsForPiano/flyingBird.png",
  "/AssetsForPiano/cloud.png",
[
// D major (D F# A)
  { chord: 'D4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  // A major (A C# E)
  { chord: 'A4', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'E5', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  // B minor (B D F#)
  { chord: 'B4', duration: 0.25 }, { chord: 'D5', duration: 0.25 },
  { chord: 'F#5', duration: 0.25 }, { chord: 'D5', duration: 0.25 },
  // F# minor (F# A C#)
  { chord: 'F#4', duration: 0.25 }, { chord: 'A4', duration: 0.25 },
  { chord: 'C#5', duration: 0.25 }, { chord: 'A4', duration: 0.25 },
  // G major (G B D)
  { chord: 'G4', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'D5', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  // D major (D F# A)
  { chord: 'D4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  // G major (G B D)
  { chord: 'G4', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'D5', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  // A major (A C# E)
  { chord: 'A4', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'E5', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },

  { chord: 'A4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'D4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'E5', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'F#5', duration: 0.25 }, { chord: 'D5', duration: 0.25 },
  { chord: 'B4', duration: 0.25 }, { chord: 'D5', duration: 0.25 },
  { chord: 'C#5', duration: 0.25 }, { chord: 'A4', duration: 0.25 },
  { chord: 'F#4', duration: 0.25 }, { chord: 'A4', duration: 0.25 },
  { chord: 'D5', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'G4', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'D4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'D5', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'G4', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'E5', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },

  // D major (D F# A)
  { chord: 'D4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  // A major (A C# E)
  { chord: 'A4', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'E5', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  // B minor (B D F#)
  { chord: 'B4', duration: 0.25 }, { chord: 'D5', duration: 0.25 },
  { chord: 'F#5', duration: 0.25 }, { chord: 'D5', duration: 0.25 },
  // F# minor (F# A C#)
  { chord: 'F#4', duration: 0.25 }, { chord: 'A4', duration: 0.25 },
  { chord: 'C#5', duration: 0.25 }, { chord: 'A4', duration: 0.25 },
  // G major (G B D)
  { chord: 'G4', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'D5', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  // D major (D F# A)
  { chord: 'D4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  // G major (G B D)
  { chord: 'G4', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'D5', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  // A major (A C# E)
  { chord: 'A4', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'E5', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },

  { chord: 'A4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'D4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'E5', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'F#5', duration: 0.25 }, { chord: 'D5', duration: 0.25 },
  { chord: 'B4', duration: 0.25 }, { chord: 'D5', duration: 0.25 },
  { chord: 'C#5', duration: 0.25 }, { chord: 'A4', duration: 0.25 },
  { chord: 'F#4', duration: 0.25 }, { chord: 'A4', duration: 0.25 },
  { chord: 'D5', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'G4', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'D4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'D5', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'G4', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'E5', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },

  // D major (D F# A)
  { chord: 'D4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  // A major (A C# E)
  { chord: 'A4', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'E5', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  // B minor (B D F#)
  { chord: 'B4', duration: 0.25 }, { chord: 'D5', duration: 0.25 },
  { chord: 'F#5', duration: 0.25 }, { chord: 'D5', duration: 0.25 },
  // F# minor (F# A C#)
  { chord: 'F#4', duration: 0.25 }, { chord: 'A4', duration: 0.25 },
  { chord: 'C#5', duration: 0.25 }, { chord: 'A4', duration: 0.25 },
  // G major (G B D)
  { chord: 'G4', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'D5', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  // D major (D F# A)
  { chord: 'D4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  // G major (G B D)
  { chord: 'G4', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'D5', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  // A major (A C# E)
  { chord: 'A4', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'E5', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },

  { chord: 'A4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'D4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'E5', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'F#5', duration: 0.25 }, { chord: 'D5', duration: 0.25 },
  { chord: 'B4', duration: 0.25 }, { chord: 'D5', duration: 0.25 },
  { chord: 'C#5', duration: 0.25 }, { chord: 'A4', duration: 0.25 },
  { chord: 'F#4', duration: 0.25 }, { chord: 'A4', duration: 0.25 },
  { chord: 'D5', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'G4', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'D4', duration: 0.25 }, { chord: 'F#4', duration: 0.25 },
  { chord: 'D5', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'G4', duration: 0.25 }, { chord: 'B4', duration: 0.25 },
  { chord: 'E5', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
  { chord: 'A4', duration: 0.25 }, { chord: 'C#5', duration: 0.25 },
],
[
  { chord: 'D3',  duration: 1.0 }, // I
  { chord: 'A3',  duration: 1.0 }, // V
  { chord: 'B3',  duration: 1.0 }, // vi
  { chord: 'F#3', duration: 1.0 }, // iii
  { chord: 'G3',  duration: 1.0 }, // IV
  { chord: 'D3',  duration: 1.0 }, // I
  { chord: 'G3',  duration: 1.0 }, // IV
  { chord: 'A3',  duration: 1.0 }, // V

  { chord: 'D3',  duration: 1.0 }, // I
  { chord: 'A3',  duration: 1.0 }, // V
  { chord: 'B3',  duration: 1.0 }, // vi
  { chord: 'F#3', duration: 1.0 }, // iii
  { chord: 'G3',  duration: 1.0 }, // IV
  { chord: 'D3',  duration: 1.0 }, // I
  { chord: 'G3',  duration: 1.0 }, // IV
  { chord: 'A3',  duration: 1.0 }, // V

  { chord: 'D3',  duration: 1.0 }, // I
  { chord: 'A3',  duration: 1.0 }, // V
  { chord: 'B3',  duration: 1.0 }, // vi
  { chord: 'F#3', duration: 1.0 }, // iii
  { chord: 'G3',  duration: 1.0 }, // IV
  { chord: 'D3',  duration: 1.0 }, // I
  { chord: 'G3',  duration: 1.0 }, // IV
  { chord: 'A3',  duration: 1.0 }, // V

  { chord: 'D3',  duration: 1.0 }, // I
  { chord: 'A3',  duration: 1.0 }, // V
  { chord: 'B3',  duration: 1.0 }, // vi
  { chord: 'F#3', duration: 1.0 }, // iii
  { chord: 'G3',  duration: 1.0 }, // IV
  { chord: 'D3',  duration: 1.0 }, // I
  { chord: 'G3',  duration: 1.0 }, // IV
  { chord: 'A3',  duration: 1.0 }, // V

  { chord: 'D3',  duration: 1.0 }, // I
  { chord: 'A3',  duration: 1.0 }, // V
  { chord: 'B3',  duration: 1.0 }, // vi
  { chord: 'F#3', duration: 1.0 }, // iii
  { chord: 'G3',  duration: 1.0 }, // IV
  { chord: 'D3',  duration: 1.0 }, // I
  { chord: 'G3',  duration: 1.0 }, // IV
  { chord: 'A3',  duration: 1.0 }, // V

  { chord: 'D3',  duration: 1.0 }, // I
  { chord: 'A3',  duration: 1.0 }, // V
  { chord: 'B3',  duration: 1.0 }, // vi
  { chord: 'F#3', duration: 1.0 }, // iii
  { chord: 'G3',  duration: 1.0 }, // IV
  { chord: 'D3',  duration: 1.0 }, // I
  { chord: 'G3',  duration: 1.0 }, // IV
  { chord: 'A3',  duration: 1.0 }, // V
]
);

export default P11;