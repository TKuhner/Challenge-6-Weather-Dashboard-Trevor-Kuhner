//global variables
const searchBtn = document.querySelector("#searchBtn");
let searchInput = document.querySelector("#searchInput");
const clearBtn = document.querySelector("#clearBtn");
let userSearchHistory = [];

// convert temperature from Kelvin to Fahrenheit for api call
function kelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9 / 5 + 32;
}

// loads stored searches from local storage
function loadStoredSearches() {
    let storedSearches = localStorage.getItem("searchedCities");
    // if there are stored searches, load them
    if (storedSearches) {
        // split the string into an array
        userSearchHistory = storedSearches.split(",");
        // create a button for each search
        for (let i = 0; i < userSearchHistory.length; i++) {
            let searchedInput = document.createElement("button");
            searchedInput.textContent = userSearchHistory[i];
            searchHistory.appendChild(searchedInput);
            searchedInput.setAttribute("class", "historyBtn btn btn-secondary btn-lg btn-block w-100");
        }
    }
}

// clear search history and reload page
clearBtn.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.clear();
    location.reload();
});

//search button event listener
searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    searchedInput = document.querySelector("#searchInput").value;

    //create button for search history
    searchedInput = document.createElement("button");
    let userInput = searchedInput.textContent = searchInput.value;

    // store search history in local storage if it doesn't already exist, otherwise get weather
    if (userSearchHistory.includes(userInput)) {
        getGeo(userInput);
    } else {
        // append the array with the new search and load to local storage under same key
        userSearchHistory.push(userInput);
        localStorage.setItem("searchedCities", userSearchHistory);
        // create a new button for each search
        searchHistory.appendChild(searchedInput);
        searchedInput.setAttribute("class", "historyBtn btn btn-secondary btn-lg btn-block w-100");
        getGeo(userInput);

    }



});


// Event listener for history buttons
document.addEventListener("click", function (event) {
    event.preventDefault();
    if (event.target.classList.contains("historyBtn")) {
        let historyInput = event.target.textContent;

        // call getGeo function with historyInput
        getGeo(historyInput);
    }
});


// get geo location to get lat and lon then pass to get weather
function getGeo(userInput) {
    let requestUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=5&appid=0234c7f88c3f9aac4ae6f0266bab2d58`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // get the lat and lon from the response and pass to get weather
            let userLat = data[0].lat;
            let userLon = data[0].lon;
            getWeather(userLat, userLon);
            getForecast(userLat, userLon);

        }
        );

}



// get weather
function getWeather(userLat, userLon) {
    let requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLon}&appid=0234c7f88c3f9aac4ae6f0266bab2d58`;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            // city name
            let cityName = data.name;

            // date data
            let searchedDateTimeStamp = data.dt;
            let searchedDate = new Date(searchedDateTimeStamp * 1000)
            let cityDate = searchedDate.toLocaleDateString("en-US");

            // weather data
            let cityTemp = kelvinToFahrenheit(data.main.temp); // temperature received in Kelvin
            let cityHumidity = data.main.humidity;
            let cityWind = data.wind.speed;
            let cityIcon = data.weather[0].icon;


            // Output current weather data to currentWeather section
            let currentWeatherSection = document.querySelector("#currentWeather");
            currentWeatherSection.innerHTML = `
          <h2 id="cityTodayWeather">${cityName} ${cityDate}</h2>
          <div class="d-flex flex-column">
            <div class="d-flex flex-row"></div>
            <p id="currentTemp">${cityTemp.toFixed(2)}°F</p>
            <p id="currentHumidity">${cityHumidity}% humidity</p>
            <p id="currentWindSpeed">${cityWind} m/s wind</p>
            <img src="https://openweathermap.org/img/w/${cityIcon}.png" alt="weather icon">
          </div>
        `;

        });
}

function getForecast(userLat, userLon) {
    let weekArray = [];
    let iconArray = [];
    let requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${userLat}&lon=${userLon}&appid=0234c7f88c3f9aac4ae6f0266bab2d58`;


    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            for (let i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.includes("12:00:00")) {
                    weekArray.push(data.list[i]);
                    iconArray.push(data.list[i].weather[0].icon);
                }
            }


            // Output forecast data to forecast section
            let forecastSection = document.querySelector("#weekForecast");
            forecastSection.innerHTML = `<h3 class="w-100 m-2">5-Day Forecast:</h3>`;

            for (let i = 0; i < weekArray.length; i++) {
                let forecast = weekArray[i];
                let icon = `https://openweathermap.org/img/w/${iconArray[i]}.png`;


                let card = document.createElement("div");
                card.classList.add("card", "m-2");
                card.style.width = "10rem";

                let cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                let cardDay = document.createElement("h5");
                cardDay.classList.add("card-day");
                cardDay.textContent = forecast.dt_txt;
                cardBody.appendChild(cardDay);

                // Populate other forecast details such as temperature, humidity, wind, and icon
                let fahrenheitTemp = kelvinToFahrenheit(forecast.main.temp);

                let cardTemp = document.createElement("p");
                cardTemp.classList.add("card-temp");
                cardTemp.textContent = `Temperature: ${fahrenheitTemp.toFixed(2)}°F`;
                cardBody.appendChild(cardTemp);

                let cardHumidity = document.createElement("p");
                cardHumidity.classList.add("card-humid");
                cardHumidity.textContent = `Humidity: ${forecast.main.humidity}`;
                cardBody.appendChild(cardHumidity);

                let cardWind = document.createElement("p");
                cardWind.classList.add("card-wind");
                cardWind.textContent = `Wind: ${forecast.wind.speed} m/s`;
                cardBody.appendChild(cardWind);

                let cardIcon = document.createElement("img");
                cardIcon.classList.add("card-icon");
                cardIcon.src = icon;
                cardBody.appendChild(cardIcon);

                card.appendChild(cardBody);
                forecastSection.appendChild(card);
            }
        });
}

loadStoredSearches();