// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Landing from './components/Landing.jsx';
import Map from './components/Map.jsx';
import SpotPage from './components/SpotPage.jsx';
import AddSpot from './components/AddSpot.jsx';
import WeatherBar from './components/WeatherBar.jsx';
import { AnimatePresence, motion } from "framer-motion";
import './App.css';

function App() {
  const [forecastData, setForecastData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const location = useLocation();

  // 🌦️ Fetch Weather for the WeatherBar
  useEffect(() => {
    async function fetchForecast() {
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${
            import.meta.env.VITE_WEATHER_API_KEY
          }&q=Hanover&days=6`
        );
        const data = await res.json();
        setForecastData(data.forecast.forecastday);
      } catch (err) {
        console.error('Error fetching forecast:', err);
      }
    }
    fetchForecast();
  }, []);

  return (
    <div 
      className="app-container"
      style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}
    >
      <header className="header-bar small">
        <h2>🌿 Hidden Hanover 🌿</h2>
      </header>
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          
          {/* 🌿 Landing Page */}
          <Route 
            path="/" 
            element={
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}   // 👈 slides up like a curtain
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
                <Landing />
              </motion.div>
            } 
          />

          {/* 🗺 Map Page */}
          <Route
            path="/map"
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{

                  top: 0,
                  left: 0,
                  width: "100%",
                  minHeight: "100vh",
                  zIndex: 1   // ✅ stays below Landing
                }}
              >
                <div className="weather-bar-container">
                  <WeatherBar forecast={forecastData} />
                </div>

                <div className="main-content">
                  <div className="map-wrapper">
                    <Map />
                  </div>

                  <button
                    className="add-spot-btn"
                    onClick={() => setShowAdd(true)}
                  >
                    ➕ Add Spot
                  </button>     
                </div>

                {showAdd && <AddSpot onClose={() => setShowAdd(false)} />}
              </motion.div>
            }
          />

          {/* 📍 Individual Spot Page */}
          <Route path="/spot/:spotId" element={<SpotPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
