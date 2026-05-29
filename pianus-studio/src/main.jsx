import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.jsx'
import Piano from './components/PianoKeyBoard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="app-container">
      <Piano />
    </div>
  </StrictMode>
)
