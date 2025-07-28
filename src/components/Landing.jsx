// src/components/Landing.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#f9f9f9",
        zIndex: 10
      }}
    >
      <div className="landing-container">
        <div className="leaf leaf-left">🍃</div>
        <div className="leaf leaf-right">🍃</div>

        <div className="landing-content">
          <h1 className="landing-title">🌿 Hidden Hanover 🌿</h1>
          <p className="landing-subtitle">Discover the secret spots around Hanover</p>

          <button
            className="explore-btn"
            onClick={() => navigate("/login")}   // ✅ takes user to Login page
          >
            Login with Google →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Landing;
