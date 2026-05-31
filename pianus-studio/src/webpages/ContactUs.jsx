import '../styles/ContactUs.css';
import { Link } from 'react-router-dom';

export default function ContactUs() {
    return (
        <div className="wrapper-for-ContactUs">
            <div className="button-for-ContactUs">
                <Link to="/" className="return-for-ContactUs">
                    Return
                </Link>
            </div>
            <div className="header-for-ContactUs">
                <h1>Contact Us</h1>
            </div>
            <div className="content-for-ContactUs">
                <div className="feature-card-for-ContactUs">
                    <main className="main-for-ContactUs">
                            <p>If you have any questions, suggestions, or feedback, please feel free to reach out to us. We value your input and are always eager to hear from our users.</p>
                            <p style={{ marginTop: '20px' }}>
                                Our Github:   <a href="https://github.com/duongnk1211-nus/PianusStudio-Orbital26.git" target="_blank" rel="noopener noreferrer">PianusStudio on GitHub</a>
                            </p>
                    </main>
                </div>
            </div>
        </div>
    )
}