// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";

import NavbarMain from "./components/navbar";
import HeroSection from "./components/herosection";
import About from "./components/about";
import Services from "./components/services";
import Advertise from "./components/advertise";
import SubscribeCTA from "./components/subscribecta";
import JoinTeam from "./components/joinTeam";
import Contact from "./components/contact";
import Footer from "./components/footer";
import Login from "./components/login";
import Logout from "./components/logout";
import Register from "./components/register";
import Subscribe from "./components/subscribe";
import Profile from "./components/profile";
import Support from "./components/pubChannel";
import PremiumSup from "./components/priChannel";
import Feedback from "./components/feedback";

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
            <Route path="/contact" element={<Contact />} />
            <Route path="/join-team" element={<JoinTeam />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/support" element={<Support />} />
            <Route path="/premium-support" element={<PremiumSup />} />
            <Route path="/feedback" element={<Feedback />} />
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
    <Advertise />
    <Services />
    <SubscribeCTA />
    <JoinTeam />
  </>
);

export default App;
