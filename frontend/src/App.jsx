import { Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx"
import HomePage from "./webpages/Home.jsx";
import PianoSimulator from "./webpages/PianoSimulator.jsx";
import P1 from "./webpages/Pieces.jsx";
import Library from "./webpages/Library.jsx";
import AboutUsPage from "./webpages/AboutUs.jsx";
import ContactUsPage from "./webpages/ContactUs.jsx";
import LoginPage from "./webpages/Login.jsx";
import SignupPage from "./webpages/Signup.jsx";
import UpdatePassword from "./webpages/UpdatePassword.jsx";

export default function App() {
  return (
    <AuthProvider>
    <Routes>
    <Route path="/library"        element={<Library />} />
    <Route path="/p1"              element={<P1 />} />
    <Route path="/update-password" element={<UpdatePassword />} />
    <Route path="/signup"          element={<SignupPage />} />
    <Route path="/about"           element={<AboutUsPage />} />
    <Route path="/contact"         element={<ContactUsPage />} />
    <Route path="/piano-simulator" element={<PianoSimulator />}    />
    <Route path="/login"           element={<LoginPage />} />
    <Route path="/"                element={<HomePage />} />
    </Routes>
    </AuthProvider>
  );
}