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
        // create history link for this search
        console.log("current weather works")
        console.log(data);
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));
    
          makeRow(searchValue);
        }
        var currentWeather = `<div class="card bg-light" style="width: 100%;">
        <div class="card-body">
          <h5 class="card-title">${data.name}</h5>
          <p class="card-text">Temperature: ${data.main.temp}°F</p>
          <p class="card-text">Humidity: ${data.main.humidity}%</p>
          <p class="card-text">Wind Speed: ${data.wind.speed}MPH</p>
        </div>
      </div>`;

        $("#today").html(currentWeather);
        
        // call follow-up api endpoints
        getForecast(searchValue);
        getUVIndex(data.coord.lat, data.coord.lon);
      }
    });
  }

/**
 * generate html for five day forecast
 * @param {string} name 
 * @param {string} temp 
 * @param {string} humidity 
 * @param {string} speed 
 */
function genForecastHTML(name, temp, humidity, speed) {
  var forecastWeather = `<div class="card-forecast bg-light" style="width: 20%;">
        <div class="card-body">
          <h5 class="card-title">${name}</h5>
          <p class="card-text">Temperature: ${temp}°F</p>
          <p class="card-text">Humidity: ${humidity}%</p>
          <p class="card-text">Wind Speed: ${speed}MPH</p>
        </div>
      </div>`;

      return forecastWeather;
}

//getforecast variable to use ES6 w / upticks

 /*var forecastWeather = `<div class="card bg-light" style="width: 50px;">
        <div class="card-body">
          <h5 class="card-title">${data.city.name}</h5>
          <p class="card-text">Temperature: ${data.list[0].main.temp}°F</p>
          <p class="card-text">Humidity: ${data.list[0].main.humidity}%</p>
          <p class="card-text">Wind Speed: ${data.list[0].wind.speed}MPH</p>
        </div>
      </div>`;*/

  function getForecast(searchValue) {
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=";
    $.ajax({
      type: "GET",
      url: forecastURL + searchValue + imperialUnits + apiWeatherKey,
      dataType: "json",
      success: function(data) {
        // overwrite any existing content with title and empty row
        console.log("forecast works");
        console.log(data);
        console.log(data.list);
        
        // loop over all forecasts (by 3-hour increments)
        for (var i = 0; i < data.list.length; i++) {
          // only look at forecasts around 3:00pm
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
            // create html elements for a bootstrap card
            console.log(data);

            var fiveDayForecast = genForecastHTML(data.city.name, data.list[0].main.temp, data.list[0].main.humidity, data.list[0].wind.speed);

      $("#forecast").append(fiveDayForecast);
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
        //checking if api works
        console.log("uv index works");
        console.log(data);

        var uv = $("<p>").text("UV Index: ");
        var uvBtn = $("<span>").addClass("uv-btn btn-sm").text(data.value);
        
        // change color depending on uv value

        if (uvBtn > 0 && uvBtn <= 2.99) {
          uvBtn.addClass("low");
        } else if (uvBtn >= 3 && uvBtn <= 5.99) {
          uvBtn.addClass("moderate");
        } else if (uvBtn >= 6 && uvBtn <= 7.99) {
          uvBtn.addClass("high");
        }else if (uvBtn >= 8 && uvBtn <= 10.99) {
          uvBtn.addClass("very-high");
        } else if (uvBtn >= 11) {
          uvBtn.addClass("extremely-high");
        }
        $("#today .card-text").append(uv.append(uvBtn));
        $("#forecast .card-text").append(uv.append(uvBtn));
      }
    });
  }

  // get current history, if any
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
})