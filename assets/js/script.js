//call weather api
//call location api
// get location
// get weather
//get search inquiry
//get search history
//store search inquiry into local storage
//get 5 day forecast
//search button
//previous searches are clickable

const geoCall = 'http://api.openweathermap.org/geo/1.0/direct?q='
const geoCallEnd = '&limit=5&appid=0234c7f88c3f9aac4ae6f0266bab2d58'

// {city name},{state code},{country code}&limit=5&appid=0234c7f88c3f9aac4ae6f0266bab2d58'

//global variables
const searchBtn = document.querySelector("#searchBtn");
let searchInput = document.querySelector("#searchInput");
let searchHistory = document.querySelector("#searchHistory");
let historyBtn = document.querySelector(".historyBtn");
// const fiveDayForecast = document.querySelector("#5dayForecast");

//search button event listener
searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    searchedInput = document.querySelector("#searchInput").value;
    console.log(searchedInput);

    //create button for search history
    searchedInput = document.createElement("button");
    let userInput = searchedInput.textContent = searchInput.value;

    console.log(userInput);

    searchHistory.appendChild(searchedInput);
    searchedInput.setAttribute("class", "historyBtn btn btn-secondary btn-lg btn-block w-100");
    getGeo(userInput);
});



// get geo location to get lat and lon then pass to get weather
function getGeo(userInput) {
    let requestUrl = geoCall + userInput + geoCallEnd;

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // get the lat and lon from the response and pass to get weather
            let userLat = data[0].lat;
            let userLon = data[0].lon;
            getWeather(userLat, userLon);
        }
        );

}



// get weather
function getWeather(userLat, userLon) {
    let requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=";
    let requestUrl2 = "&lon=";
    let requestUrl3 = "&appid=0234c7f88c3f9aac4ae6f0266bab2d58";
    let requestUrl4 = requestUrl + userLat + requestUrl2 + userLon + requestUrl3;

    fetch(requestUrl4)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            let cityName = data.name;
            console.log(cityName);

            let searchedDateTimeStamp = data.dt;
            let searchedDate = new Date(searchedDateTimeStamp * 1000)
            let cityDate = searchedDate.toLocaleDateString("en-US");
            console.log(cityDate);

            let cityTemp = data.main.temp; // temperature received in Kelvin
            console.log(cityTemp);
            let tempF = (cityTemp - 273.15) * 1.8 + 32; // convert to Fahrenheit
            console.log(tempF);
            let cityHumidity = data.main.humidity;
            console.log(cityHumidity);
            let cityWind = data.wind.speed;
            console.log(cityWind);
            let cityIcon = data.weather[0].icon;
            console.log(cityIcon);

            // Output current weather data to currentWeather section
            let currentWeatherSection = document.querySelector("#currentWeather");
            currentWeatherSection.innerHTML = `
          <h2 id="cityTodayWeather">${cityName} ${cityDate}</h2>
          <div class="d-flex flex-column">
            <div class="d-flex flex-row"></div>
            <p id="currentTemp">${tempF.toFixed(2)}°F</p>
            <p id="currentHumidity">${cityHumidity}% humidity</p>
            <p id="currentWindSpeed">${cityWind} m/s wind</p>
          </div>
        `;



        });
}
