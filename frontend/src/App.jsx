import { Routes, Route } from "react-router-dom";
import HomePage from "./webpages/Home.jsx";
import PianoSimulator from "./webpages/PianoSimulator.jsx";
import Library from "./webpages/Library.jsx";
import AboutUsPage from "./webpages/AboutUs.jsx";
import ContactUsPage from "./webpages/ContactUs.jsx";
import LoginPage from "./webpages/Login.jsx";
import SignupPage from "./webpages/Signup.jsx";
import UpdatePassword from "./webpages/UpdatePassword.jsx";
import ProfilePage from "./webpages/Profile.jsx";
import ViewProfile from "./webpages/ViewProfile.jsx";
import SettingsPage from "./webpages/Settings.jsx";
import Display from "./webpages/Display.jsx";
import Learn from "./webpages/Learn.jsx";
import Scoring from "./webpages/Scoring.jsx";
import { ScoringDemo } from "./webpages/Scoring.jsx";
import GetReady from "./webpages/GetReady.jsx";
import LessonsPage from "./webpages/Lessons.jsx";
import PianoRecorder from "./webpages/PianoRecorder.jsx";
import RecordingDisplayer from "./webpages/RecordingDisplayer.jsx";
import PitchRecognition from "./webpages/PitchRecognition.jsx";
import { PieceList } from "./components/PieceList.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/user-profile/:username" element={<ViewProfile />} />
      <Route path="/lessons"         element={<LessonsPage />} />
      <Route path="/profile"         element={<ProfilePage />} />
      <Route path="/settings"        element={<SettingsPage />} />
      <Route path="/library"         element={<Library />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/signup"          element={<SignupPage />} />
      <Route path="/about"           element={<AboutUsPage />} />
      <Route path="/contact"         element={<ContactUsPage />} />
      <Route path="/piano-simulator" element={<PianoSimulator />}    />
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/"                element={<HomePage />} />
      <Route path="/piano-recorder"  element={<PianoRecorder />} />
      <Route path="/recording"       element={<RecordingDisplayer />} />
      <Route path="/pitch-recognition" element={<PitchRecognition />}/>

      {PieceList.map((P) => (
        <>
          <Route key={`${P.navStr}-getReady`} path={`/lessons/${P.navStr}/get-ready`} element={<GetReady P={P} />} />
          <Route key={`${P.navStr}-scoring`} path={`/lessons/${P.navStr}/play`} element={<Scoring P={P} />} />
          <Route key={`${P.navStr}-scoringDemo`} path={`/lessons/${P.navStr}/demo`} element={<ScoringDemo P={P} />} />
          <Route key={`${P.navStr}-display`} path={`/library/${P.navStr}/display`} element={<Display P={P} />} />
          <Route key={`${P.navStr}-learn`}   path={`/library/${P.navStr}/learn`}   element={<Learn P={P} />} />
        </>
      ))}
    </Routes>
  );
}