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
import SettingsPage from "./webpages/Settings.jsx";
import Display from "./webpages/Display.jsx";
import Learn from "./webpages/Learn.jsx";
import P1 from "./components/PianoPieces/P1.jsx";
import P2 from "./components/PianoPieces/P2.jsx";
import P3 from "./components/PianoPieces/P3.jsx";
import P4 from "./components/PianoPieces/P4.jsx";
import P5 from "./components/PianoPieces/P5.jsx";
import P6 from "./components/PianoPieces/P6.jsx";
import P7 from "./components/PianoPieces/P7.jsx";
import P8 from "./components/PianoPieces/P8.jsx";

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
      <Route path="/library/p1/display" element={<Display P = {P1}/>} />
      <Route path="/library/p1/learn"   element={<Learn P = {P1}/>} />
      <Route path="/library/p2/display" element={<Display P = {P2}/>} />
      <Route path="/library/p2/learn"   element={<Learn P = {P2}/>} />
      <Route path="/library/p3/display" element={<Display P = {P3}/>} />
      <Route path="/library/p3/learn"   element={<Learn P = {P3}/>} />
      <Route path="/library/p4/display" element={<Display P = {P4}/>} />
      <Route path="/library/p4/learn"   element={<Learn P = {P4}/>} />
      <Route path="/library/p5/display" element={<Display P = {P5}/>} />
      <Route path="/library/p5/learn"   element={<Learn P = {P5}/>} />
      <Route path="/library/p6/display" element={<Display P = {P6}/>} />
      <Route path="/library/p6/learn"   element={<Learn P = {P6}/>} />
      <Route path="/library/p7/display" element={<Display P = {P7}/>} />
      <Route path="/library/p7/learn"   element={<Learn P = {P7}/>} />
      <Route path="/library/p8/display" element={<Display P = {P8}/>} />
      <Route path="/library/p8/learn"   element={<Learn P = {P8}/>} />
    </Routes>
  );
}