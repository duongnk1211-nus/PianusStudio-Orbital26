import '../styles/Library.css'
import { useNavigate } from 'react-router-dom'


export default function Library() {
  const navigate = useNavigate()
  const goBack = () => { navigate(-1); }
  const goToP1 = () => { navigate('/p1'); }
  
  
  return (
    <div className='library-wrapper'>
    <button onClick={goBack}>Go Back</button>
    <img src="/PianusStudio.png" />
    <h1>Music  Library</h1>
    <div className='library-shelf'>
    <p>Welcome to Pianus Studio Library!</p>
    <p>A place where our pianists share their passion! Join us and create your own pieces here! 🎶</p>
    <p>More pieces coming soon! 🎉</p>
    <div className='piece-shelf'>
    <h2>Twinkle Twinkle Little Star</h2>
    <p style={{marginBottom: '30px'}}><span style={{fontWeight:'1000'}}>Description: </span> Playing Twinkle, Twinkle, Little Star on the piano is the ultimate beginner's rite of passage. Its memorable A-B-C-C-A-B song structure uses only six white keys in the C major scale—Middle C through A. The melody is highly repetitive, making it incredibly easy to memorize and play by ear!</p>
    <p style={{marginBottom: '0px'}}><span style={{fontWeight:'1000'}}>Author:</span> Dao Quang Linh</p>
    <button onClick={goToP1}>View Here</button>
    </div>
    </div>
    </div>
  )
}