const city_input = document.querySelector('.city-input');
const search_button = document.querySelector('.search-button');
const invalidCity = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const weatherInfo = document.querySelector('.weather-info');
const welcomeMessage = document.querySelector('.welcome-heading'); 

const api_key = '67f52c44ba023df234d80aa600135056';

search_button.addEventListener('click', () => {
    if (city_input.value.trim() !== '') {
        updateWeatherInfo(city_input.value);
        city_input.value = '';
        city_input.blur();
        welcomeMessage.style.display = "none"; 
    }
});

city_input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && city_input.value.trim() !== '') {
        updateWeatherInfo(city_input.value);
        city_input.value = '';
        city_input.blur();
        welcomeMessage.style.display = "none";
    }
});

document.addEventListener("click", function (event) {
    if (!city_input.contains(event.target) && !search_button.contains(event.target)) {
        welcomeMessage.style.display = "block"; 
    }
});

async function getData(endpoint, city) {
    const apiURL = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${api_key}&units=metric`;
    const response = await fetch(apiURL);
    return response.json();
}

async function updateWeatherInfo(city) {
    try {
        const weatherData = await getData("weather", city);
        if (weatherData.cod !== 200) {
            show_display_error(invalidCity);
            return;
        }

        const forecastData = await getData("forecast", city);
        if (forecastData.cod !== "200") {
            show_display_error(invalidCity);
            return;
        }

        show_display_error(weatherInfo);
        updateWeatherUI(weatherData);
        updateForecastUI(forecastData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        show_display_error(invalidCity);
    }
}

function show_display_error(section) {
    [weatherInfo, searchCitySection, invalidCity].forEach((sec) => (sec.style.display = 'none'));
    section.style.display = 'flex';
}

function updateWeatherUI(data) {
    document.querySelector('.place-name').textContent = data.name;
    document.querySelector('.current-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
    document.querySelector('.weather-summary').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.querySelector('.temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector('.condition-txt').textContent = data.weather[0].main;
    document.querySelector('.humidity-value-txt').textContent = `${data.main.humidity}%`;
    document.querySelector('.windy-value-txt').textContent = `${data.wind.speed} km/h`;
    document.querySelector('.air-value-txt').textContent = data.main.pressure; 
    document.querySelector('.pollen-value-txt').textContent = 'Nil'; 
}

function updateForecastUI(forecastData) {
    const forecastItemsContainer = document.querySelector('.forecast-items-container');
    forecastItemsContainer.innerHTML = '';

    const dailyForecast = {};
    forecastData.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (!dailyForecast[date]) {
            dailyForecast[date] = item;
        }
    });

    Object.keys(dailyForecast).slice(0, 5).forEach((date) => {
        const item = dailyForecast[date];
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        forecastItem.innerHTML = `
            <h5 class="forecast-item-date regular-txt">${date}</h5>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Forecast Icon" class="forecast-item-img">
            <h5 class="forecast-one-value">${Math.round(item.main.temp)}°C</h5>
        `;

        forecastItemsContainer.appendChild(forecastItem);
    });
}