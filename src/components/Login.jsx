import React from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../api/firebase"; // ✅ make sure firebase.js exports auth
import "./Login.css";

export default function Login() {
  // 📥 Google Sign-in function
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.href = "/map";  // ✅ send user to map after login
    } catch (err) {
      console.error("❌ Google login failed:", err);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {/* 🌿 Logo/Header */}
      <div className="login-card">
        <h1 className="login-title">🌿 Hidden Hanover 🌿</h1>
        <p className="login-subtitle">Sign in to explore secret spots around Hanover.</p>

        {/* 🔘 Google Login Button */}
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="google-icon"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
