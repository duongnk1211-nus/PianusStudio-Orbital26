import '../styles/Lessons.css';
import { useEffect, useState } from 'react';
import { apiFetch } from "../components/API.jsx";
import { useNavigate } from 'react-router-dom';
import { PieceList } from "../components/PieceList.jsx";

export default function LessonsPage() {
  const navigate = useNavigate();
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/user/scores').then(setScores)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const goBack = () => {
    navigate('/');
  }

  return (
    <div className="lessons-page" id="lessons-page">
      <div className="lessons-header">
        <button onClick={goBack}>Return</button>
        <h1 className="energetic-title">Learn & Score!</h1>
        <p>Pick your favourite & master it!</p>
      </div>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>Song</th>
            <th>Author</th>
            <th>Level</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {PieceList.slice().reverse().map((P) => (
            <tr key={P.id} onClick={scores ? () => navigate(`/challenges/${P.navStr}/get-ready`) : () => navigate('/login')}>
              <td>{P.id}</td>
              <td>{P.title}</td>
              <td>{P.author}</td>
              <td>{P.difficultyLevel}</td>
              <td>{loading ? 'Loading...' : (scores ? scores[P.id-1].top_score : 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}