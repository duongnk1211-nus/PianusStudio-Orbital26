import { useNavigate } from "react-router-dom";
import { Notes } from "./Notes.jsx";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { Hand } from "./Hand.jsx";

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
  start,
  isAttackingRight,
  setIsAttackingRight,
  isAttackingLeft,
  setIsAttackingLeft,
  status,
  flipRecording,
  saveRecording,
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
        <img src="/PianusStudio.png" style={{scale: "0.5", background: '#517edfbc'}} />
        <h2>{header}</h2>
        { flipPlaying && !flipRecording &&
          <button 
            className={isPlaying ? "pause-button" : "play-button"} 
            onClick={flipPlaying}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        }
        { flipRecording && !flipPlaying &&
          <button 
            className={isRecording ? "stop-button" : "record-button"} 
            onClick={flipRecording}
          >
            {isRecording ? "Stop" : "Record"}
          </button>
        }
        { flipPlaying && flipRecording && 
          <button 
            className={status === "recording" ? "stop-button" : status === "stopped" ? "record-button" : "disabled-record-button" } 
            onClick={status === "playing" ? () => {} : flipRecording}
          >
            {status === "recording" ? "Stop" : "Record"}
          </button>
        }
        { flipPlaying && flipRecording && 
          <button 
            className={status === "playing" ? "pause-button" : status === "stopped" ? "play-button" : "disabled-play-button" } 
            onClick={status === "recording" ? () => {} : flipPlaying}
          >
            {status === "playing" ? "Pause" : "Play"}
          </button>
        }
        {
          saveRecording &&
          <button
            className={status === "recording" ? "disabled-save-button" : "save-button"}
            onClick={saveRecording}
          >
            Save
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
              className={`synthesia-bar ${b.type} ${b.addOn}`}
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
        { setIsAttackingLeft && setIsAttackingRight && (
          <div className="hands-container">
            <Hand isRightHand={false} isAttacking={isAttackingLeft} />
            <Hand isRightHand={true} isAttacking={isAttackingRight} />
          </div>
        )}
      </div>
    </div>
  );
}