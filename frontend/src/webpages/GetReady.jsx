import '../styles/GetReady.css';
import { useNavigate } from 'react-router-dom';

export default function GetReady() {
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
    <div className="get-ready-body">
      <div className="get-ready-table">
        <span className="corner-bl" />
        <span className="corner-br" />
        <h1>Are you ready?</h1>
        <p>Moonlight Sonata</p>
        <p style={{ marginTop: '30px', marginLeft: '20px', textAlign: 'left', fontFamily: 'Orbitron' }}>Difficulty Level: 1500</p>
        <p style={{ marginTop: '0px', marginLeft: '20px', textAlign: 'left', fontFamily: 'Orbitron' }}>Your top score: 0</p>
        <table>
          <thead>
            <tr style={{ display: 'flex' }}>
              <th style={{ flex: '0 0 120px' }}>Rank</th>
              <th style={{ flex: 1 }}>Pianist</th>
              <th style={{ flex: '0 0 135px' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr style={{ display: 'flex' }} key={song.rank} onClick={() => navigate(`/lessons/${song.title.replace(/\s+/g, '-').toLowerCase()}/get-ready`)}>
                <td style={{ flex: '0 0 120px' }}>{song.rank}</td>
                <td style={{ flex: 1 }}>{song.author}</td>
                <td style={{ flex: '0 0 120px' }}>{song.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="get-ready-buttons">
            <button onClick={goBack}>Return</button>
            <button onClick={() => navigate(`/lessons/moonlight-sonata/play`)}>Start</button>
        </div>
      </div>
    </div>
  )
}