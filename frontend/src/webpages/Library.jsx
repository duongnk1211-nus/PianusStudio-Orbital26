import "../styles/Library.css";
import { useNavigate } from "react-router-dom";
import P1 from "../components/PianoPieces/P1.jsx";
import P2 from "../components/PianoPieces/P2.jsx";
import P3 from "../components/PianoPieces/P3.jsx";
import P4 from "../components/PianoPieces/P4.jsx";
import P5 from "../components/PianoPieces/P5.jsx";
import P6 from "../components/PianoPieces/P6.jsx";
import P7 from "../components/PianoPieces/P7.jsx";
import P8 from "../components/PianoPieces/P8.jsx";

function PieceShelf( { P } ) {
  const navigate = useNavigate();
  const goToDisplay = () => { navigate(`/library/${P.navStr}/display`); }
  const goToLearn = () => { navigate(`/library/${P.navStr}/learn`); }

  return (
    <div className='piece-shelf'>
      <h2>{P.title}</h2>
      <p style={{marginBottom: '30px'}}><span style={{fontWeight:'1000'}}>Description: </span>{P.description}</p>
      <button onClick={goToDisplay} style={{marginBottom: '0px'}}>Listen & Feel</button>
      <button onClick={goToLearn}>Play it yourself</button>
    </div>
  );
}

export default function Library() {
  const navigate = useNavigate();
  const goBack = () => { navigate(-1); }
  
  return (
    <div className='library-wrapper'>
      <button onClick={goBack}>Go Back</button>
      <img src="/PianusStudio.png" />
      <h1>Music  Library</h1>
      <div className='library-shelf'>
        <p>Welcome to Pianus Studio Library!</p>
        <p>A place where our pianists share their passion! Join us and create your own pieces here! 🎶</p>
        <p>More pieces coming soon! 🎉</p>
        <PieceShelf P = {P1} />
        <PieceShelf P = {P2} />
        <PieceShelf P = {P3} />
        <PieceShelf P = {P4} />
        <PieceShelf P = {P5} />
        <PieceShelf P = {P6} />
        <PieceShelf P = {P7} />
        <PieceShelf P = {P8} />
      </div>
    </div>
  );
}