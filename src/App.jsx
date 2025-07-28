// src/App.jsx
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Landing from './components/Landing.jsx';
import Map from './components/Map.jsx';
import SpotPage from './components/SpotPage.jsx';
import AddSpot from './components/AddSpot.jsx';
import WeatherBar from './components/WeatherBar.jsx';
import { AnimatePresence, motion, time } from "framer-motion";
import { getCurrentWeather } from "./api/weather"; 
import './App.css';
import Login from "./components/Login.jsx";
import Header from "./components/Header";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./api/firebase";




function App() {
  const [forecastData, setForecastData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const location = useLocation();
  const [weather, setWeather] = useState("none");
  const [timeOfDay, setTimeOfDay] = useState("day");
  const [user] = useAuthState(auth);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.pathname === "/") {
      navigate("/map");
    }
  }, [user, location, navigate]);

  


  useEffect(() => {
    async function fetchWeather() {
      const data = await getCurrentWeather();
      if (data) {
        console.log("🌤 Hanover Weather Data:", data);

        // ✅ Automatically set day or night
        setTimeOfDay(data.isDay === 1 ? "day" : "night");

        // ✅ Automatically set rain/snow effects
        const conditionLower = data.condition.toLowerCase();
        if (conditionLower.includes("rain")) {
          setWeather("rain");
        } else if (conditionLower.includes("snow")) {
          setWeather("snow");
        } else {
          setWeather("none");
        }
      }
    }
    fetchWeather();
  }, []);


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
      {location.pathname !== "/" && <Header user={user} />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/callback" element={<SpotifyCallback />} />

          <Route path="/login" element={<Login />} />
          
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

                <div className="effect-toggle-bar">
                  <button 
                    className={weather === "rain" ? "active" : ""} 
                    onClick={() => setWeather("rain")}
                  >
                    🌧 Rain
                  </button>

                  <button 
                    className={weather === "snow" ? "active" : ""} 
                    onClick={() => setWeather("snow")}
                  >
                    ❄ Snow
                  </button>

                  <button 
                    className={weather === "none" ? "active" : ""} 
                    onClick={() => setWeather("none")}
                  >
                    🚫 Off
                  </button>
                </div>
                
                <div className="time-toggle-bar">
                  <button onClick={() => setTimeOfDay("day")}>🌞 Day</button>
                  <button onClick={() => setTimeOfDay("dawn")}>🌅 Dawn</button>
                  <button onClick={() => setTimeOfDay("dusk")}>🌆 Dusk</button>
                  <button onClick={() => setTimeOfDay("night")}>🌙 Night</button>
                </div>

                <div className="main-content">
                  <div className="map-wrapper">
                    <Map weather={weather} timeOfDay={timeOfDay}/>
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
