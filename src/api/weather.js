// src/api/weather.js

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.weatherapi.com/v1";

export async function getCurrentWeather(lat = 43.7022, lon = -72.2896) {
  const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return {
      temp: data.current.temp_c,
      icon: data.current.condition.icon,
      condition: data.current.condition.text,
    };
  } catch (err) {
    console.error("Weather fetch failed:", err);
    return null;
  }
}
