import '../styles/Home.css';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className= "body">
            <header>
                <h1>Welcome to PianusStudio</h1>
                <img src="../src/assets/PianusStudio.png" alt="PianusStudio Logo" className="logo" />
                <p>Your gateway to piano music, lessons, and more...</p>
            </header>

            <nav>
                <Link to="/about">About Us</Link>
                <Link to="/piano-simulator">Piano Simulator</Link>
                <Link to="/lessons">Lessons</Link>
                <Link to="/sheet-music">Sheet Music</Link>
                <Link to="/practice-tools">Practice Tools</Link>
                <Link to="/community">Community</Link>
                <Link to="/contact">Contact Us</Link>
            </nav>

            <main>
                <h2>Explore Our Features</h2>
                <div class="features">
                    <div class="feature-card">
                        <h3>Piano Simulator</h3>
                        <p>Experience playing the piano in a virtual environment.</p>
                        <Link to="/piano-simulator">Try Now</Link>
                    </div>
                    <div class="feature-card">
                        <h3>Online Lessons</h3>
                        <p>Interactive tutorials to improve your piano skills.</p>
                        <Link to="/lessons">Go to Lessons</Link>
                    </div>
                    <div class="feature-card">
                        <h3>Sheet Music Library</h3>
                        <p>Access classical and modern sheet music.</p>
                        <Link to="/sheet-music">Browse Library</Link>
                    </div>
                    <div class="feature-card">
                        <h3>Practice Tools</h3>
                        <p>Metronome, chord finder, and more.</p>
                        <Link to="/practice-tools">Try Tools</Link>
                    </div>
                    <div class="feature-card">
                        <h3>Community Forum</h3>
                        <p>Connect with other piano enthusiasts.</p>
                        <Link to="/community">Join Forum</Link>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>&copy; 2026 PianusStudio | By Nguyen Khanh Duong & Dao Quang Linh</p>
            </footer>
        </div>
    )
}