import '../styles/Exp.css'

export default function PianoKeyboard() {
  return (
    <div className="piano">
      {/* White keys */}
      <div className="white-key"></div>
      <div className="white-key"></div>
      <div className="white-key"></div>
      <div className="white-key"></div>
      <div className="white-key"></div>
      <div className="white-key"></div>
      <div className="white-key"></div>

      {/* Black keys */}
      <div className="black-key" style={{ left: "40px" }}></div>
      <div className="black-key" style={{ left: "100px" }}></div>
      <div className="black-key" style={{ left: "220px" }}></div>
      <div className="black-key" style={{ left: "280px" }}></div>
      <div className="black-key" style={{ left: "340px" }}></div>
    </div>
  );
}
