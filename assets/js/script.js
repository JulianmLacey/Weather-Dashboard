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

//-------------------SEARCHING-----------------------------------
searchInputBtn.addEventListener("click", function (event) {
  console.log(searchInput.value);
  //cities.push(searchInput.value);
  var bttn = $("<button>").attr("class", "btn btn-dark mt-1 w-100").attr("id", "SavedCitiesBtns").appendTo(BTNGroup);
  $("<span>").text(searchInput.value).appendTo(bttn);
  fetchLatLon(searchInput.value);
});

function fetchLatLon(cityName){
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


function getWeather(cityCoordLat, cityCoordLon, cityName) {
  const apiKey = "bf1dfda850e9b8e443c99bf34aa014bd";
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityCoordLat}&lon=${cityCoordLon}&cnt=7&units=imperial&appid=${apiKey}`;
  fetch(url)
    //.then(response=>{console.log(response)})
    .then((response) => response.json())
    .then((data) => {
      Cities.push(data);
      localStorage.setItem("cities", JSON.stringify(Cities));
      renderSelectedCityCards(Cities.length-1);
      //console.log(data);
    });
}
//-----------------------------------------------------------------

//-------------------RENDERING CARDS-------------------------------



function renderSelectedCityCards(index){



  //FUTURE FORECAST
  var childElements = document.getElementById("card-container");
  var remChild = childElements.lastChild;
  while (remChild) {
   childElements.removeChild(remChild);
   remChild = childElements.lastChild;
   }

  for(var i = 1; i <7;i++){
    renderCard(Cities[index].list[i].main.temp, Cities[index].list[i].wind.speed ,Cities[index].list[i].main.humidity);
  }
}


function renderCard(Ctemp, wind, humidity) {
  var container = $("#card-container");


  var newCard = $("<div>");
  newCard
    .attr("class", "card text-white bg-primary m-3")
    .attr("style", "min-width: 14rem; min-height: 225px;");
  $("<div>").attr("class", "card-header").text(Ctemp).appendTo(newCard);
  var C_Body = $("<div>").attr("class", "card-body").appendTo(newCard);
  $("<h5>").attr("class", "card-title").text(humidity).appendTo(C_Body);
  $("<p>").attr("class", "card-text").text(humidity).appendTo(C_Body);
  newCard.appendTo(container);
}

//-----------------------------------------------------------------

function init(){
  Cities = JSON.parse(localStorage.getItem("cities"));
  if(Cities){
    for(var i = 0; i <Cities.length;i++){
      var bttn = $("<button>").attr("class", "btn btn-dark mt-1 w-100 buttonIndex"+i).attr("id", "SavedCitiesBtns").appendTo(BTNGroup);
      $("<span>").text(Cities[i].city.name).appendTo(bttn);
    }
    for(var i = 1; i <7;i++){
      renderCard(Cities[0].list[i].main.temp, Cities[0].list[i].wind.speed ,Cities[0].list[i].main.humidity);
    }
 
  }
}
init();

  $(document).on('click', '#SavedCitiesBtns', function (e){
    var btnIndex = e.target.classList[4].charAt(11);
    console.log(typeof btnIndex);
      renderSelectedCityCards(btnIndex);
    //console.log(e);
  
  });

