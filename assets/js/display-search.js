// Define variables for HTML elements
let searchcityFormEl = document.querySelector('#search-form');
let searchInputEl = document.querySelector('#form-input');
let currentweatherEl = document.querySelector('#current-weather');
let searchbuttonEl = document.querySelector('#search-button');
let citySelectEl = document.querySelector('#city-select');
let cityInputEl = document.querySelector('#city-input');
let userInputEl = document.querySelector('#user-input');
let searchHistoryListEl = document.querySelector('#search-history-list');
let storedUserInputs = JSON.parse(localStorage.getItem("storedUserInputs")) || [];
const forecastContainer = document.querySelector ("#forecasts-cards-container");

// make list of previously searched cities
function displaySearchHistory() {
    searchHistoryListEl.innerHTML = "";
    storedUserInputs.forEach(city => {
        let listItem = document.createElement('button');
        listItem.textContent = city;
        listItem.classList.add('past-search',"btn","btn-primary");
        listItem.addEventListener('click', function () {
            getApi(city);
        });
        searchHistoryListEl.appendChild(listItem);
    });
}

// Event listener for the search button click
searchbuttonEl.addEventListener("click", function (e) {
    e.preventDefault();
    let citySelect = document.getElementById("city-select");
    let selectedCity = citySelect.value
    if (!selectedCity) return
    // document.getElementById("selected-city").value = selectedCity;
    getApi(selectedCity);
    citySelect.value =""
});




//update local storage with the new array of stored user inputs

function saveCity(city){
    if (storedUserInputs.includes(city))
        return
    storedUserInputs.push(city);
    localStorage.setItem("storedUserInputs", JSON.stringify(storedUserInputs));
    displaySearchHistory() 
}



// Function to get weather data from an API
function getApi(userInput) {
    let requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userInput + "&appid=10624d5e6634858d31e4d2904ece6461";

    fetch(requestURL)
        .then(response => response.json())
        .then(data => {
            
            const { lat, lon } = data.coord;
            saveCity(data.name)
            fiveDayForecast(lat, lon);
            updateWeatherUI(data);
        })
        .catch(error => console.error(error));
}

// Function to update the UI with weather data
function updateWeatherUI(weatherData) {
    // Extract relevant weather information from the data
    const city = weatherData.name;
    const temperature = kelvinToFahrenheit(weatherData.main.temp);
    const condition = weatherData.weather[0].main;
    const wind = weatherData.wind.speed;
    const humidity = weatherData.main.humidity;

    // Update the UI elements with the weather data
    currentweatherEl.innerHTML = `
        <h2>${city}</h2>
        <h3>${dayjs.unix(weatherData.dt).format("MM/DD/YYYY")}</h3>
        <img src="http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" alt="Weather icon">
        <p>Temperature: ${temperature} °F</p>
        <p>Condition: ${condition}</p>
        <p>Wind: ${wind} mph</p>
        <p>Humidity: ${humidity}%</p>
    `;
}

// Function to convert temperature from Kelvin to Fahrenheit
function kelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9 / 5 + 32;
}

// Form submission event listener
//  searchcityFormEl.addEventListener('submit', function (event) {
//     event.preventDefault();
//     let userInput = searchInputEl.value;
//     getApi(userInput);


let fiveDayForecast = function (lat,lon) {
    const apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=10624d5e6634858d31e4d2904ece6461 `;
    // get and use data from open weather current weather api end point
    fetch(apiUrlForecast)
        // get response and turn it into objects
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            
            //fetch(`http://api.openweathermap.org/geo/1.0/direct?q=" + lon + lan ={API key}`)
            // get response from one call api and turn it into objects
            //.then(function(response) {
            //  return response.json();
            //})
            //.then(function(response) {
            //console.log(response);

            // add 5 day forecast title
            let futureForecastTitle = $("#future-forecast-title");
            futureForecastTitle.text("5-Day Forecast:")
           forecastContainer.innerHTML=""
            // using data from response, set up each day of 5 day forecast
            for (var i = 3; i < response.list.length; i+=8) {
                var iconUrl = `https://openweathermap.org/img/w/${response.list[i].weather[0].icon}.png`;
                // add class to future cards to create card containers
                let Card = $("<div>");
                Card.css ("width", "18rem")
                Card.addClass("card-details forecast card bg-primary rounded mx-2");
                const icon = $("<img>").attr("src", iconUrl);
                icon.css("width", "50px");
                // add date to 5 day forecast
                let date = $("<h4>").text(dayjs.unix(response.list[i].dt).format("MM/DD/YYYY"));
                // add temp to 5 day forecast
                let Temp = $("<p>") .text("Temp: " + response.list[i].main.temp + " \u00B0F");
               

                // add humidity to 5 day forecast
                let Humidity = $("<p>").text("Humidity: " + response.list[i].main.humidity + "%");
                let wind = $("<p>").text("Wind: " + response.list[i].wind.speed + " MPH");

                Card.append(date, icon, Temp, Humidity, wind);
                $("#forecasts-cards-container").append(Card);
            }

        })
}
displaySearchHistory() 









