document.getElementById('search-btn').addEventListener('click', fetchWeather);

function fetchWeather() {
    const city = document.getElementById('search-input').value.trim();
    if (!city) return alert("Please enter a valid city name.");

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.WEATHER_API_KEY}&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                alert("City not found.");
                return;
            }

            console.log("Fetched Weather Data:", data); // Debugging

            // Update weather details
            document.getElementById('city-name').textContent = data.name;
            document.getElementById('temperature').textContent = `${data.main.temp}°C`;
            document.getElementById('humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('wind-speed').textContent = `${data.wind.speed} km/h`;

            const weatherMain = data.weather[0].main.toLowerCase();
            updateWeatherIcon(weatherMain);
            changeBackground(weatherMain);

            document.getElementById('weather-container').classList.remove('d-none');

            // Add city to favorites
            document.getElementById('add-favorite').onclick = () => addToFavorites(data.name, weatherMain);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Failed to fetch weather data.");
        });
}

function updateWeatherIcon(weather) {
    const iconMap = {
        clear: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
        clouds: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
        rain: "https://cdn-icons-png.flaticon.com/512/1163/1163654.png",
        thunderstorm: "https://cdn-icons-png.flaticon.com/512/1163/1163673.png",
        snow: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
        mist: "https://cdn-icons-png.flaticon.com/512/1163/1163647.png",
    };
    document.getElementById('weather-icon').src = iconMap[weather] || iconMap.clear;
}

function changeBackground(weather) {
    const backgroundMap = {
        clear: "linear-gradient(to right, #ff7e5f, #feb47b)",
        clouds: "linear-gradient(to right, #a8c0ff, #3f2b96)",
        rain: "linear-gradient(to right, #00c6ff, #0072ff)",
        thunderstorm: "linear-gradient(to right, #ff9a8b, #d2a6f4)",
        snow: "linear-gradient(to right, #e0eafc, #cfdef3)",
        mist: "linear-gradient(to right, #b3b6b7, #d7dbdd)",
    };

    // Set page background
    document.body.style.background = backgroundMap[weather] || backgroundMap.clear;

    // Set card background with an image
    const cardImageMap = {
        clear: "url('images/sunny.jpg')",
        clouds: "url('images/cloudy.jpg')",
        rain: "url('images/rainy.jpg')",
        thunderstorm: "url('images/storm.jpg')",
        snow: "url('images/snow.jpg')",
        mist: "url('images/mist.jpg')",
    };

    document.getElementById('weather-container').style.background = cardImageMap[weather] || cardImageMap.clear;
    document.getElementById('weather-container').style.backgroundSize = "cover";
    document.getElementById('weather-container').style.backgroundPosition = "center";
}

function addToFavorites(city, weather) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Prevent duplicate entries
    if (!favorites.some(fav => fav.city === city)) {
        favorites.push({ city, weather });
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    displayFavorites();
}

function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favContainer = document.getElementById('favorite-cities');
    favContainer.innerHTML = '';

    favorites.forEach(fav => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${fav.city}&appid=${config.WEATHER_API_KEY}&units=metric`)
            .then(response => response.json())
            .then(data => {
                if (data.cod !== 200) return;

                console.log(`Weather data for ${fav.city}:`, data);

                const card = document.createElement('div');
                card.className = 'col-md-4 city-card';
                // card.style.background = `url('images/${fav.weather}.jpg')`;
                card.style.backgroundSize = "cover";
                card.style.backgroundPosition = "center";
                card.innerHTML = `
                    <h5>${fav.city}</h5>
                    <p>${data.main.temp}°C</p>
                    <button class="btn btn-danger btn-sm" onclick="removeCity('${fav.city}')">Delete</button>
                `;
                favContainer.appendChild(card);
            })
            .catch(error => console.error(`Error fetching data for ${fav.city}:`, error));
    });
}

function removeCity(city) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.city !== city);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

// Load favorite cities on page load
displayFavorites();
