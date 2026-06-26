import { useNavigate } from "react-router-dom";
import { Notes } from "./Notes.jsx";
import "../styles/Piano.css";
import "../styles/Synthesia.css";

export function PianoLayout({ 
  header, 
  backgroundImageURL, 
  displayBars, 
  synthRef, 
  barsRef, 
  sideEffect, 
  isPlaying,
  flipPlaying,
  isStarted,
  start
}) {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="Piano" style={{ backgroundImage: `url(${backgroundImageURL})` }}>
      <button 
        className="return-button" 
        onClick={goBack} 
        style={{width:'65px', marginLeft:'10px', marginRight:'50px', paddingBottom:'3px'}}
      >
        Return
      </button>

      <div className="piano-wrapper">
        <div>
          <img src="/PianusStudio.png" style={{background: '#517edfbc'}} />
          <h1>{header}</h1>
        </div>
        { flipPlaying &&
          <button 
            className={isPlaying ? "pause-button" : "play-button"} 
            onClick={flipPlaying}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        }
        { start && 
          <button 
            className={isStarted ? "restart-button" : "start-button"} 
            onClick={start} 
            style={{width:'70px', paddingBottom:'3px'}}
          >
            {isStarted ? "Restart" : "Start"}
          </button>
        }

        <div className="synthesia-container">
          {displayBars.map(b => (
            <div
              key={b.id}
              className={`synthesia-bar ${b.type}`}
              style={{
                left: `${b.left}px`,
                width: `${b.width - 2}px`,
                height: `${b.height}px`,
                top: `${b.top}px`,
              }}
            />
          ))}
        </div>
        <div className="key-rows">
          {Notes.map(n => n.toHTML(synthRef, barsRef, sideEffect))}
        </div>
      </div>
    </div>
  );
}