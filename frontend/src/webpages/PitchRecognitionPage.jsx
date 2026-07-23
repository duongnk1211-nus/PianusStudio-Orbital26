import { useNavigate } from "react-router-dom";
import "../styles/PitchRecognitionPage.css";

function ExerciseShelf( { y } ) {
  const navigate = useNavigate();
  const goToExercise = (y) => { navigate(`/pitch-recognition/ex-${y}`); }

  const x = Math.ceil(y / 5);
  return (
    <div className="exercise-shelf">
      <h3>Exercise #{y}</h3>
      <p>High score: 0/{x}</p>
      <button onClick={() => goToExercise((y))}>Attempt</button>
    </div>  
  );
}

function DifficultySelf( { x } ) {
  return (
    <div className="difficulty-shelf">
      <h2>Difficulty {x}: {x} note{x > 1 ? "s" : ""}</h2>
      <div className="five-exercises-shelf">
        {([1, 2, 3, 4, 5]).map((i) => (
          <ExerciseShelf y = { (x - 1) * 5 + i } />
        ))}
      </div>
    </div>
  );
}

export default function PitchRecognitionPage() {
  const navigate = useNavigate();
  const goBack = () => { navigate(-1); }
  
  return (
    <div className='pitch-recognition-page' id="pitch-recognition-page">
      <button className="return-btn" onClick={goBack}>Go Back</button>
      <img src="/PianusStudio.png" />
      <h1>Pitch Recognition Exercises</h1>
      <div className='pitch-recognition-self'>
        <p style={{marginLeft: "20px"}}>Welcome to Pianus Studio's Pitch Recognition Exercises!</p>
        <p style={{marginLeft: "20px"}}>A place you can train your ears to become a better listener and better pianist. 🎶</p>
        <p style={{marginLeft: "20px"}}>The greater the difficulty of an exercise is, the more notes at a higher speed you need to listen to.</p>
        <p style={{marginLeft: "20px"}}>More exercises coming soon! 🎉</p>

        {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).map(i => (
          <DifficultySelf x = {i} />
        ))}
      </div>
    </div>
  );
}