import "../styles/Scoring.css";
import { useNavigate } from "react-router-dom";

export default function Scoring() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="scoring-body">
      <div className="scoring-header">
        <button onClick={goBack}>Return</button>
        <h1 className="energetic-title">Moonlight Sonata</h1>
      </div>
    </div>
  )
}