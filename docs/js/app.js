/*
=====================================
 Kurdistan Weather App
 نسخه 1.0
 Open-Meteo API
=====================================
*/
const sunrise =
document.getElementById("sunrise");

const sunset =
document.getElementById("sunset");

const dayLength =
document.getElementById("dayLength");
console.log("Weather App Loaded");
const API =
"https://api.open-meteo.com/v1/forecast";

const citySelect =
document.getElementById("city");

const cityLabel =
document.getElementById("cityLabel");

const temperature =
document.getElementById("temperature");

const condition =
document.getElementById("condition");

const wind =
document.getElementById("wind");

const humidity =
document.getElementById("humidity");

const rain =
document.getElementById("rain");

const forecast =
document.getElementById("forecast");

const weatherIcon =
document.getElementById("weatherIcon");

/*---------------------------*/

function currentCity(){

    const value =
    citySelect.value.split(",");

    return {

        lat:value[0],

        lon:value[1],

        name:
        citySelect.options[
        citySelect.selectedIndex
        ].text

    };

}

/*---------------------------*/

async function loadWeather() {

    const city = currentCity();

    cityLabel.textContent = city.name;

    temperature.textContent = "...";
    condition.textContent = "در حال دریافت اطلاعات";
    forecast.innerHTML = "";

    const url =

            `${API}?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&forecast_days=7&timezone=auto`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Network Error");
        }

        const data = await response.json();

        showCurrent(data);
        
        showForecast(data);
        showSun(data);

    } catch (e) {

        condition.textContent = "خطا در اتصال";
        temperature.textContent = "--";
    }
}

/*---------------------------*/

citySelect.addEventListener(
"change",
()=>{

    loadWeather();

    loadHourlyChart();

});

/*---------------------------*/

window.addEventListener(

"load",

loadWeather

);

/*=====================================
  تبدیل کدهای Open-Meteo به متن فارسی
======================================*/

function weatherCodeToText(code){

    const map = {

        0:"آسمان صاف",

        1:"اکثراً صاف",

        2:"نیمه ابری",

        3:"ابری",

        45:"مه",

        48:"مه یخ زده",

        51:"نم نم باران",

        53:"باران",

        55:"باران شدید",

        56:"باران یخ زده",

        57:"باران یخ زده شدید",

        61:"باران",

        63:"باران متوسط",

        65:"باران شدید",

        66:"باران یخ زده",

        67:"باران یخ زده شدید",

        71:"برف",

        73:"برف متوسط",

        75:"برف سنگین",

        77:"دانه های برف",

        80:"رگبار",

        81:"رگبار شدید",

        82:"رگبار خیلی شدید",

        85:"برف",

        86:"برف سنگین",

        95:"رعد و برق",

        96:"رعد و برق و تگرگ",

        99:"طوفان شدید"

    };

    return map[code] || "نامشخص";

}

/*=====================================
  انتخاب آیکون SVG
======================================*/

function weatherCodeToIcon(code){

    if(code==0)
        return "/icons/sun.svg";

    if(code>=1 && code<=3)
        return "/icons/cloud.svg";

    if(code>=45 && code<=57)
        return "/icons/cloud.svg";

    if(code>=61 && code<=67)
        return "/icons/rain.svg";

    if(code>=71 && code<=86)
        return "/icons/snow.svg";

    if(code>=95)
        return "/icons/storm.svg";

    return "/icons/cloud.svg";

}

/*=====================================
  نمایش وضعیت فعلی
======================================*/

function showCurrent(data){

    const current = data.current;

    temperature.innerHTML =
        Math.round(current.temperature_2m) + "°";

    condition.innerHTML =
        weatherCodeToText(current.weather_code);

    weatherIcon.src =
        weatherCodeToIcon(current.weather_code);

    wind.innerHTML =
        current.wind_speed_10m + " km/h";

    humidity.innerHTML =
        current.relative_humidity_2m + "%";

    rain.innerHTML =
        current.rain + " mm";

}

/*=====================================
  نام روزهای هفته
======================================*/

const weekDays = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
    "شنبه"
];

/*=====================================
  نمایش پیش‌بینی ۷ روزه
======================================*/

function showForecast(data){

    forecast.innerHTML = "";

    const daily = data.daily;

    for(let i=0;i<daily.time.length;i++){

        const date = new Date(daily.time[i]);

        const dayName =
            weekDays[date.getDay()];

        const icon =
            weatherCodeToIcon(
                daily.weather_code[i]
            );

        const text =
            weatherCodeToText(
                daily.weather_code[i]
            );

        forecast.innerHTML += `

<div class="day">

<div class="day-name">

${dayName}

</div>

<img src="${icon}">

<div class="temp">

${Math.round(daily.temperature_2m_max[i])}°

</div>

<div>

${Math.round(daily.temperature_2m_min[i])}°

</div>

<div class="desc">

${text}

</div>

</div>

`;

    }

}

/*=====================================
 ذخیره شهر انتخاب شده
======================================*/

citySelect.addEventListener("change",()=>{

    localStorage.setItem(

        "city",

        citySelect.value

    );

});

/*=====================================
 بازیابی شهر
======================================*/

const lastCity =
localStorage.getItem("city");

if(lastCity){

    citySelect.value =
    lastCity;

}

/*=====================================
 پایان فایل
======================================*/
function showSun(data){

    const rise =
        data.daily.sunrise[0];

    const set =
        data.daily.sunset[0];

    sunrise.textContent =
        rise.substring(11,16);

    sunset.textContent =
        set.substring(11,16);

    const riseTime =
        new Date(rise);

    const setTime =
        new Date(set);

    const hours =
        Math.floor((setTime-riseTime)/3600000);

    const minutes =
        Math.floor(((setTime-riseTime)%3600000)/60000);

    dayLength.textContent =
        `${hours} ساعت ${minutes} دقیقه`;

}