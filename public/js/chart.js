let tempChart;


// ==============================
// دریافت پیش‌بینی ساعتی
// ==============================

async function loadHourlyChart(){


    const city=currentCity();


    const url =
    `${API}?latitude=${city.lat}&longitude=${city.lon}&hourly=temperature_2m&forecast_days=2&timezone=auto`;


    try{


        const response =
        await fetch(url);


        const data =
        await response.json();


        drawTemperatureChart(
            data.hourly
        );


    }

    catch(error){

        console.log(
        "خطای نمودار",
        error
        );

    }


}


// ==============================
// رسم نمودار
// ==============================

function drawTemperatureChart(hourly){


    const ctx =
    document
    .getElementById(
        "temperatureChart"
    );


    if(tempChart){

        tempChart.destroy();

    }



    tempChart =
    new Chart(ctx,{

        type:"line",

        data:{


            labels:
            hourly.time.slice(0,24)
            .map(t=>
                t.substring(11,16)
            ),


            datasets:[{

                label:"دما °C",

                data:
                hourly.temperature_2m
                .slice(0,24),

                tension:.3

            }]


        },


        options:{


            responsive:true,


            plugins:{


                legend:{

                    display:true

                }


            }

        }


    });


}
window.addEventListener(
"load",
loadHourlyChart
);