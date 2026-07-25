import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../components/API.jsx";
import "../styles/PitchRecognitionPage.css";

function ExerciseShelf({ y, score }) {
  const navigate = useNavigate();
  const goToExercise = (y) => { navigate(`/pitch-recognition/ex-${y}`); }

  const x = Math.ceil(y / 5);
  return (
    <div className="exercise-shelf">
      <h3>Exercise #{y}</h3>
      <p>High score: {score}/{x}</p>
      <button onClick={() => goToExercise((y))}>Attempt</button>
    </div>  
  );
}

function DifficultySelf({ x, scores }) {
  return (
    <div className="difficulty-shelf">
      <h2>Difficulty {x}: {x} note{x > 1 ? "s" : ""}</h2>
      <div className="five-exercises-shelf">
        {([1, 2, 3, 4, 5]).map((i) => {
          const y = (x - 1) * 5 + i;
          return (
            <ExerciseShelf key={y} y={y} score={scores?.[y - 1] ?? 0} />
          );
        })}
      </div>
    </div>
  );
}

export default function PitchRecognitionPage() {
  const navigate = useNavigate();
  const goBack = () => { navigate(-1); }

  const [scores, setScores] = useState(null);
  const [scoresLoading, setScoresLoading] = useState(true);

  useEffect(() => {
    apiFetch('/exercise')
      .then((data) => {
        setScores(data?.pitch_recognition_data ?? []);
        setScoresLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setScores([]);
        setScoresLoading(false);
      });
  }, []);

  const totalScore = (scores ?? []).reduce((sum, s) => sum + (s ?? 0), 0);
  const maxTotalScore = Array.from({ length: 50 }, (_, i) => Math.ceil((i + 1) / 5)).reduce((sum, x) => sum + x, 0);  

  if (scoresLoading) {
    return (
      <p>Loading...</p>
    );
  }

  return (
    <div className='pitch-recognition-page' id="pitch-recognition-page">
      <button className="return-btn" onClick={goBack}>Go Back</button>
      <img src="/PianusStudio.png" />
      <h1>Pitch Recognition Exercises</h1>
      <div className='pitch-recognition-self'>
        <p style={{marginLeft: "20px"}}>Welcome to Pianus Studio's Pitch Recognition Exercises!</p>
        <p style={{marginLeft: "20px"}}>A place you can train your ears to become a better listener and better pianist. 🎶</p>
        <p style={{marginLeft: "20px"}}>The greater the difficulty of an exercise is, the more notes at a higher speed you need to listen to.</p>
        <p style={{marginLeft: "20px"}}>Total score: {totalScore}/{maxTotalScore} 🎉</p>

        {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).map(i => (
          <DifficultySelf key={i} x={i} scores={scores} />
        ))}
      </div>
    </div>
  );
}