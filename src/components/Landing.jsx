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
      className="landing-page"
    >

      {/* 🌿 Landing content */}
      <div className="landing-content">
        <h1 className="landing-title">Hidden Hanover</h1>
        <p className="landing-subtitle">
          Discover the hidden gems of Hanover
        </p>

        <button
          className="explore-btn"
          onClick={() => navigate("/login")}
        >
          Login with Google →
        </button>
      </div>
    </motion.div>
  );
}

export default Landing;
