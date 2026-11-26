import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import WeatherDetails from "./components/WeatherDetails";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function searchWeather() {
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // Step 1: Get city coordinates
      const locationResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
      );

      const locationData = await locationResponse.json();

      if (!locationData.results) {
        throw new Error("City not found");
      }

      const location = locationData.results[0];

      // Step 2: Get weather using coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`,
      );

      const weatherData = await weatherResponse.json();
      const current = weatherData.current;

      // Step 3: Store weather information
      setWeather({
        city: location.name,
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        condition: getCondition(current.weather_code),
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function getCondition(code) {
    if (code === 0) return "Clear Sky";
    if ([1, 2, 3].includes(code)) return "Partly Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55, 61, 63, 65].includes(code)) return "Rainy";
    if ([71, 73, 75, 77].includes(code)) return "Snowy";
    if ([80, 81, 82].includes(code)) return "Rain Showers";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";

    return "Unknown";
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Weather Dashboard</h1>

        <SearchBar
          city={city}
          setCity={setCity}
          searchWeather={searchWeather}
        />

        {loading && <p>Loading weather...</p>}

        {error && <p className="error">{error}</p>}

        {weather && (
          <>
            <WeatherCard weather={weather} />
            <WeatherDetails weather={weather} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
