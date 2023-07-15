/* PSUEDO-CODE

-------VARIABLES------
search input - text input
search input - button
Cities array

ON SEARCH ENTRY (button event listener)
-add search text to cities array
-get city coordinates
-save data to new object
-save new object to local storage

ON CITY SELECTION
-get object from local storage
  -id of city name
-render each weather card with specific city weather



*/

var searchInput = document.getElementById("searchInput");
var searchInputBtn = document.getElementById("searchInputBtn");
var BTNGroup = document.getElementById("SearchResultsBtnGroup");

var Cities = [];
var todayDate = dayjs();
console.log(todayDate.format("MMMM DD, YYYY"));
//-------------------SEARCHING-----------------------------------
searchInputBtn.addEventListener("click", function (event) {
  console.log(searchInput.value);
  //cities.push(searchInput.value);
  var bttn = $("<button>")
    .attr("class", "btn btn-dark mt-1 w-100 buttonIndex" + Cities.length)
    .attr("id", "SavedCitiesBtns")
    .appendTo(BTNGroup);
  $("<span>").text(searchInput.value).appendTo(bttn);
  fetchLatLon(searchInput.value);
});

function fetchLatLon(cityName) {
  const apiKey = "bf1dfda850e9b8e443c99bf34aa014bd";
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;
  fetch(url)
    //.then(response=>{console.log(response)})
    .then((response) => response.json())
    .then((data) => {
      console.log(data[0]);
      console.log(data[0].lat);
      console.log(data[0].lon);
      getWeather(data[0].lat, data[0].lon, cityName);
    });
}

function getWeather(cityLat, cityLon, cityName) {
  const apiKey = "bf1dfda850e9b8e443c99bf34aa014bd";
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&cnt=7&units=imperial&appid=${apiKey}`;
  fetch(url)
    //.then(response=>{console.log(response)})
    .then((response) => response.json())
    .then((data) => {
      Cities.push(data);
      localStorage.setItem("cities", JSON.stringify(Cities));
      renderSelectedCityCards(Cities.length - 1);
      //console.log(data);
    });
}
//-----------------------------------------------------------------

//-------------------RENDERING CARDS-------------------------------

function renderSelectedCityCards(index) {
  //FUTURE FORECAST
  $("#DisplayCityText").text(Cities[index].city.name);
  var childElements = document.getElementById("card-container");
  var remChild = childElements.lastChild;
  while (remChild) {
    childElements.removeChild(remChild);
    remChild = childElements.lastChild;
  }
  childElements = document.getElementById("currentWeather");
  remChild = childElements.lastChild;
  while (remChild) {
    childElements.removeChild(remChild);
    remChild = childElements.lastChild;
  }

  var currentWeather = $("#currentWeather");
  var Ctemp = Cities[index].list[0].main.temp;
  var wind = Cities[index].list[0].wind.speed;
  var humidity = Cities[index].list[0].main.humidity;
  var iconcode = Cities[index].list[0].weather[0].icon;

  var headerTxt = $("<h3>")
    .text(dayjs().format("dddd, MMMM DD"))
    .appendTo(currentWeather); //date
  var C_Body = $("<h4>").appendTo(currentWeather);
  var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
  $("<img>").attr("src", iconurl).appendTo(headerTxt);
  //temp
  $("<h5>")
    .text("Temp: " + Ctemp + "°f")
    .appendTo(currentWeather); //temp
  //wind + Humidity
  var h = $("<p>")
    .text("Wind: " + wind + " mph\n Humidity: " + humidity + " g.m")
    .appendTo(currentWeather);
  h.html(h.html().replace(/\n/g, "<br/>"));
  //humidity

  $("<sup>").text("-3").appendTo(h);

  for (var i = 1; i < 7; i++) {
    renderCard(
      Cities[index].list[i].main.temp,
      Cities[index].list[i].wind.speed,
      Cities[index].list[i].main.humidity,
      i,
      Cities[index].list[i].weather[0].icon
    );
  }
}

function renderCard(Ctemp, wind, humidity, k, iconcode) {
  var container = $("#card-container");

  var newCard = $("<div>");
  newCard
    .attr("class", "card text-white bg-primary m-3")
    .attr("style", "min-width: 14rem; min-height: 225px;");
  //date
  var headerTxt = $("<div>")
    .attr("class", "card-header pt-1 pb-1")
    .text(dayjs().add(k, "days").format("dddd, MMMM DD"))
    .appendTo(newCard); //date
  var C_Body = $("<div>").attr("class", "card-body").appendTo(newCard);
  var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
  $("<img>").attr("src", iconurl).appendTo(headerTxt);
  //temp
  $("<h5>")
    .attr("class", "card-title")
    .text("Temp: " + Ctemp + "°f")
    .appendTo(C_Body); //temp
  //wind + Humidity
  var h = $("<p>")
    .attr("class", "card-text")
    .text("Wind: " + wind + " mph\n Humidity: " + humidity + " g.m")
    .appendTo(C_Body);
  h.html(h.html().replace(/\n/g, "<br/>"));
  //humidity

  $("<sup>").text("-3").appendTo(h);
  newCard.appendTo(container);
}

//-----------------------------------------------------------------

function init() {
  Cities = JSON.parse(localStorage.getItem("cities"));
  if (Cities) {
    for (var i = 0; i < Cities.length; i++) {
      var bttn = $("<button>")
        .attr("class", "btn btn-dark mt-1 w-100 buttonIndex" + i)
        .attr("id", "SavedCitiesBtns")
        .appendTo(BTNGroup);
      $("<span>").text(Cities[i].city.name).appendTo(bttn);
      $("#DisplayCityText").text(Cities[i].city.name);
    }
    //console.log(Cities[0].list[1].weather[0].icon);
    //for(var i = 1; i <7;i++){
    //renderCard(Cities[0].list[i].main.temp, Cities[0].list[i].wind.speed ,Cities[0].list[i].main.humidity,i, Cities[0].list[i].weather[0].icon);
    //}
    renderSelectedCityCards(0);
  }else{
    Cities = [];
    localStorage.setItem("cities", JSON.stringify(Cities));
  }
}
init();

$(document).on("click", "#SavedCitiesBtns", function (e) {
  var btnIndex = e.target.classList[4].charAt(11);
  $("#DisplayCityText").text(Cities[btnIndex].city.name);
  renderSelectedCityCards(btnIndex);
  //console.log(e);
});
