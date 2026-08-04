import { Piece } from "../../classes/Piece.jsx";

const P10 = new Piece(
  "10",
  "Fur Elise",
  `Für Elise is undeniably one of the most popular piano pieces in existence. Elise - whoever she is - isn’t the only mystery woman in Beethoven’s life. The subject of his “Immortal Beloved” letters has also been much debated over the years. The identity of "Elise" has eluded historians and scholars for decades. The bagatelle wasn’t discovered and published until 40 years after Beethoven’s death, so he certainly wasn’t around to tell tales of the woman who had inspired the composition. Scholars believe “Elise” must have been pretty close to Beethoven, but no one has been able to definitively prove who she really was.`,
  "furelise",
  "/Pieces/P10.png",
  "Ludwig van Beethoven",
  "4",
  "/AssetsForPiano/cloud.png",
  "/AssetsForPiano/shiningMoon.png",
  "/AssetsForPiano/cherryBlossom.png",
  "/AssetsForPiano/cloud.png",
  "/AssetsForPiano/flyingBird.png",
  "/AssetsForPiano/cloud.png",
[
// Famous opening motif
  { chord: 'E5',  duration: 0.3 }, { chord: 'D#5', duration: 0.3 },
  { chord: 'E5',  duration: 0.3 }, { chord: 'D#5', duration: 0.3 },
  { chord: 'E5',  duration: 0.3 }, { chord: 'B4',  duration: 0.3 },
  { chord: 'D5',  duration: 0.3 }, { chord: 'C5',  duration: 0.3 },
  { chord: 'A4',  duration: 0.6 },
  { chord: 'R',   duration: 0.3 },
 
  { chord: 'C4',  duration: 0.3 }, { chord: 'E4',  duration: 0.3 },
  { chord: 'A4',  duration: 0.3 }, { chord: 'B4',  duration: 0.6 },
  { chord: 'R',   duration: 0.3 },
 
  { chord: 'E4',  duration: 0.3 }, { chord: 'G#4', duration: 0.3 },
  { chord: 'B4',  duration: 0.3 }, { chord: 'C5',  duration: 0.6 },
  { chord: 'R',   duration: 0.3 },
 
  // Descending return phrase
  { chord: 'E4',  duration: 0.3 }, { chord: 'D#5', duration: 0.3 },
  { chord: 'E5',  duration: 0.3 }, { chord: 'D#5', duration: 0.3 },
  { chord: 'E5',  duration: 0.3 }, { chord: 'B4',  duration: 0.3 },
  { chord: 'D5',  duration: 0.3 }, { chord: 'C5',  duration: 0.3 },
  { chord: 'A4',  duration: 0.6 },
  { chord: 'R',   duration: 0.3 },
 
  // Closing run - ascending then descending toward the cadence
  { chord: 'B4',  duration: 0.3 }, { chord: 'C5',  duration: 0.3 },
  { chord: 'D5',  duration: 0.3 }, { chord: 'E5',  duration: 0.3 },
  { chord: 'G4',  duration: 0.3 }, { chord: 'F4',  duration: 0.3 },
  { chord: 'E4',  duration: 0.3 }, { chord: 'D4',  duration: 0.3 },
 
  { chord: 'C4',  duration: 0.3 }, { chord: 'E4',  duration: 0.3 },
  { chord: 'A4',  duration: 0.3 }, { chord: 'B4',  duration: 0.6 },
  { chord: 'R',   duration: 0.3 },
  { chord: 'E4',  duration: 0.9 }, // held cadence note, closes section A

  // Famous opening motif
  { chord: 'E5',  duration: 0.3 }, { chord: 'D#5', duration: 0.3 },
  { chord: 'E5',  duration: 0.3 }, { chord: 'D#5', duration: 0.3 },
  { chord: 'E5',  duration: 0.3 }, { chord: 'B4',  duration: 0.3 },
  { chord: 'D5',  duration: 0.3 }, { chord: 'C5',  duration: 0.3 },
  { chord: 'A4',  duration: 0.6 },
  { chord: 'R',   duration: 0.3 },
 
  { chord: 'C4',  duration: 0.3 }, { chord: 'E4',  duration: 0.3 },
  { chord: 'A4',  duration: 0.3 }, { chord: 'B4',  duration: 0.6 },
  { chord: 'R',   duration: 0.3 },
 
  { chord: 'E4',  duration: 0.3 }, { chord: 'G#4', duration: 0.3 },
  { chord: 'B4',  duration: 0.3 }, { chord: 'C5',  duration: 0.6 },
  { chord: 'R',   duration: 0.3 },
 
  // Descending return phrase
  { chord: 'E4',  duration: 0.3 }, { chord: 'D#5', duration: 0.3 },
  { chord: 'E5',  duration: 0.3 }, { chord: 'D#5', duration: 0.3 },
  { chord: 'E5',  duration: 0.3 }, { chord: 'B4',  duration: 0.3 },
  { chord: 'D5',  duration: 0.3 }, { chord: 'C5',  duration: 0.3 },
  { chord: 'A4',  duration: 0.6 },
  { chord: 'R',   duration: 0.3 },
 
  // Closing run - ascending then descending toward the cadence
  { chord: 'B4',  duration: 0.3 }, { chord: 'C5',  duration: 0.3 },
  { chord: 'D5',  duration: 0.3 }, { chord: 'E5',  duration: 0.3 },
  { chord: 'G4',  duration: 0.3 }, { chord: 'F4',  duration: 0.3 },
  { chord: 'E4',  duration: 0.3 }, { chord: 'D4',  duration: 0.3 },
 
  { chord: 'C4',  duration: 0.3 }, { chord: 'E4',  duration: 0.3 },
  { chord: 'A4',  duration: 0.3 }, { chord: 'B4',  duration: 0.6 },
  { chord: 'R',   duration: 0.3 },
  { chord: 'E4',  duration: 0.9 }, // held cadence note, closes section A
],
[
  // Bass broken-chord pattern under the opening motif
  // Bass broken-chord pattern under the opening motif (0.9+0.9+0.3+0.3+0.3 = 2.7s previously,
  // now 1.2+1.2+0.3+0.3+0.3 = 3.3s to match the RH's 3.3s opening motif)
  { chord: 'R',  duration: 1.2 },
  { chord: 'A3', duration: 0.3 }, { chord: 'E4', duration: 0.3 }, { chord: 'A3', duration: 0.3 },
  { chord: 'R',  duration: 1.2 },
 
  // Under "C4 E4 A4 B4..." phrase
  { chord: 'A3', duration: 0.3 }, { chord: 'E4', duration: 0.3 }, { chord: 'C4', duration: 0.3 },
  { chord: 'R',  duration: 0.9 },
 
  // Under "E4 G#4 B4 C5..." phrase
  { chord: 'A3', duration: 0.3 }, { chord: 'E4', duration: 0.3 }, { chord: 'A4', duration: 0.3 },
  { chord: 'R',  duration: 0.9 },
 
  // Repeat under the descending return phrase (same 3.3s fix as the opening motif above)
  { chord: 'R',  duration: 1.2 },
  { chord: 'A3', duration: 0.3 }, { chord: 'E4', duration: 0.3 }, { chord: 'A3', duration: 0.3 },
  { chord: 'R',  duration: 1.2 },
 
  // Under the ascending/descending closing run
  { chord: 'R',   duration: 0.9 },
  { chord: 'A3',  duration: 0.3 }, { chord: 'E4', duration: 0.3 }, { chord: 'A3', duration: 0.3 },
  { chord: 'R',   duration: 0.6 },
 
  // Under the final cadence phrase
  { chord: 'A3',  duration: 0.3 }, { chord: 'E4', duration: 0.3 }, { chord: 'C4', duration: 0.3 },
  { chord: 'R',   duration: 0.9 },
  { chord: 'E3',  duration: 0.9 }, // low cadence note under the held E4

  { chord: 'R',  duration: 1.2 },
  { chord: 'A3', duration: 0.3 }, { chord: 'E4', duration: 0.3 }, { chord: 'A3', duration: 0.3 },
  { chord: 'R',  duration: 1.2 },
 
  // Under "C4 E4 A4 B4..." phrase
  { chord: 'A3', duration: 0.3 }, { chord: 'E4', duration: 0.3 }, { chord: 'C4', duration: 0.3 },
  { chord: 'R',  duration: 0.9 },
 
  // Under "E4 G#4 B4 C5..." phrase
  { chord: 'A3', duration: 0.3 }, { chord: 'E4', duration: 0.3 }, { chord: 'A4', duration: 0.3 },
  { chord: 'R',  duration: 0.9 },
 
  // Repeat under the descending return phrase (same 3.3s fix as the opening motif above)
  { chord: 'R',  duration: 1.2 },
  { chord: 'A3', duration: 0.3 }, { chord: 'E4', duration: 0.3 }, { chord: 'A3', duration: 0.3 },
  { chord: 'R',  duration: 1.2 },
 
  // Under the ascending/descending closing run
  { chord: 'R',   duration: 0.9 },
  { chord: 'A3',  duration: 0.3 }, { chord: 'E4', duration: 0.3 }, { chord: 'A3', duration: 0.3 },
  { chord: 'R',   duration: 0.6 },
 
  // Under the final cadence phrase
  { chord: 'A3',  duration: 0.3 }, { chord: 'E4', duration: 0.3 }, { chord: 'C4', duration: 0.3 },
  { chord: 'R',   duration: 0.9 },
  { chord: 'E3',  duration: 0.9 }, // low cadence note under the held E4
]
);

export default P10;