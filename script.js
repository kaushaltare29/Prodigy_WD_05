const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");

const API_KEY = "e87655df9c6f1404714e5cc41c5054d0";

const createWeatherCard = (cityName, weatherItem) => {
    return `<div class="details">
                <h2>${cityName}</h2>
                <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                <h6>Humidity: ${weatherItem.main.humidity}%</h6>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                <h6>${weatherItem.weather[0].description}</h6>
            </div>`;
};

const getWeatherDetails = (cityName) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL)
        .then(response => response.json())
        .then(data => {

            cityInput.value = "";
            currentWeatherDiv.innerHTML = "";

            if (data.cod !== 200) {
                throw new Error(data.message || "An error occurred while fetching the weather forecast!");
            }

            const html = createWeatherCard(cityName, data);
            currentWeatherDiv.insertAdjacentHTML("beforeend", html);
        })
        .catch(error => {
            alert(error.message);
        });
};

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;

    getWeatherDetails(cityName);
};

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; 
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL)
                .then(response => response.json())
                .then(data => {
                    const { name } = data[0];
                    getWeatherDetails(name);
                })
                .catch(() => {
                    alert("An error occurred while fetching the city name!");
                });
        },
        error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        }
    );
};

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());