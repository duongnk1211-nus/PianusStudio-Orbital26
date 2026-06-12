import '../styles/Library.css'
import { useNavigate } from 'react-router-dom'


export default function Library() {
    const navigate = useNavigate()
    const goToP1 = () => navigate('/lessons')


    return (
        <div className= 'library-wrapper'>
            <h1>🎹 Welcome to our music library!</h1>
            <p>These are famous music pieces played and recorded by our pianist on the website! Join us and create your own pieces here! More pieces coming soon... </p>
            <div>
                <h2>Twinkle Twinkle Little Star</h2>
                <p>A beginner-friendly song that every pianist knows of!</p>
                <p>Author: Dao Quang Linh</p>
                <button onClick={goToP1}>View Here</button>
            </div>
        </div>
    )
}