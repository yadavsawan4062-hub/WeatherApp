const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWerather]");
const userCotainer = document.querySelector(".weather-cotainer");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm= document.querySelector("[data-searchForm]");
const lodingScreen= document.querySelector(".loding-container");
const userInfoContainer= document.querySelector(".user-info-container");
const parameterContainer= document.querySelector(".parameter-container");

let currentTab = userTab;
const API_KEY ="e336c361a56ab71bfbfcf699e91f9e6a";
currentTab.classList.add("current-tab");
getfromSessionStorage();
 
function switchTab(clickedTab){
 if(clickedTab!=currentTab){
    currentTab.classList.remove("current-tab");
    currentTab=clickedTab;
    currentTab.classList.add("current-tab");
  
    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active")
        getfromSessionStorage();
    } 
 }
};

 userTab.addEventListener("click", () =>{
    switchTab(userTab);
 })

 searchTab.addEventListener("click", () =>{
    switchTab(searchTab);
 })

 function getfromSessionStorage(){
   const localCoordinates= localStorage.getItem("user-coordinates");
   if(!localCoordinates){
       grantAccessContainer.classList.add("active");
   }
   else{
      const coordinates =JSON.parse(localCoordinates);
      fetchUserWeatherInfo(coordinates);
      
   }
 }

 async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} =coordinates;
    grantAccessContainer.classList.remove("active");

    lodingScreen.classList.add("active");
    try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
      const data = await response.json();

      lodingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
    }
    catch(err){

      lodingScreen.classList.remove("active");
      console.log("check code" );
    }

 }

 function renderWeatherInfo(weatherInfo){
   const cityName = document.querySelector("[data-cityName]");
   const countryIcon = document.querySelector("[data-countryIcon]");
   const weatherDesc = document.querySelector("[data-weatherDesc]");
   const weatherIcon = document.querySelector("[data-weatherIcon]");
   const temp = document.querySelector("[data-temp]");
   const windspeed = document.querySelector("[data-windspeed]");
   const humidity = document.querySelector("[data-humidity]");
   const clouds = document.querySelector("[data-cloudiness]");

   cityName.innerText = weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   weatherDesc.innerText=weatherInfo?.weather?.[0]?.description;  
   weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
   temp.innerText=`${weatherInfo?.main?.temp} °C `;
   windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
   humidity.innerText=`${weatherInfo?.main?.humidity} % `;
   clouds.innerText=`${weatherInfo?.clouds?.all} %`;
   }

   function getLocation(){
      if(navigator.geolocation){
         navigator.geolocation.getCurrentPosition(showPosition)
      }
      else{
         
      }
   }

   function showPosition(position){
        const userCoordinates={
         lat: position.coords.latitude,
         lon: position.coords.longitude,
        };
        localStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
        fetchUserWeatherInfo(userCoordinates);
   }

   const grantAccessButton = document.querySelector("[data-grantAccess]");
   grantAccessButton.addEventListener("click", getLocation);
    const searchInput = document.querySelector("[data-searchInput]");

    searchForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      let cityName= searchInput.value;

      if(cityName ==="")
         return;
      else
         fetchSearchWeatherInfo(cityName)
    })

async function fetchSearchWeatherInfo(city){
 lodingScreen.classList.add("active");
 userInfoContainer.classList.remove("active");
 grantAccessContainer.classList.remove("active");

 try{

   const response=await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
   );
   const data = await response.json();
 lodingScreen.classList.remove ("active");
 userInfoContainer.classList.add("active");
renderWeatherInfo(data);

 }
 catch(err){

 }
    }