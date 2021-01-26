$(document).ready(function () {
  let date = moment().format("l");
  let now = Math.floor(Date.now() / 1000);
  let char = String.fromCharCode(176);
  let search = [];
  let storage = [];
  counter = 0;

  $("#city-search-history").empty();

  if (storage.length === 0) {
    for (let [key, value] of Object.entries(localStorage)) {
      storage.push([parseInt(key), JSON.parse(value)]);
    }
    sort = storage.sort(function (a, b) {
      return a[0] - b[0];
    });
  }

  if (search.length === 0) {
    search.push(sort);
    for (i = 0; i < sort.length; i++) {
      let namesSearched = $("<li>");
      $(namesSearched).addClass("list-group-item");
      $(namesSearched).attr("id", [i + 1]);
      $(namesSearched).append(sort[i][1]);
      $("#city-search-history").append(namesSearched);
    }

    console.log(storage.length);
  }

  $("#search-button").on("click", function () {
    let searchValue = $("#search-value").val();
    counter++;

    if (searchValue !== "") {
      search.push(searchValue);

      localStorage.setItem(
        search.length + sort.length - 1,
        JSON.stringify(searchValue)
      );

      $("#current-city").remove();
      $("#current-temp").remove();
      $("#current-humidity").remove();
      $("#current-windspeed").remove();
      $("#current-description").remove();
      $("#current-description-card").remove();

      $("#card-title1").empty();
      $("#weather-card-1-text-temp").empty();
      $("#weather-card-1-text-humidity").empty();
      $("#card-title2").empty();
      $("#weather-card-2-text-temp").empty();
      $("#weather-card-2-text-humidity").empty();
      $("#card-title3").empty();
      $("#weather-card-3-text-temp").empty();
      $("#weather-card-3-text-humidity").empty();
      $("#card-title4").empty();
      $("#weather-card-4-text-temp").empty();
      $("#weather-card-4-text-humidity").empty();
      $("#card-title5").empty();
      $("#weather-card-5-text-temp").empty();
      $("#weather-card-5-text-humidity").empty();

      let namesSearched = $("<li>");
      $(namesSearched).addClass("list-group-item");
      $(namesSearched).attr("id", counter + sort.length);
      $(namesSearched).append(searchValue);
      $("#city-search-history").append(namesSearched);

      $("#search-value").val("");
      searchWeather(searchValue);
    }
  });
  function searchWeather(searchValue) {
    let queryUrl =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      searchValue +
      "&appid=" +
      "7ef4a367461b959917b5af752a40a0eb" +
      "&units=imperial";
    $.ajax({
      type: "GET",
      url: queryUrl,
      dataType: "json",
      success: function (data) {
        let city = data.city.name;
        let timezone = data.city.timezone;
        let localtime = timezone + now;
        let obj = data.list;
        let objValues = Object.values(obj);

        let forecast = [];
        let current = [];
        forecast.push(city);
        current.push(
          city,
          localtime,
          obj[0].main.temp,
          obj[0].main.humidity,
          obj[0].wind.speed,
          obj[0].weather[0].id,
          obj[0].weather[0].icon,
          obj[0].weather[0].description
        );

        let iconURLcurrent =
          "https://openweathermap.org/img/wn/" + current[6] + "@2x.png";

        let currentCity = $("<h2>");
        currentCity.attr("id", "current-city");
        currentCity.append(current[0] + "(" + date + ")");
        $("#todays-city").append(currentCity);

        let icon = $("<img>");
        icon.attr("src", iconURLcurrent);
        $(currentCity).append(icon);

        let currentTemp = $("<h6>");
        currentTemp.attr("id", "current-temp");
        currentTemp.append("Temperature: " + current[2] + char + "F");
        $("#todays-temperature").append(currentTemp);

        let currentHumidity = $("<h6>");
        currentHumidity.attr("id", "current-humidity");
        currentHumidity.append("Humidity: " + current[3] + "%");
        $("#todays-humidity").append(currentHumidity);

        let currentWindSpeed = $("<h6>");
        currentWindSpeed.attr("id", "current-windspeed");
        currentWindSpeed.append("Wind Speed: " + current[4] + " MPH");
        $("#todays-windspeed").append(currentWindSpeed);

        let currentDescription = $("<h7>");
        currentDescription.attr("id", "current-description");
        currentDescription.append("Description: ");
        $("#todays-description-text").append(currentDescription);

        let currentDescriptionCard = $("<div>");
        currentDescriptionCard.addClass("card-body rounded inline-flex");
        currentDescriptionCard.attr("id", "current-description-card");
        currentDescriptionCard.append(current[7]);
        $(currentDescription).append(currentDescriptionCard);

        for (let i = 0; i < objValues.length; i++) {
          let text = objValues[i].dt_txt;
          let locale = moment(text).format("HH:mm:ss");
          if (locale == "12:00:00") {
            forecast.push(obj[i]);
          }
        }
        let forecastDay1Title = $("<h4>");
        forecastDay1Title.attr("id", "weather-card-1-title");
        forecastDay1Title.append(moment(forecast[1].dt_txt).format("l"));
        $("#card-title1").append(forecastDay1Title);

        let forecastDay1Temp = $("<h6>");
        forecastDay1Temp.attr("id", "weather-card-1-temp");
        forecastDay1Temp.append("Temp: " + obj[1].main.temp);
        $("#weather-card-1-text-temp").append(forecastDay1Temp);

        let forecastDay1Humidity = $("<h6>");
        forecastDay1Humidity.attr("id", "weather-card-1-humidity");
        forecastDay1Humidity.append("Humidity: " + obj[1].main.humidity);
        $("#weather-card-1-text-humidity").append(forecastDay1Humidity);

        let forecastIcon1 = $("<img>");
        forecastIcon1.attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            obj[1].weather[0].icon +
            "@2x.png"
        );
        $(forecastDay1Humidity).append(forecastIcon1);

        let forecastDay2Title = $("<h4>");
        forecastDay2Title.attr("id", "weather-card-2-title");
        forecastDay2Title.append(moment(forecast[2].dt_txt).format("l"));
        $("#card-title2").append(forecastDay2Title);

        let forecastDay2Temp = $("<h6>");
        forecastDay2Temp.attr("id", "weather-card-2-temp");
        forecastDay2Temp.append("Temp: " + obj[2].main.temp);
        $("#weather-card-2-text-temp").append(forecastDay2Temp);

        let forecastDay2Humidity = $("<h6>");
        forecastDay2Humidity.attr("id", "weather-card-2-humidity");
        forecastDay2Humidity.append("Humidity: " + obj[2].main.humidity);
        $("#weather-card-2-text-humidity").append(forecastDay2Humidity);

        let forecastIcon2 = $("<img>");
        forecastIcon2.attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            obj[2].weather[0].icon +
            "@2x.png"
        );
        $(forecastDay2Humidity).append(forecastIcon2);

        let forecastDay3Title = $("<h4>");
        forecastDay3Title.attr("id", "weather-card-3-title");
        forecastDay3Title.append(moment(forecast[3].dt_txt).format("l"));
        $("#card-title3").append(forecastDay3Title);

        let forecastDay3Temp = $("<h6>");
        forecastDay3Temp.attr("id", "weather-card-3-temp");
        forecastDay3Temp.append("Temp: " + obj[3].main.temp);
        $("#weather-card-3-text-temp").append(forecastDay3Temp);

        let forecastDay3Humidity = $("<h6>");
        forecastDay3Humidity.attr("id", "weather-card-3-humidity");
        forecastDay3Humidity.append("Humidity: " + obj[3].main.humidity);
        $("#weather-card-3-text-humidity").append(forecastDay3Humidity);

        let forecastIcon3 = $("<img>");
        forecastIcon3.attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            obj[3].weather[0].icon +
            "@2x.png"
        );
        $(forecastDay3Humidity).append(forecastIcon3);

        let forecastDay4Title = $("<h4>");
        forecastDay4Title.attr("id", "weather-card-4-title");
        forecastDay4Title.append(moment(forecast[4].dt_txt).format("l"));
        $("#card-title4").append(forecastDay4Title);

        let forecastDay4Temp = $("<h6>");
        forecastDay4Temp.attr("id", "weather-card-4-temp");
        forecastDay4Temp.append("Temp: " + obj[4].main.temp);
        $("#weather-card-4-text-temp").append(forecastDay4Temp);

        let forecastDay4Humidity = $("<h6>");
        forecastDay4Humidity.attr("id", "weather-card-4-humidity");
        forecastDay4Humidity.append("Humidity: " + obj[4].main.humidity);
        $("#weather-card-4-text-humidity").append(forecastDay4Humidity);

        let forecastIcon4 = $("<img>");
        forecastIcon4.attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            obj[4].weather[0].icon +
            "@2x.png"
        );
        $(forecastDay4Humidity).append(forecastIcon4);

        let forecastDay5Title = $("<h4>");
        forecastDay5Title.attr("id", "weather-card-5-title");
        forecastDay5Title.append(moment(forecast[5].dt_txt).format("l"));
        $("#card-title5").append(forecastDay5Title);

        let forecastDay5Temp = $("<h6>");
        forecastDay5Temp.attr("id", "weather-card-5-temp");
        forecastDay5Temp.append("Temp: " + obj[5].main.temp);
        $("#weather-card-5-text-temp").append(forecastDay5Temp);

        let forecastDay5Humidity = $("<h6>");
        forecastDay5Humidity.attr("id", "weather-card-5-humidity");
        forecastDay5Humidity.append("Humidity: " + obj[5].main.humidity);
        $("#weather-card-5-text-humidity").append(forecastDay5Humidity);

        let forecastIcon5 = $("<img>");
        forecastIcon5.attr(
          "src",
          "https://openweathermap.org/img/wn/" +
            obj[5].weather[0].icon +
            "@2x.png"
        );
        $(forecastDay5Humidity).append(forecastIcon5);
      }
    });
  }
});
