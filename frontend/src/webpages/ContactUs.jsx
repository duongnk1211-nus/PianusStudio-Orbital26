import "../styles/ContactUs.css";
import { Link } from "react-router-dom";

export default function ContactUs() {
  return (
    <div className="contact-us-page" id="contact-us-page">
      <div className="contact-us-btn">
        <Link to="/" className="contact-us-return-link">
          Return
        </Link>
      </div>
      <div className="contact-us-header">
        <h1>Contact Us</h1>
      </div>
      <div className="contact-us-content">
        <div className="contact-us-feature-card">
          <main className="contact-us-main">
            <p>If you have any questions, suggestions, or feedback, please feel free to reach out to us. We value your input and are always eager to hear from our users.</p>
              <p style={{ marginTop: '20px' }}>
                Our Github:   <a href="https://github.com/duongnk1211-nus/PianusStudio-Orbital26.git" target="_blank" rel="noopener noreferrer">PianusStudio on GitHub</a>
              </p>
          </main>
        </div>
      </div>
    </div>
  );
}