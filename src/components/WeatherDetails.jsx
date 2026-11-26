function WeatherDetails({ weather }) {
  return (
    <div className="weather-details">
      <div>
        <h3>Humidity</h3>
        <p>{weather.humidity}%</p>
      </div>

      <div>
        <h3>Wind Speed</h3>
        <p>{weather.windSpeed} km/h</p>
      </div>
    </div>
  );
}

export default WeatherDetails;
