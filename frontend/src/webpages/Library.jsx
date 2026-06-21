import "../styles/Library.css";
import { useNavigate } from "react-router-dom";
import P1 from "../components/PianoPieces/P1.jsx";

export default function Library() {
  const navigate = useNavigate()
  const goBack = () => { navigate(-1); }
  const goToP1Display = () => { navigate('/library/p1/display'); }
  const goToP1Learn = () => { navigate('/library/p1/learn'); }
  
  return (
    <div className='library-wrapper'>
      <button onClick={goBack}>Go Back</button>
      <img src="/PianusStudio.png" />
      <h1>Music  Library</h1>
      <div className='library-shelf'>
        <p>Welcome to Pianus Studio Library!</p>
        <p>A place where our pianists share their passion! Join us and create your own pieces here! 🎶</p>
        <p>More pieces coming soon! 🎉</p>
        <div className='piece-shelf'>
          <h2>{P1.title}</h2>
          <p style={{marginBottom: '40px'}}><span style={{fontWeight:'1000'}}>Description: </span>{P1.description}</p>
          {/* <p style={{marginBottom: '0px'}}><span style={{fontWeight:'1000'}}>Author:</span> Dao Quang Linh</p> */}
          <button onClick={goToP1Display}>Listen The Piece</button>
          <button onClick={goToP1Learn}>Learn The Piece</button>
        </div>
      </div>
    </div>
  );
}