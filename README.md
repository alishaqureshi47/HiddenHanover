# 🌿 Hidden Hanover

Hidden Hanover is a React-based interactive map app that lets users explore cozy, lesser-known spots around Hanover and the Dartmouth campus. Each location is marked on a beautiful custom Mapbox map and paired with a curated Spotify playlist. The app also features a live weather bar that displays the current weather and a short-term forecast using real-time weather data.

Whether you're a student looking for a new place to unwind, a visitor exploring the town, or just curious about Hanover’s hidden charm — this app is your whimsical guide.

---

## 🔗 Live Demo

Coming soon: [https://your-deployment-link.com](https://your-deployment-link.com)

---

## 🌤 Features

- 📍 **Interactive Map:** Centered on Hanover, with custom markers for curated spots.
- 🎵 **Spotify Integration:** Each location includes a unique playlist to match the vibe.
- 🌦️ **Weather Bar:** Current weather and upcoming forecasts, displayed in a stylish UI.
- 📱 **Responsive Design:** Works across screen sizes, scrolls elegantly, and feels smooth.

---

## Tech Stack

### Frontend

- React.js
- Mapbox GL JS (interactive maps and markers)
- CSS Modules (custom styling)
- HTML5

### APIs Used

- **Mapbox API:** For rendering the interactive map and placing custom markers.
- **WeatherAPI.com Forecast API:** For real-time and forecasted weather data.
- *(Spotify API planned but not fully integrated yet — currently using static playlist links.)*

---

## Screenshots

to be uploaded

---

## Setup Instructions

To run this project locally:

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/hidden-hanover.git
cd hidden-hanover
````

2. **Install dependencies:**

```bash
npm install
```

3. **Set environment variables:**

Create a `.env` file in the root directory and add:

```
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
VITE_WEATHER_API_KEY=your_weatherapi_key
```

4. **Start the development server:**

```bash
npm run dev
```

5. Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✨ Learning Journey

### What inspired this project?

This app started as a way to document and share Dartmouth’s best-kept secrets — the hidden benches, scenic turns, and quiet thinking spots that often go unnoticed. I wanted to create something that felt **personal**, **explorable**, and **immersive**.

### Potential Impact

This could evolve into a crowd-sourced community map where students and locals can add their own favorite spots. It could foster a deeper connection with the local landscape and build a digital memory of the town. Future ideas include a mood tracker, journaling prompts for locations, or community playlists.

### New Technologies Learned

* **Mapbox GL JS** — For dynamic, fully interactive maps
* **WeatherAPI Forecast API** — For fetching and displaying structured weather data
* **React State Management & Effects** — For dynamic UI updates and asynchronous data

### Why These Tools?

* **Mapbox** gave me complete control over styling and interactivity — more flexible than Google Maps.
* **WeatherAPI** provided simpler, cleaner forecast data compared to OpenWeather.
* **React** allowed me to modularize the map, weather, and layout components cleanly.

### Challenges & Lessons

* Getting Mapbox to display markers and popups the way I wanted took some trial and error.
* Styling the weather forecast to look compact and scrollable (but not overflow the page) took lots of CSS tweaking.
* Initially used OpenWeatherMap but switched due to inconsistent results — learned the value of choosing the right API early.
* Making sure the weather bar didn't break layout taught me a lot about Flexbox and overflow handling.

---

## Things left to do

* Add location submission functionality so users can suggest their own hidden gems.
* Build a backend using Firebase to store locations dynamically.
* Enable login and user-specific playlists or journal notes.

MADE BY ALISHA QURESHI | DARTMOUTH '28