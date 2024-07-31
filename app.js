const cityInput = document.querySelector(".cityInput");
const searchBtn = document.querySelector("#searchBtn");
const weatherCard = document.querySelector(".forecast");
const currentWeather = document.querySelector(".selectedCity");
const locationBtn = document.querySelector("#currentLocationBtn");

const API_key = "2719f878dc5b529f48cd579d5aa3f222";

const createWeatherCard = (weatherItem,index)=>{
    if(index === 0){
        return `<div class="content">
                    <h3>${cityInput.value.charAt(0).toUpperCase() + cityInput.value.slice(1)} (${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <p>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</p>
                    <p>Wind: ${weatherItem.wind.speed} M/S</p>
                    <p>Humidity: ${weatherItem.main.humidity}%</p>
                </div>
                <div class="imageBox">
                    <div class="img"><img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png"></div>
                    <p>${weatherItem.weather[0].description}</p>
                </div>`;
    } else {
        return `<div class="box">
        <h4>(${weatherItem.dt_txt.split(" ")[0]})</h4>
        <div class="boxImg"><img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png"></div>
        <p>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</p>
        <p>Wind: ${weatherItem.wind.speed} M/S</p>
        <p>Humidity: ${weatherItem.main.humidity}%</p>
        </div>`;
    }
};

const getWeatherDetails = async (cityName,lat,lon)=>{
    const Weather_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
    const response = await fetch(Weather_API_URL);
    const data = await response.json();
    // console.log(data.list[0])

    // Five Days Unqie Data
    const uniqueForecastDays = [];
    const fiveDaysForecast = data.list.filter((forecast)=>{
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if(!uniqueForecastDays.includes(forecastDate)){
            return uniqueForecastDays.push(forecastDate);
        }
    });
    fiveDaysForecast.pop();
    // console.log(fiveDaysForecast);
    
    currentWeather.innerHTML="";
    weatherCard.innerHTML="";
    fiveDaysForecast.forEach((weatherItem,index) => {
        if(index === 0){
            currentWeather.insertAdjacentHTML("beforeend",createWeatherCard(weatherItem,index));
        } else{
            weatherCard.insertAdjacentHTML("beforeend",createWeatherCard(weatherItem,index));
        }
        });
}

const getCityCoordinates = async ()=>{
    const cityName = cityInput.value.trim();
    // console.log(cityName);
    const API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_key}`;
    const response = await fetch(API_URL);
    let data = await response.json();
    // console.log(data[0].lat);
    const {name,lat,lon}=data[0];
    getWeatherDetails(name,lat,lon);
}

const getUserCoordinates = ()=>{
    navigator.geolocation.getCurrentPosition(
        position =>{
            const {latitude,longitude} = position.coords;
            const Reverse_Geocoding_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;
            fetch(Reverse_Geocoding_URL).then(res=>res.json()).then(data=>{
                const {name} = data[0];
                getWeatherDetails(name,latitude,longitude);
            }).catch(()=>{
                alert("An error ocurred");
            });
        },
        error =>{
            if(error.code=== error.PERMISSION_DENIED){
                alert("Geolocation request denied.");
            }
        }
    );
}

locationBtn.addEventListener("click",getUserCoordinates);
searchBtn.addEventListener("click",getCityCoordinates);
cityInput.addEventListener("keyup",e => e.key === "Enter" && getCityCoordinates());
 