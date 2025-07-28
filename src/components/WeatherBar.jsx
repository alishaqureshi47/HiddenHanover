import './WeatherBar.css';

function WeatherBar({ forecast }) {
    if (!forecast || forecast.length === 0 || !forecast[0].day) {
  return null; // or a loading message
}

  return (
    <div className="weather-forecast-container">
    <div className="today-card">
        <h2>Today</h2>
        <p>{forecast[0].day.avgtemp_f}°F</p>
        <p>{forecast[0].day.condition.text}</p>
        <img src={forecast[0].day.condition.icon} alt="weather icon" />
    </div>

    <div className="forecast-scroll">
        {forecast.slice(1).map((day, idx) => (
        <div className="forecast-card" key={idx}>
            <p>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <p>{day.day.maxtemp_f}° / {day.day.mintemp_f}°</p>
            <img src={day.day.condition.icon} alt="icon" />
            <p>{day.day.condition.text}</p>
        </div>
        ))}
    </div>
</div>

  );
}

export default WeatherBar;