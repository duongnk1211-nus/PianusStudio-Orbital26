import "../styles/Scoring.css";
import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../components/API";
import { keyMaps } from "../components/keyMaps.jsx";
import { Notes } from "../components/Notes.jsx";
import * as Tone from "tone";

export default function Scoring({ P }) {
  const [displayBars, setDisplayBars] = useState([]);
  const synthRef = useRef(null);
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const isScoringActiveRef = useRef(false);
  const navigate = useNavigate();
  const [isPoppedUp, setIsPoppedUp] = useState(false);
  const [poppedUp, setPoppedUp] = useState(null);
  const [notes, setNotes] = useState(Notes.map(n => ({ item: n, sym: n.sym, correctScoring: false, wrongActive: false })));

  const sideEffect = useMemo(() => {
    return (sym, isAttack) => { };
  }, []);

  const symMap = useMemo(() => {
    const map = new Map();
    for (let i = 0; i < Notes.length; i++) {
      map.set(Notes[i].sym, Notes[i]);
    }
    return map;
  }, []);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiFetch('/user').then(setProfile);
  }, []);

  const scoredBarsRef = useRef(new Set());
  const [score, setScore] = useState(0);
  const scoreRef = useRef(score);
  useEffect(() => {
    scoreRef.current = score > 0 ? score : 0;
  }, [score]);


  useEffect(() => {
    synthRef.current = new Tone.Sampler({
      urls: { "D#1": "Ds1.mp3", "F#1": "Fs1.mp3", A1: "A1.mp3", C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3", A2: "A2.mp3", C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3", A3: "A3.mp3", C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", A4: "A4.mp3", C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3", A5: "A5.mp3", C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3", A6: "A6.mp3", C7: "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3", A7: "A7.mp3", C8: "C8.mp3" },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    const GROW_SPEED = 2;
    const FALL_SPEED = 2;

    const tick = () => {
      barsRef.current = barsRef.current
        .map(b => {
          if (!b.released) {
            return { ...b, height: b.height + GROW_SPEED, top: -2 };
          } else {
            return { ...b, top: b.top + FALL_SPEED };
          }
        })
        .filter(b => b.top < 420);

      let scoreChange = 0;

      barsRef.current = barsRef.current.map(bar => {
        const currentKey = notes.find(n => n.sym === bar.note);
        const checkIfMissed = !currentKey?.item.keyActive && (bar.top + bar.height > 399) && (bar.top < 400);
        const isPastLine = bar.top > 400;

        if (checkIfMissed && !bar.checkScored) {
          scoreChange -= 50;
          return { ...bar, checkMissed: true, checkScored: true };
        }

        if (!isPastLine) return bar;

        if (currentKey?.item.keyActive) {
          // correctly hit
          if (!scoredBarsRef.current.has(bar.id) && !bar.checkScored) {
            scoreChange += 300;
            scoredBarsRef.current.add(bar.id);
          }
        }

        return { ...bar, checkMissed: checkIfMissed, checkScored: true }; // resolved
      });

      if (scoreChange !== 0) {
        setScore(n => n + scoreChange);
      }

      setDisplayBars([...barsRef.current]);

      setNotes(prev => {
        const next = prev.map(entry => {
          const bar = barsRef.current.find(b => b.note === entry.sym);
          const shouldGrow = !!bar && bar.top + bar.height > 360;
          const shouldApply = shouldGrow && entry.item.keyActive;
          const checkWrongActive = !shouldGrow && entry.item.keyActive && isScoringActiveRef.current;
          if (shouldApply !== entry.correctScoring) {
            return { ...entry, correctScoring: shouldApply, wrongActive: checkWrongActive };
          }
          return { ...entry, wrongActive: checkWrongActive };
        });
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    for (const note of Notes) {
      note.release(synthRef, barsRef, sideEffect)();
      note.unsetGuide();
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      synthRef.current?.releaseAll();
      synthRef.current?.dispose();
      barsRef.current = [];
      rafRef.current = null;
      setDisplayBars([]);
    };
  }, []);

  useEffect(() => {
    for (const note of Notes) {
      note.key = " ";
    }
    const bindingOption = profile ? profile.binding_option : 1;
    const keyMap = new Map(Object.entries(keyMaps[bindingOption]));
    const noteMap = new Map();
    for (const [sym, key] of keyMap) {
      if (key !== " ") {
        noteMap.set(key, symMap.get(sym));
        symMap.get(sym).key = key;
      }
    }

    const handleKeyDown = async (e) => {
      if (e.key === " ") return;
      const note = noteMap.get(e.key);
      if (note) {
        e.preventDefault();
        if (e.repeat) return;
        note.attackWithoutBars(synthRef, barsRef, sideEffect)();
        const bar = barsRef.current.find(b => b.note === note.sym);
        const shouldGrow = !!bar && bar.top + bar.height > 360;
        if (!shouldGrow && isScoringActiveRef.current) setScore(n => n - 50);
      }
    };
    const handleKeyUp = async (e) => {
      if (e.key === " ") return;
      const note = noteMap.get(e.key);
      if (note) {
        e.preventDefault();
        note.releaseWithoutBars(synthRef, barsRef, sideEffect)();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, [profile]);

  const [isPlaying, setIsPlaying] = useState(false);

  const flipPlaying = () => {
    const prev = isPlaying;
    if (prev == false) {
      setIsPoppedUp(true);
      setPoppedUp('Ready');
      setTimeout(() => setPoppedUp('3'), 1500);
      setTimeout(() => setPoppedUp('2'), 2500);
      setTimeout(() => setPoppedUp('1'), 3500);
      setTimeout(() => setPoppedUp('Go!'), 4500);
      setTimeout(() => setIsPoppedUp(false), 5500);
      setTimeout(() => {
        if (Tone.Transport.state == "stopped") {
          P.displayForScoring(synthRef, barsRef, sideEffect)();
          isScoringActiveRef.current = true;
        }
        Tone.Transport.start();
      }, 5000);

      setTimeout(() => {
        setIsPoppedUp(true);
        if (scoreRef.current > 2500) {
          setPoppedUp('Nice!');
        } else {
          setPoppedUp('YouCanDoIt!');
        }
      }, 20000);
      setTimeout(() => {
        if (scoreRef.current > 2500) {
          setPoppedUp('Vibing!');
        } else {
          setPoppedUp('KeepGoingggg');
        }
      }, 25000);
      setTimeout(() => setIsPoppedUp(false), 28000);
      setTimeout(() => {
        setIsPoppedUp(true);
        if (scoreRef.current > 4000) {
          setPoppedUp('OnFire!');
        } else {
          setPoppedUp('AlmostThere!');
        }
      }, 45000)
      setTimeout(() => {
        if (scoreRef.current > 5000) {
          setPoppedUp('TopOfTheWorld!');
        } else {
          setPoppedUp('KeepGoingggg');
        }
      }, 48000);
      setTimeout(() => setIsPoppedUp(false), 53000);

    } else {
      Tone.Transport.pause();
      synthRef.current?.releaseAll();
    }
    setIsPlaying(!prev);
  }

  const mouseDownCheck = (n) => {
    n.item.attackWithoutBars(synthRef, barsRef, sideEffect)();
    const bar = barsRef.current.find(b => b.note === n.sym);
    const shouldGrow = !!bar && bar.top + bar.height > 360;
    if (!shouldGrow && isScoringActiveRef.current) setScore(n => n - 50);
    //console.log(`Correct! Note ${n.sym} was played at the right time.`);
    //console.log(n.correctScoring)
  }

  const mouseUpCheck = (n) => {
    n.item.releaseWithoutBars(synthRef, barsRef, sideEffect)();
    //console.log(n.correctScoring)
  }

  useEffect(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel();

    const handleStop = () => {
      if (!isScoringActiveRef.current) return; // ignore stray/setup stop() calls
      isScoringActiveRef.current = false;

      setTimeout(() => {
        setIsPoppedUp(true);
        setPoppedUp('WellDone!');
      }, 2000);
      setTimeout(() => setPoppedUp('SavingScore...'), 4000);
      setTimeout(() => setPoppedUp('Redirecting...'), 6000);
      setTimeout(() => {
        navigate(`/lessons/${P.navStr}/get-ready`, { state: { finalScore: scoreRef.current } });
      }, 8000)
    };

    Tone.Transport.on("stop", handleStop);

    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.Transport.off("stop", handleStop);
    };
  }, []);

  return (
    <div className="scoring-body" style={{ backgroundImage: `url(${P.backgroundImageURL})` }}>
      {!isPlaying && <button className="scoring-body-button" onClick={flipPlaying}>Start</button>}
      <div className={`scoring-header ${P.navStr}`}>
        <h1 className="energetic-title">{P.title}</h1>
      </div>
      {isPlaying && <p className={`scoring-score ${P.navStr}`}>{`Score: ${score < 0 ? 0 : score}`}</p>}
      <div className={`scoring-piano ${P.navStr}`}>
        <div className="scoring-synthesia">
          {isPoppedUp && <div className={`scoring-synthesia-pop-up ${P.navStr}`}>{poppedUp}</div>}
          {displayBars.map(b => (
            <div>
              <div
                key={b.id}
                className={`scoring-synthesia-bar ${P.navStr} ${b.type}`}
                style={{
                  left: `${b.left}px`,
                  width: `${b.width - 2}px`,
                  height: `${b.height}px`,
                  top: `${b.top}px`,
                }}
              />
              {b.checkMissed &&
                <div
                  className={`scoring-missed ${b.type}`}
                  style={{
                    left: `${b.left}px`,
                    top: `360px`,
                  }}>
                  Missed!
                </div>}
            </div>
          ))}
        </div>
        <div className="key-rows">
          {notes.map(n => {
            if (n.item.type == "white") {
              return (
                <div
                  key={n.sym}
                  onMouseDown={() => mouseDownCheck(n)}
                  onMouseUp={() => mouseUpCheck(n)}
                  className={`white-key scoring ${P.navStr} ${n.item.keyActive ? 'active' : ''} ${n.correctScoring ? 'correct' : ''}`}
                >
                  {n.wrongActive && <div className='scoring-wrong'>Wrong!</div>}
                  <span className="white-key-letter-label">
                    {n.item.key.toUpperCase()}
                  </span>
                </div>
              );
            }
            else {
              const left = n.item.computedLeftForNote();
              return (
                <div
                  key={n.item.sym}
                  className={`black-key scoring ${P.navStr} ${n.item.keyActive ? 'active' : ''} ${n.correctScoring ? 'correct' : ''}`}
                  style={{ left: `${left}px` }}
                  onMouseDown={() => mouseDownCheck(n)}
                  onMouseUp={() => mouseUpCheck(n)}
                >
                  {n.wrongActive && <div className='scoring-wrong'>Wrong!</div>}
                  <span className="black-key-letter-label">
                    {n.item.key.toUpperCase()}
                  </span>
                </div>
              );
            }
          }
          )}
        </div>
        <span 
          className="corner-tl" 
          style={{ top: '-70px', left: '10px', backgroundImage: `url(${P.pianoDeco1})`}}
        />
        <span 
          className="corner-tl" 
          style={{ top: '-60px', left: '-40px', backgroundImage: `url(${P.pianoDeco2})`}}
        />
        <span 
          className="corner-tl" 
          style={{ top: '-10px', left: '-50px', backgroundImage: `url(${P.pianoDeco3})`}}
        />
        <span 
          className="corner-tr" 
          style={{ top: '-70px', right: '80px', backgroundImage: `url(${P.pianoDeco4})`}}
        />
        <span 
          className="corner-tr" 
          style={{ top: '-60px', right: '20px', backgroundImage: `url(${P.pianoDeco5})`}}
        />
        <span 
          className="corner-tr" 
          style={{ top: '-45px', right: '-50px', backgroundImage: `url(${P.pianoDeco6})`}}
        />
        <span className="corner-bl" />
        <span className="corner-br" />
      </div>
    </div>
  )
}

export function ScoringDemo({ P }) {
  const [displayBars, setDisplayBars] = useState([]);
  const synthRef = useRef(null);
  const barsRef = useRef([]);
  const rafRef = useRef(null);
  const isScoringActiveRef = useRef(false);
  const navigate = useNavigate();
  const [isPoppedUp, setIsPoppedUp] = useState(false);
  const [poppedUp, setPoppedUp] = useState(null);

  const sideEffect = useMemo(() => {
    return (sym, isAttack) => { };
  }, []);

  const [notes, setNotes] = useState(Notes.map(n => ({ item: n, sym: n.sym, correctScoring: false })));

  useEffect(() => {
    synthRef.current = new Tone.Sampler({
      urls: { "D#1": "Ds1.mp3", "F#1": "Fs1.mp3", A1: "A1.mp3", C2: "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3", A2: "A2.mp3", C3: "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3", A3: "A3.mp3", C4: "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", A4: "A4.mp3", C5: "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3", A5: "A5.mp3", C6: "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3", A6: "A6.mp3", C7: "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3", A7: "A7.mp3", C8: "C8.mp3" },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();

    const GROW_SPEED = 2;
    const FALL_SPEED = 2;

    const tick = () => {
      barsRef.current = barsRef.current
        .map(b => {
          if (!b.released) {
            return { ...b, height: b.height + GROW_SPEED, top: -2 };
          } else {
            return { ...b, top: b.top + FALL_SPEED };
          }
        })
        .filter(b => b.top < 420);

      setDisplayBars([...barsRef.current]);

      setNotes(prev => {
        let changed = false;
        const next = prev.map(entry => {
          const bar = barsRef.current.find(b => b.note === entry.sym);
          const shouldGrow = !!bar && bar.top + bar.height > 400;
          const shouldApply = shouldGrow && entry.item.keyActive;
          if (shouldApply !== entry.correctScoring) {
            changed = true;
            return { ...entry, correctScoring: shouldApply };
          }
          return entry;
        });
        return changed ? next : prev;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    for (const note of Notes) {
      note.release(synthRef, barsRef, sideEffect)();
      note.unsetGuide();
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      synthRef.current?.releaseAll();
      synthRef.current?.dispose();
      barsRef.current = [];
      rafRef.current = null;
      setDisplayBars([]);
    };
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);

  const flipPlaying = () => {
    const prev = isPlaying;
    if (prev == false) {
      setIsPoppedUp(true);
      setPoppedUp('Ready');
      setTimeout(() => setPoppedUp('3'), 1500);
      setTimeout(() => setPoppedUp('2'), 2500);
      setTimeout(() => setPoppedUp('1'), 3500);
      setTimeout(() => setPoppedUp('Go!'), 4500);
      setTimeout(() => setIsPoppedUp(false), 5500);
      setTimeout(() => {
        if (Tone.Transport.state == "stopped") {
          P.displayForDemoScoring(synthRef, barsRef, sideEffect)();
          isScoringActiveRef.current = true;
        }
        Tone.Transport.start();
      }, 4000);
    } else {
      Tone.Transport.pause();
      synthRef.current?.releaseAll();
    }
    setIsPlaying(!prev);
  }

  const mouseDownCheck = (n) => {
    n.item.attackWithoutBars(synthRef, barsRef, sideEffect)();
    //console.log(`Correct! Note ${n.sym} was played at the right time.`);
    //console.log(n.correctScoring)
  }

  const mouseUpCheck = (n) => {
    n.item.releaseWithoutBars(synthRef, barsRef, sideEffect)();
    //console.log(n.correctScoring)
  }

  useEffect(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel();

    const handleStop = () => {
      if (!isScoringActiveRef.current) return; // ignore stray/setup stop() calls
      isScoringActiveRef.current = false;

      setIsPoppedUp(true);
      setPoppedUp('Easy!');
      setTimeout(() => setPoppedUp('YourTurn!'), 2000);
      setTimeout(() => setPoppedUp('Redirecting...'), 4000);
      setTimeout(() => {
        navigate(`/lessons/${P.navStr}/get-ready`);
      }, 6000)
    };

    Tone.Transport.on("stop", handleStop);

    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      Tone.Transport.off("stop", handleStop);
    };
  }, []);

  return (
    <div className="scoring-body" style={{ backgroundImage: `url(${P.backgroundImageURL})` }}>
      {!isPlaying && <button className="scoring-body-button" onClick={flipPlaying}>Start</button>}
      <div className={`scoring-header ${P.navStr}`}>
        <h1 className="energetic-title">{P.title}</h1>
      </div>
      <div className="scoring-piano">
        <div className="scoring-synthesia">
          {isPoppedUp && <div className="scoring-synthesia-pop-up">{poppedUp}</div>}
          {displayBars.map(b => (
            <div
              key={b.id}
              className={`scoring-synthesia-bar ${b.type}`}
              style={{
                left: `${b.left}px`,
                width: `${b.width - 2}px`,
                height: `${b.height}px`,
                top: `${b.top}px`
              }}
            />
          ))}
        </div>
        <div className="key-rows">
          {notes.map(n => {
            if (n.item.type == "white") {
              return (
                <div
                  key={n.sym}
                  onMouseDown={() => mouseDownCheck(n)}
                  onMouseUp={() => mouseUpCheck(n)}
                  className={`white-key scoring ${n.item.keyActive ? 'active' : ''} ${n.correctScoring ? 'correct' : ''}`}
                />
              );
            }
            else {
              const left = n.item.computedLeftForNote();
              return (
                <div
                  key={n.item.sym}
                  className={`black-key scoring ${n.item.keyActive ? 'active' : ''} ${n.correctScoring ? 'correct' : ''}`}
                  style={{ left: `${left}px` }}
                  onMouseDown={() => mouseDownCheck(n)}
                  onMouseUp={() => mouseUpCheck(n)}
                />
              );
            }
          }
          )}
        </div>
        <span className="corner-tl-demo" />
        <span className="corner-tr-demo" />
        <span className="corner-bl" />
        <span className="corner-br" />
      </div>
    </div>
  )
}