// src/components/Landing.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";   // ✅ import motion here
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 1 }}   // 👈 slide up when navigating away
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{
        position: "absolute",    // ✅ keeps it layered
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#f9f9f9",   // ✅ covers Map while sliding up
        zIndex: 10               // ✅ stays on top of Map during transition
      }}
    >
      <div className="landing-container">
        {/* 🍃 Decorative leaves */}
        <div className="leaf leaf-left">🍃</div>
        <div className="leaf leaf-right">🍃</div>

        {/* 🌿 Center content */}
        <div className="landing-content">
          <h1 className="landing-title">🌿 Hidden Hanover 🌿</h1>
          <p className="landing-subtitle">Discover the secret spots around Hanover</p>

          <button
            className="explore-btn"
            onClick={() => navigate("/map")} // takes user to the map view
          >
            Explore →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Landing;
