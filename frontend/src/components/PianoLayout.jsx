import { useNavigate } from "react-router-dom";
import { Notes } from "./Notes.jsx";
import "../styles/Piano.css";
import "../styles/Synthesia.css";
import { Hand } from "./Hand.jsx";

function PianoControl({
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
  showSaveDialog,
  setShowSaveDialog,
}
) {
  return (
    <div className="piano-control">
      { flipPlaying && !flipRecording &&
        <button 
          className={isPlaying ? `pause-btn` : `play-btn`} 
          onClick={flipPlaying}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
      }
      { flipPlaying && flipRecording && 
        <button 
          className={status === "recording" ? `stop-btn` : `record-btn ${status !== "stopped" ? "disabled" : ""}`} 
          onClick={status === "playing" ? () => {} : flipRecording}
        >
          {status === "recording" ? "Stop" : "Record"}
        </button>
      }
      { flipPlaying && flipRecording && 
        <button 
          className={status === "playing" ? `pause-btn` : `play-btn ${status === "recording" ? "disabled" : "" }`} 
          onClick={status === "recording" ? () => {} : flipPlaying}
        >
          {status === "playing" ? "Pause" : "Play"}
        </button>
      }
      { setShowSaveDialog &&
        <button
          className={`save-btn ${status === "recording" ? "disabled" : ""}`}
          onClick={status === "recording" ? () => {} : () => {setShowSaveDialog(true);}}
        >
          Save
        </button>
      }

      { start && 
        <button 
          className={isStarted ? "restart-btn" : "start-btn"} 
          onClick={start} 
          style={{width:'70px', paddingBottom:'3px'}}
        >
          {isStarted ? "Restart" : "Start"}
        </button>
      }
    </div>
  );
}

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
  showSaveDialog,
  setShowSaveDialog,
  savePiece,
  isSaving,
  setIsSaving,
  isFetched,
  setIsFetched,
  saveError,
}) {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="Piano" style={{ backgroundImage: `url(${backgroundImageURL})` }}>
      <button 
        className="return-btn" 
        onClick={goBack} 
        style={{width:'65px', marginLeft:'10px', marginRight:'50px', paddingBottom:'3px'}}
      >
        Return
      </button>

      <div className="piano-wrapper">
        <img src="/PianusStudio.png" style={{scale: "0.5", background: '#517edfbc'}} />
        <h2>{header}</h2>
        <PianoControl 
          isPlaying={isPlaying}
          flipPlaying={flipPlaying}
          isStarted={isStarted}
          start={start}
          isAttackingRight={isAttackingRight}
          setIsAttackingRight={setIsAttackingRight}
          isAttackingLeft={isAttackingLeft}
          setIsAttackingLeft={setIsAttackingLeft}
          status={status}
          flipRecording={flipRecording}
          showSaveDialog={showSaveDialog}
          setShowSaveDialog={setShowSaveDialog}
        />

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

        {showSaveDialog && (
          <div className="modal-overlay">
            <div className="save-modal">
              <h2>Save Recording</h2>
              <p>Choose a save slot.</p>
              <div className="save-slots">
                <button onClick={savePiece(1)}>
                  Piece 1
                </button>
                <button onClick={savePiece(2)}>
                  Piece 2
                </button>
                <button onClick={savePiece(3)}>
                  Piece 3
                </button>
              </div>
              <button
                className="cancel-btn"
                onClick={() => setShowSaveDialog(false)}
              >
                Don't Save
              </button>

              {isSaving && (
                <div className="saving-message">
                  Saving...
                </div>
              )}
            </div>
          </div>
        )}

        {isFetched && (
          <div className="modal-overlay">
            <div className="fetched-modal">
              <p>{saveError}</p>
              {isSaving && (
                <div className="saving-message">
                  Saving...
                </div>
              )}
              
              <button
                className="ok-btn"
                onClick={() => setIsFetched(false)}
              >
                OK
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}