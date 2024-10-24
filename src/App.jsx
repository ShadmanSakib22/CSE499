// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";

import NavbarMain from "./components/navbar";
import HeroSection from "./components/herosection";
import About from "./components/about";
import Services from "./components/services";
import JoinTeam from "./components/joinTeam";
import Footer from "./components/footer";
import Login from "./components/login";
import Logout from "./components/logout";
import Register from "./components/register";
import Profile from "./components/profile";
import Support from "./components/pubChannel";
import Feedback from "./components/feedback";
import ProfileRes from "./components/ProfileRes";
import Ticket from "./components/ticket";

function App() {
  return (
    <Router>
      <div>
        <AuthProvider>
          <NavbarMain />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/join-team" element={<JoinTeam />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/support" element={<Support />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/profile-res" element={<ProfileRes />} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
          <Footer />
        </AuthProvider>
      </div>
    </Router>
  );
}

const HomePage = () => (
  <>
    <HeroSection />
    <About />
    <Services />
    <JoinTeam />
  </>
);

export default App;
