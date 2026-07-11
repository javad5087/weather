// ==============================
// موقعیت کاربر GPS
// ==============================

function getUserLocation(){


    if(!navigator.geolocation){

        alert(
        "مرورگر شما از موقعیت مکانی پشتیبانی نمی‌کند"
        );

        return;

    }


    navigator.geolocation.getCurrentPosition(

        position=>{


            const lat =
            position.coords.latitude;


            const lon =
            position.coords.longitude;


            showUserPosition(
                lat,
                lon
            );


            findNearestCity(
                lat,
                lon
            );


        },


        error=>{


            console.log(
            "دسترسی مکان رد شد",
            error
            );


        },


        {
            enableHighAccuracy:true,
            timeout:10000
        }

    );

}


// ==============================
// نمایش مکان کاربر روی نقشه
// ==============================

function showUserPosition(lat,lon){


    L.marker(
        [lat,lon]
    )
    .addTo(map)
    .bindPopup(
        "📍 موقعیت فعلی شما"
    )
    .openPopup();


    map.setView(
        [lat,lon],
        10
    );

}


// ==============================
// پیدا کردن نزدیک‌ترین شهر
// ==============================

function findNearestCity(lat,lon){


    let nearest=null;

    let distance=Infinity;


    kurdistanCities.forEach(city=>{


        const d =
        Math.sqrt(

            Math.pow(
            lat-city.lat,
            2
            )

            +

            Math.pow(
            lon-city.lon,
            2
            )

        );


        if(d < distance){

            distance=d;

            nearest=city;

        }


    });


    if(nearest){


        citySelect.value =
        nearest.value;


        loadWeather();


    }


}


// اجرای خودکار

window.addEventListener(
"load",
()=>{

    getUserLocation();

});
document
.getElementById("locationBtn")
.addEventListener(
"click",
getUserLocation
);