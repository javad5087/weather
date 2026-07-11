const CACHE="kurdistan-weather-v1";

const FILES=[
"/",
"/css/style.css",
"/js/app.js",
"/manifest.json"
];

self.addEventListener("install",event=>{

event.waitUntil(

caches.open(CACHE)

.then(cache=>cache.addAll(FILES))

);

});

self.addEventListener("fetch",event=>{

event.respondWith(

caches.match(event.request)

.then(response=>{

return response||fetch(event.request);

})

);

});