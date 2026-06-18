import { Link } from "react-router-dom";
import "../styles/AboutUs.css";

export default function AboutUsPage() {
  return (
    <div className="AboutUs">
      <header className="header-for-AboutUs">
        <div>
          <Link to="/" className="return-for-AboutUs">
            Return
          </Link>
        </div>
      </header>
      <main className="main-for-AboutUs">
        <div className="feature-card-for-AboutUs">
          <h1>About Us</h1>
          <p>Welcome to PianusStudio! We are passionate about bringing the joy of piano music to everyone, regardless of their skill level. Our mission is to create an engaging and interactive platform where users can learn, practice, and connect with other piano enthusiasts.</p>
            <p
              style={{
                marginTop: '40px',
                marginBottom: '0px',
                padding: '1px 10px 0px 1px'
              }}
            >
              By Nguyen Khanh Duong & Dao Quang Linh
            </p>
          <Link to="/contact">Contact us</Link>
        </div>
      </main>
    </div>
  );
}