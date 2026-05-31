import { Routes, Route } from "react-router-dom";
import HomePage from "./webpages/Home.jsx";
import Piano    from "./components/PianoKeyBoard.jsx";
import AboutUsPage from "./webpages/AboutUs.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/about"              element={<AboutUsPage />} />
      <Route path="/piano-simulator" element={<Piano />}    />
      <Route path="/"                element={<HomePage />} />
    </Routes>
  )
}