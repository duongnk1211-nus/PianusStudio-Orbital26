import '../styles/Lessons.css';
import { useNavigate } from 'react-router-dom';
import { Pieces } from "../components/Pieces.jsx";

export default function LessonsPage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  }

  return (
    <div className="lessons-body">
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
          {Pieces.slice().reverse().map((P) => (
            <tr key={P.id} onClick={() => navigate(`/lessons/${P.navStr}/get-ready`)}>
              <td>{P.id}</td>
              <td>{P.title}</td>
              <td>{P.author}</td>
              <td>{P.difficultyLevel}</td>
              <td>{0}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}