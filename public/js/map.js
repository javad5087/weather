const weatherMarkers = [];
const map=L.map("map").setView([35.55,46.99],8);

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
maxZoom:18,
attribution:"© OpenStreetMap"
}
).addTo(map);
// ==============================
// شهرهای استان کردستان
// ==============================

const kurdistanCities = [

    {
        name:"سنندج",
        lat:35.314,
        lon:46.992,
        value:"35.314,46.992"
    },

    {
        name:"سقز",
        lat:36.246,
        lon:46.273,
        value:"36.246,46.273"
    },

    {
        name:"بانه",
        lat:35.998,
        lon:45.885,
        value:"35.998,45.885"
    },

    {
        name:"مریوان",
        lat:35.526,
        lon:46.176,
        value:"35.526,46.176"
    },

    {
        name:"قروه",
        lat:35.167,
        lon:47.803,
        value:"35.167,47.803"
    },

    {
        name:"بیجار",
        lat:35.866,
        lon:47.604,
        value:"35.866,47.604"
    },

    {
        name:"کامیاران",
        lat:34.795,
        lon:46.936,
        value:"34.795,46.936"
    },

    {
        name:"دیواندره",
        lat:35.914,
        lon:47.026,
        value:"35.914,47.026"
    }

];


// ==============================
// ایجاد علامت روی نقشه
// ==============================

kurdistanCities.forEach(city=>{


    const marker =
    L.marker([
        city.lat,
        city.lon
    ])
    .addTo(map);


    marker.bindPopup(`

        <b>${city.name}</b>
        <br>

        <button
        onclick="selectCity('${city.value}')">

        نمایش هوا

        </button>

    `);


});


// ==============================
// انتخاب شهر از روی نقشه
// ==============================

function selectCity(value){


    citySelect.value = value;


    loadWeather();


}
// ==============================
// دریافت دمای شهرها روی نقشه
// ==============================

async function loadMapTemperatures(){


    for(const city of kurdistanCities){


        try{


            const url =
            `${API}?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code&timezone=auto`;


            const response =
            await fetch(url);


            const data =
            await response.json();


            const temp =
            Math.round(
                data.current.temperature_2m
            );


            city.temp=temp;


            createWeatherMarker(
                city,
                temp,
                data.current.weather_code
            );


        }

        catch(error){

            console.log(
                "خطا در دریافت دما",
                city.name
            );

        }


    }

}


// ==============================
// بروزرسانی Popup شهر
// ==============================

function updateCityMarker(city,temp){


    city.marker.bindPopup(`

        <div>

        <b>${city.name}</b>

        <br>

        🌡️ ${temp}°

        <br><br>

        <button
        onclick="selectCity('${city.value}')">

        نمایش هوا

        </button>

        </div>

    `);


}
// ==============================
// نمایش دمای شهر روی نقشه
// ==============================

function createWeatherMarker(city,temp,code){


    const icon =
    L.divIcon({

        className:"weather-marker",

        html:`

        <div class="marker-box">

        ${getWeatherEmoji(code)}

        <strong>
        ${temp}°
        </strong>

        <br>

        <span>
        ${city.name}
        </span>

        </div>

        `,

        iconSize:[80,50]

    });



    const marker =
    L.marker(
        [city.lat,city.lon],
        {
            icon:icon
        }
    )
    .addTo(map);


    marker.bindPopup(`

        <b>${city.name}</b>

        <br>

        🌡️ ${temp} درجه

        <br>

        ${weatherCodeToText(code)}

    `);


    weatherMarkers.push(marker);

}
function getWeatherEmoji(code){


    if(code===0)
        return "☀️";


    if(code>=1 && code<=3)
        return "⛅";


    if(code>=45 && code<=48)
        return "🌫️";


    if(code>=51 && code<=67)
        return "🌧️";


    if(code>=71 && code<=86)
        return "❄️";


    if(code>=95)
        return "⛈️";


    return "🌤️";

}