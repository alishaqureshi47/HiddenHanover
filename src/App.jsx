import Map from './components/Map.jsx';
import WeatherBar from './components/WeatherBar.jsx';
import './App.css';
import { useEffect, useState } from 'react';


function App() {
    const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    async function fetchForecast() {
      try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=Hanover&days=6`);
        const data = await res.json();
        setForecastData(data.forecast.forecastday);
      } catch (err) {
        console.error('Error fetching forecast:', err);
      }
    }

    fetchForecast();
  }, []);

  return (
    <div className="app-container">
      <header className="header-bar">
        <div className="title-container">
          <h1>🌿 Hidden Hanover 🌿</h1>
          <div className="weather-forecast">
            <WeatherBar forecast={forecastData} />
          </div>
        </div>
      </header>


      <main className="main-content">

        <div className="map-container">
          <Map />
        </div>

      </main>
    </div>
  );
}


export default App;
