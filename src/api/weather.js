// src/api/weather.js

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.weatherapi.com/v1";

export async function getCurrentWeather(zipcode = '03755') {
  const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${zipcode}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return {
      temp: data.current.temp_f,
      icon: data.current.condition.icon,
      condition: data.current.condition.text,
      isDay: data.current.is_day,
    };
  } catch (err) {
    console.error("Weather fetch failed:", err);
    return null;
  }
}
