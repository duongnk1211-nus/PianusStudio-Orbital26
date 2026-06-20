import { Routes, Route } from "react-router-dom";
import HomePage from "./webpages/Home.jsx";
import PianoSimulator from "./webpages/PianoSimulator.jsx";
import P1 from "./webpages/Pieces.jsx";
import Library from "./webpages/Library.jsx";
import AboutUsPage from "./webpages/AboutUs.jsx";
import ContactUsPage from "./webpages/ContactUs.jsx";
import LoginPage from "./webpages/Login.jsx";
import SignupPage from "./webpages/Signup.jsx";
import UpdatePassword from "./webpages/UpdatePassword.jsx";
import ProfilePage from "./webpages/Profile.jsx";
import SettingsPage from "./webpages/Settings.jsx";
import P1Display from "./webpages/P1/Display.jsx";
import P1Learn from "./webpages/P1/Learn.jsx";

export default function App() {
  return (
    <Routes>
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
      <Route path="/library/p1/display" element={<P1Display />} />
      <Route path="/library/p1/learn"   element={<P1Learn />} />
    </Routes>
  );
}