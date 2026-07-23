import "../styles/LibraryPage.css";
import { useNavigate } from "react-router-dom";
import { PieceList } from "../components/PieceList.jsx";

function PieceShelf( { P } ) {
  const navigate = useNavigate();
  const goToDisplay = () => { navigate(`/library/${P.navStr}/display`); }
  const goToLearn = () => { navigate(`/library/${P.navStr}/learn`); }

  return (
    <div className="piece-shelf">
      <h2>{P.title}</h2>
      <p style={{marginBottom: "30px"}}><span style={{fontWeight: "1000"}}>Description: </span>{P.description}</p>
      <button onClick={goToDisplay} style={{marginBottom: '0px'}}>Listen & Feel</button>
      <button onClick={goToLearn}>Play it yourself</button>
    </div>
  );
}

export default function LibraryPage() {
  const navigate = useNavigate();
  const goBack = () => { navigate(-1); }
  
  return (
    <div className="library-page" id="library-page">
      <button className="return-btn" onClick={goBack}>Go Back</button>
      <img src="/PianusStudio.png" />
      <h1>Music  Library</h1>
      <div className="library-shelf">
        <p>Welcome to Pianus Studio Library!</p>
        <p>A place where our pianists share their passion! Join us and create your own pieces here! 🎶</p>
        <p>More pieces coming soon! 🎉</p>

        {PieceList.map((P) => (
          <PieceShelf key={P.navStr} P={P} />
        ))}
      </div>
    </div>
  );
}