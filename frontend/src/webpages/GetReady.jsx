import '../styles/GetReady.css';
import { useState, useEffect } from 'react';
import { apiFetch } from "../components/API.jsx";
import { supabase } from "../components/supabaseClient";
import { useNavigate, useLocation } from 'react-router-dom';
import { Pieces } from '../components/Pieces';

export default function GetReady({ P }) {
  const navigate = useNavigate();
  const location = useLocation();
  const finalScore = location.state?.finalScore;
  const [scores, setScores] = useState(null);
  const [leaderBoard, setLeaderBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingLeaderBoard, setLoadingLeaderBoard] = useState(true);
  let ranking = 0;

  useEffect(() => {
    async function updateTopScore(newScore) {
      const result = await supabase.auth.getSession();
      const session = result.data.session;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/score/${P.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ current_score: newScore, top_score: newScore })
      });
      if (!res.ok) throw new Error('Upload username failed!');
      return res.json()
    }

    async function updateCurrentScore(newScore) {
      const result = await supabase.auth.getSession();
      const session = result.data.session;
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/score/${P.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ current_score: newScore })
      });
      if (!res.ok) throw new Error('Upload score failed!');
      return res.json();
    }

    if (finalScore === undefined) return;
    if (!scores) return;
    if (finalScore > scores.top_score) {
      updateTopScore(finalScore);
    }
    updateCurrentScore(finalScore);
  }, [finalScore, P, scores])

  useEffect(() => {
    async function GetLeaderBoard() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/leaderboard/${P.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    }

    GetLeaderBoard().then(setLeaderBoard)
      .catch(err => console.error(err))
      .finally(() => setLoadingLeaderBoard(false));
    apiFetch(`/user/score/${P.id}`).then(setScores)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [P]);

  const goBack = () => {
    navigate('/lessons');
  }

  return (
    <div className="get-ready-body">
      <div className="get-ready-table">
        <span className="corner-bl" />
        <span className="corner-br" />
        <h1>Are you ready?</h1>
        <p>{P.title}</p>
        <p style={{ marginTop: '30px', marginLeft: '20px', textAlign: 'left', fontFamily: 'Orbitron' }}>Difficulty Level: {P.difficultyLevel}</p>
        <p style={{ marginTop: '0px', marginLeft: '20px', textAlign: 'left', fontFamily: 'Orbitron' }}>Your current score: {loading ? 'Loading...' : (finalScore !== undefined ? finalScore : scores.current_score)}</p>
        <p style={{ marginTop: '0px', marginLeft: '20px', textAlign: 'left', fontFamily: 'Orbitron' }}>Your top score: {loading ? 'Loading...' : (finalScore !== undefined && finalScore > scores.top_score ? finalScore : scores.top_score)}</p>
        <table>
          <thead>
            <tr style={{ display: 'flex' }}>
              <th style={{ flex: '0 0 120px' }}>Rank</th>
              <th style={{ flex: 1 }}>Pianist</th>
              <th style={{ flex: '0 0 135px' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {loadingLeaderBoard
              ? 'Getting LeaderBoard...'
              : (leaderBoard !== undefined
                ? leaderBoard.slice().reverse().map((row) => {
                  ranking = ranking + 1;
                  return (
                    <tr style={{ display: 'flex' }} key={row.user_id} onClick={() => navigate(`/profile/${row.user_name}`)}>
                      <td style={{ flex: '0 0 120px' }}>{ranking}</td>
                      <td style={{ flex: 1 }}>{row.user_name}</td>
                      <td style={{ flex: '0 0 120px' }}>{row.top_score}</td>
                    </tr>)
                })
                : Pieces.map((piece) => (
                  <tr style={{ display: 'flex' }} key={piece.id} onClick={() => navigate(`/lessons/${piece.navStr}/get-ready`)}>
                    <td style={{ flex: '0 0 120px' }}>{piece.id}</td>
                    <td style={{ flex: 1 }}>{piece.author}</td>
                    <td style={{ flex: '0 0 120px' }}>{piece.difficultyLevel}</td>
                  </tr>)))}
          </tbody>
        </table>
        <div className="get-ready-buttons">
          <button onClick={goBack}>Return</button>
          <button onClick={() => navigate(`/lessons/${P.navStr}/demo`)}>Watch</button>
          <button onClick={() => navigate(`/lessons/${P.navStr}/play`)}>Start</button>
        </div>
      </div>
    </div>
  )
}