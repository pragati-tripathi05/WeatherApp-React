import hotBg from "./images/hot.jpg";
import coldBg from "./images/cold.jpg";
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./weatherService";

function App() {
  const [city, setCity] = useState("Riyadh");
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);

  // Getting api data from weatherService.js
  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      //console.log(data);
      setWeather(data);

      // dynamic background
      const threshold = units === "metric" ? 20 : 55;
      if (data.temp <= threshold) setBg(coldBg);
      else setBg(hotBg);
    };
    fetchWeatherData();
  }, [units, city]);

  // When user wants to change the unit of temperature
  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    //console.log(button, button.innerText);
    const currentUnit = button.innerText.slice(1);
    //console.log(currentUnit);
    const isCelsius = currentUnit === "C";
    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? "metric" : "imperial");
  };

  // When user types an city name and presses enter
  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="App" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {weather && (
          <div className="container">
            <div className="section section__inputs">
              <input
                type="text"
                name="city"
                placeholder="Type city & press enter..."
                onKeyDown={enterKeyPressed}
              />
              <div>
                <small>convert to</small>
                <button id="convert" onClick={(e) => handleUnitsClick(e)}>
                  °F
                </button>
              </div>
            </div>
            <div className="section section__temperature">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>
              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${
                  units === "metric" ? "C" : "F"
                }`}</h1>
              </div>
            </div>
            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
