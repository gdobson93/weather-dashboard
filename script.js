// create a weather api key on the site provided - done
// have a form that allows user to search for city - done
// need to link weather api so current & future weather conditions are presented
// current conditions will have city name, date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the uV index
// the UV index presents a color that indicates whether conditions are favorable, moderate, or severe
// the future conditions has a 5 day forecast with date, an icon representation of weather conditions, the temperature, and humidity
// when user clicks on city in search history they are presented with current and future conditions again
// when weather dashboard is reloaded, last searched city forecast is presented

$(document).ready(function() {
  $("#search-button").on("click", function() {
    var searchValue = $("#search-value").val();

    // clear input box

    searchWeather(searchValue);
  });

  $(".history").on("click", "li", function() {
    searchWeather($(this).text());
  });

  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }

// Global variables

  var imperialUnits = "&units=imperial";
  var apiWeatherKey = "&appid=f18b83f11c206025350af3f0978bacde";
  var queryWeatherURL = "https://api.openweathermap.org/data/2.5/weather?q=";

  function searchWeather(searchValue) {
    $.ajax({
      url: queryWeatherURL + searchValue + imperialUnits + apiWeatherKey,
      type: "GET",
      dataType: "json",
      success: function(data) {
        
        //Check API data is pulling
        console.log("weather works");
        console.log(data);

        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));
    
          makeRow(searchValue);
        }
        var currentWeather = `<div class="card bg-light" style="width: 100%;">
        <div class="card-body">
          <h5 class="card-title">${data.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Temperature: ${data.main.temp}</h6>
          <p class="card-text">Humidity: ${data.main.humidity}</p>
          <p class="card-text">Wind Speed: ${data.wind.speed}</p>
          <p class="card-text">Humidity: ${data.main.humidity}</p>
        </div>
      </div>`;
        $("#today").html(currentWeather);

        $("#today").empty;
        $("#forecast").empty;

        // create html content for current weather

        // merge and add to page
        
        // call follow-up api endpoints
        getForecast(searchValue);
        getUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }
  
  function getForecast(searchValue) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
    $.ajax({
      type: "GET",
      url: forecastURL + searchValue + imperialUnits + apiWeatherKey,
      dataType: "json",
      success: function(data) {

        //check to make sure API data is pulling
        console.log("forecast works");
        console.log(data);
        // overwrite any existing content with title and empty row
        
        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            

            // merge together and put on page
          }
        }
      }
    });
  }

  function getUVIndex(lat, lon) {
    var uvURL = "https://api.openweathermap.org/data/2.5/uvi?";
    $.ajax({
      type: "GET",
      url: uvURL + apiWeatherKey + "&lat=" + lat + "&lon=" + lon,
      dataType: "json",
      success: function(data) {
        
        // check to make sure API data is pulling
        console.log("uv works");
        console.log(data);

        var uv = $("<p>").text("UV Index: ");
        var btn = $("<span>").addClass("btn btn-sm").text(data.value);
        
        // change color depending on uv value
        
        $("#today .card-body").append(uv.append(btn));
      }
    });
  }

  var history = JSON.parse(window.localStorage.getItem("history")) || [];

  if (history.length > 0) {
    searchWeather(history[history.length-1]);
  }

  for (var i = 0; i < history.length; i++) {
    makeRow(history[i]);
  }
});

$("#clear-btn").on("click", function () {
  console.clear();
  localStorage.clear();
  window.location.reload();
});
