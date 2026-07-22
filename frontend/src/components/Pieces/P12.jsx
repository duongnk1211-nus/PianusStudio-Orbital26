import { Piece } from "../../classes/Piece.jsx";

const P12 = new Piece(
  "12",
  "Bach's Minuet",
  `The Minuets in G major and G minor, BWV Anh. 114 and 115, are a pair of movements from a suite for harpsichord by Christian Petzold in 1720, which, through their appearance in the 1725 Notebook for Anna Magdalena Bach, used to be attributed to Johann Sebastian Bach. These minuets, which are suitable for beginners on the piano, are among the best known pieces of music literature. The 1965 pop song "A Lover's Concerto", of which millions of copies were sold, is based on the first of these Minuets.`,
  "bachminuet",
  "/Pieces/P12.png",
  "Christian Petzold",
  "5",
  "/AssetsForPiano/cloud.png",
  "/AssetsForPiano/shiningMoon.png",
  "/AssetsForPiano/cherryBlossom.png",
  "/AssetsForPiano/cloud.png",
  "/AssetsForPiano/flyingBird.png",
  "/AssetsForPiano/cloud.png",
  [
    // Measure 1
    { chord: 'D5', duration: 0.2 }, { chord: 'G4', duration: 0.2 }, { chord: 'A4', duration: 0.2 },
    // Measure 2
    { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'D5', duration: 0.2 },
    // Measure 3
    { chord: 'G5', duration: 0.2 }, { chord: 'F#5', duration: 0.2 }, { chord: 'E5', duration: 0.2 },
    // Measure 4
    { chord: 'D5', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'B4', duration: 0.2 },
    // Measure 5 (held cadence note, full measure)
    { chord: 'A4', duration: 0.6 },
    // Measure 6
    { chord: 'D5', duration: 0.2 }, { chord: 'G4', duration: 0.2 }, { chord: 'A4', duration: 0.2 },
    // Measure 7
    { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'D5', duration: 0.2 },
    // Measure 8 (closing cadence, full measure)
    { chord: 'G4', duration: 0.6 },
    // Measure 9 - rising toward the dominant
    { chord: 'A4', duration: 0.2 }, { chord: 'D5', duration: 0.2 }, { chord: 'E5', duration: 0.2 },
    // Measure 10
    { chord: 'F#5', duration: 0.2 }, { chord: 'G5', duration: 0.2 }, { chord: 'F#5', duration: 0.2 },
    // Measure 11 - descending
    { chord: 'E5', duration: 0.2 }, { chord: 'D5', duration: 0.2 }, { chord: 'C5', duration: 0.2 },
    // Measure 12 (held note, full measure)
    { chord: 'B4', duration: 0.6 },
    // Measure 13 - answering phrase
    { chord: 'A4', duration: 0.2 }, { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 },
    // Measure 14
    { chord: 'D5', duration: 0.2 }, { chord: 'E5', duration: 0.2 }, { chord: 'F#5', duration: 0.2 },
    // Measure 15 - final descending run back to tonic
    { chord: 'E5', duration: 0.2 }, { chord: 'D5', duration: 0.2 }, { chord: 'C5', duration: 0.2 },
    // Measure 16 (final cadence, full measure)
    { chord: 'G4', duration: 0.6 },

    // Measure 1
    { chord: 'D5', duration: 0.2 }, { chord: 'G4', duration: 0.2 }, { chord: 'A4', duration: 0.2 },
    // Measure 2
    { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'D5', duration: 0.2 },
    // Measure 3
    { chord: 'G5', duration: 0.2 }, { chord: 'F#5', duration: 0.2 }, { chord: 'E5', duration: 0.2 },
    // Measure 4
    { chord: 'D5', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'B4', duration: 0.2 },
    // Measure 5 (held cadence note, full measure)
    { chord: 'A4', duration: 0.6 },
    // Measure 6
    { chord: 'D5', duration: 0.2 }, { chord: 'G4', duration: 0.2 }, { chord: 'A4', duration: 0.2 },
    // Measure 7
    { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'D5', duration: 0.2 },
    // Measure 8 (closing cadence, full measure)
    { chord: 'G4', duration: 0.6 },
    // Measure 9 - rising toward the dominant
    { chord: 'A4', duration: 0.2 }, { chord: 'D5', duration: 0.2 }, { chord: 'E5', duration: 0.2 },
    // Measure 10
    { chord: 'F#5', duration: 0.2 }, { chord: 'G5', duration: 0.2 }, { chord: 'F#5', duration: 0.2 },
    // Measure 11 - descending
    { chord: 'E5', duration: 0.2 }, { chord: 'D5', duration: 0.2 }, { chord: 'C5', duration: 0.2 },
    // Measure 12 (held note, full measure)
    { chord: 'B4', duration: 0.6 },
    // Measure 13 - answering phrase
    { chord: 'A4', duration: 0.2 }, { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 },
    // Measure 14
    { chord: 'D5', duration: 0.2 }, { chord: 'E5', duration: 0.2 }, { chord: 'F#5', duration: 0.2 },
    // Measure 15 - final descending run back to tonic
    { chord: 'E5', duration: 0.2 }, { chord: 'D5', duration: 0.2 }, { chord: 'C5', duration: 0.2 },
    // Measure 16 (final cadence, full measure)
    { chord: 'G4', duration: 0.6 },

    // Measure 1-4 unchanged
    { chord: 'D5', duration: 0.2 }, { chord: 'G4', duration: 0.2 }, { chord: 'A4', duration: 0.2 },
    { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'D5', duration: 0.2 },
    { chord: 'G5', duration: 0.2 }, { chord: 'F#5', duration: 0.2 }, { chord: 'E5', duration: 0.2 },
    { chord: 'D5', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'B4', duration: 0.2 },
    // Measure 5 - ornamental turn instead of a held note (same total 0.6s)
    { chord: 'A4', duration: 0.2 }, { chord: 'B4', duration: 0.2 }, { chord: 'A4', duration: 0.2 },
    // Measure 6-7 unchanged
    { chord: 'D5', duration: 0.2 }, { chord: 'G4', duration: 0.2 }, { chord: 'A4', duration: 0.2 },
    { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'D5', duration: 0.2 },
    // Measure 8 - ornamental turn
    { chord: 'G4', duration: 0.2 }, { chord: 'A4', duration: 0.2 }, { chord: 'G4', duration: 0.2 },
    // Measure 9-11 unchanged
    { chord: 'A4', duration: 0.2 }, { chord: 'D5', duration: 0.2 }, { chord: 'E5', duration: 0.2 },
    { chord: 'F#5', duration: 0.2 }, { chord: 'G5', duration: 0.2 }, { chord: 'F#5', duration: 0.2 },
    { chord: 'E5', duration: 0.2 }, { chord: 'D5', duration: 0.2 }, { chord: 'C5', duration: 0.2 },
    // Measure 12 - ornamental turn
    { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'B4', duration: 0.2 },
    // Measure 13-15 unchanged
    { chord: 'A4', duration: 0.2 }, { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 },
    { chord: 'D5', duration: 0.2 }, { chord: 'E5', duration: 0.2 }, { chord: 'F#5', duration: 0.2 },
    { chord: 'E5', duration: 0.2 }, { chord: 'D5', duration: 0.2 }, { chord: 'C5', duration: 0.2 },
    // Measure 16 - ornamental turn
    { chord: 'G4', duration: 0.2 }, { chord: 'A4', duration: 0.2 }, { chord: 'G4', duration: 0.2 },

    // Measure 1-4 unchanged
    { chord: 'D5', duration: 0.2 }, { chord: 'G4', duration: 0.2 }, { chord: 'A4', duration: 0.2 },
    { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'D5', duration: 0.2 },
    { chord: 'G5', duration: 0.2 }, { chord: 'F#5', duration: 0.2 }, { chord: 'E5', duration: 0.2 },
    { chord: 'D5', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'B4', duration: 0.2 },
    // Measure 5 - ornamental turn instead of a held note (same total 0.6s)
    { chord: 'A4', duration: 0.2 }, { chord: 'B4', duration: 0.2 }, { chord: 'A4', duration: 0.2 },
    // Measure 6-7 unchanged
    { chord: 'D5', duration: 0.2 }, { chord: 'G4', duration: 0.2 }, { chord: 'A4', duration: 0.2 },
    { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'D5', duration: 0.2 },
    // Measure 8 - ornamental turn
    { chord: 'G4', duration: 0.2 }, { chord: 'A4', duration: 0.2 }, { chord: 'G4', duration: 0.2 },
    // Measure 9-11 unchanged
    { chord: 'A4', duration: 0.2 }, { chord: 'D5', duration: 0.2 }, { chord: 'E5', duration: 0.2 },
    { chord: 'F#5', duration: 0.2 }, { chord: 'G5', duration: 0.2 }, { chord: 'F#5', duration: 0.2 },
    { chord: 'E5', duration: 0.2 }, { chord: 'D5', duration: 0.2 }, { chord: 'C5', duration: 0.2 },
    // Measure 12 - ornamental turn
    { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 }, { chord: 'B4', duration: 0.2 },
    // Measure 13-15 unchanged
    { chord: 'A4', duration: 0.2 }, { chord: 'B4', duration: 0.2 }, { chord: 'C5', duration: 0.2 },
    { chord: 'D5', duration: 0.2 }, { chord: 'E5', duration: 0.2 }, { chord: 'F#5', duration: 0.2 },
    { chord: 'E5', duration: 0.2 }, { chord: 'D5', duration: 0.2 }, { chord: 'C5', duration: 0.2 },
    // Measure 16 - ornamental turn
    { chord: 'G4', duration: 0.2 }, { chord: 'A4', duration: 0.2 }, { chord: 'G4', duration: 0.2 },
  ],
  [
    { chord: 'G3', duration: 0.6 }, // M1: I
    { chord: 'D3', duration: 0.6 }, // M2: V
    { chord: 'G3', duration: 0.6 }, // M3: I
    { chord: 'D3', duration: 0.6 }, // M4: V
    { chord: 'C3', duration: 0.6 }, // M5: IV
    { chord: 'G3', duration: 0.6 }, // M6: I
    { chord: 'D3', duration: 0.6 }, // M7: V
    { chord: 'G3', duration: 0.6 }, // M8: I (final cadence)
    { chord: 'D3', duration: 0.6 }, // M9: V
    { chord: 'G3', duration: 0.6 }, // M10: I
    { chord: 'D3', duration: 0.6 }, // M11: V
    { chord: 'G3', duration: 0.6 }, // M12: I
    { chord: 'C3', duration: 0.6 }, // M13: IV
    { chord: 'D3', duration: 0.6 }, // M14: V
    { chord: 'D3', duration: 0.6 }, // M15: V
    { chord: 'G3', duration: 0.6 }, // M16: I (final cadence)

    { chord: 'G3', duration: 0.6 }, // M1: I
    { chord: 'D3', duration: 0.6 }, // M2: V
    { chord: 'G3', duration: 0.6 }, // M3: I
    { chord: 'D3', duration: 0.6 }, // M4: V
    { chord: 'C3', duration: 0.6 }, // M5: IV
    { chord: 'G3', duration: 0.6 }, // M6: I
    { chord: 'D3', duration: 0.6 }, // M7: V
    { chord: 'G3', duration: 0.6 }, // M8: I (final cadence)
    { chord: 'D3', duration: 0.6 }, // M9: V
    { chord: 'G3', duration: 0.6 }, // M10: I
    { chord: 'D3', duration: 0.6 }, // M11: V
    { chord: 'G3', duration: 0.6 }, // M12: I
    { chord: 'C3', duration: 0.6 }, // M13: IV
    { chord: 'D3', duration: 0.6 }, // M14: V
    { chord: 'D3', duration: 0.6 }, // M15: V
    { chord: 'G3', duration: 0.6 }, // M16: I (final cadence)

    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M1: I
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M2: V
    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M3: I
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M4: V
    { chord: 'C3', duration: 0.3 }, { chord: 'G3', duration: 0.3 }, // M5: IV
    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M6: I
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M7: V
    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M8: I
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M9: V
    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M10: I
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M11: V
    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M12: I
    { chord: 'C3', duration: 0.3 }, { chord: 'G3', duration: 0.3 }, // M13: IV
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M14: V
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M15: V
    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M16: I (final cadence)

    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M1: I
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M2: V
    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M3: I
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M4: V
    { chord: 'C3', duration: 0.3 }, { chord: 'G3', duration: 0.3 }, // M5: IV
    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M6: I
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M7: V
    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M8: I
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M9: V
    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M10: I
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M11: V
    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M12: I
    { chord: 'C3', duration: 0.3 }, { chord: 'G3', duration: 0.3 }, // M13: IV
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M14: V
    { chord: 'D3', duration: 0.3 }, { chord: 'A3', duration: 0.3 }, // M15: V
    { chord: 'G3', duration: 0.3 }, { chord: 'D4', duration: 0.3 }, // M16: I (final cadence)
  ]
);

export default P12;