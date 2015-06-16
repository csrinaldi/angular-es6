self.addEventListener('install', function (event) {
    console.log("install");

  /*event.waitUntil(
   fetchStuffAndInitDatabases()
   );*/
});

self.addEventListener('activate', function (event) {
  console.log("activate");
});


self.addEventListener('fetch', function(event) {

  console.log(event);

  //event.respondWith(new Response("Hello world!"));
});




