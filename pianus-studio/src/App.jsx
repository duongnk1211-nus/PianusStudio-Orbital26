import { Routes, Route } from "react-router-dom";
import HomePage from "./webpages/Home.jsx";
import Piano    from "./components/PianoKeyBoard.jsx";
import AboutUsPage from "./webpages/AboutUs.jsx";
import ContactUsPage from "./webpages/ContactUs.jsx";
import LoginPage from "./webpages/Login.jsx";
import SignupPage from "./webpages/Signup.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/signup"            element={<SignupPage />} />
      <Route path="/about"              element={<AboutUsPage />} />
      <Route path="/contact"            element={<ContactUsPage />} />
      <Route path="/piano-simulator" element={<Piano />}    />
      <Route path="/login"             element={<LoginPage />} />
      <Route path="/"                element={<HomePage />} />
    </Routes>
  )
}