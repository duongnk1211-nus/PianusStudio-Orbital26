import '../styles/Lessons.css';
import { useNavigate } from 'react-router-dom';

export default function LessonsPage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  }

  const songs = [
    { rank: 1, title: "Moonlight Sonata", author: "Ludwig van Beethoven", score: 2500 },
    { rank: 2, title: "Fur Elise", author: "Ludwig van Beethoven", score: 2200 },
    { rank: 3, title: "Canon in D", author: "Johann Pachelbel", score: 1800 },
    { rank: 4, title: "Clair de Lune", author: "Claude Debussy", score: 1500 },
    { rank: 5, title: "Nocturne in E-flat Major", author: "Frédéric Chopin", score: 1200 },
    { rank: 6, title: "The Entertainer", author: "Scott Joplin", score: 1000 },
    { rank: 7, title: "Rhapsody in Blue", author: "George Gershwin", score: 900 },
    { rank: 8, title: "Gymnopédie No.1", author: "Erik Satie", score: 800 },
    { rank: 9, title: "Prelude in C Major", author: "Johann Sebastian Bach", score: 700 },
    { rank: 10, title: "Hungarian Rhapsody No.2", author: "Franz Liszt", score: 600 },
  ];

  return (
    <div className="lessons-body">
      <div className="lessons-header">
        <button onClick={goBack}>Return</button>
        <h1 className="energetic-title">Learn & Score!</h1>
        <p>"The piano is the easiest instrument to play in the beginning, and the hardest to master in the end."
        <span style={{ marginTop: '0px', fontStyle: 'italic' }}> - Vladimir Horowitz</span></p>
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
          {songs.map((song) => (
            <tr key={song.rank} onClick={() => navigate(`/lessons/${song.title.replace(/\s+/g, '-').toLowerCase()}`)}>
              <td>{song.rank}</td>
              <td>{song.title}</td>
              <td>{song.author}</td>
              <td>{song.score}</td>
              <td>{song.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}