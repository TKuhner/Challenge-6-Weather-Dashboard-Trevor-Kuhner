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
const fiveDayForecast = document.querySelector("#5dayForecast");

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

function getGeo(userInput) {
    let requestUrl = geoCall + userInput + geoCallEnd;
    console.log(requestUrl);



    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            let userLat = data[0].lat;
            let userLon = data[0].lon;
            console.log(userLat);
            console.log(userLon);
            getWeather(userLat, userLon);

            for (let i = 0; i < data.length; i++) {
                
            }
        }
        );

}




function getWeather(userLat, userLon) {
    let requestUrl = "https://api.openweathermap.org/data/2.5/weather?lat=";
    let requestUrl2 = "&lon=";
    let requestUrl3 = "&appid=0234c7f88c3f9aac4ae6f0266bab2d58";
    let requestUrl4 = requestUrl + userLat + requestUrl2 + userLon + requestUrl3;
    console.log(requestUrl4);

    fetch(requestUrl4)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            let cityName = data.name;
            console.log(cityName);
            let cityTemp = data.main.temp;
            console.log(cityTemp);
            let tempF = (cityTemp - 273.15) * 1.80 + 32;
            console.log(tempF);
            let cityHumidity = data.main.humidity;
            console.log(cityHumidity);
            let cityWind = data.wind.speed;
            console.log(cityWind);
            let cityIcon = data.weather[0].icon;
            console.log(cityIcon);

        }
        );

}


