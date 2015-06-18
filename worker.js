self.addEventListener('install', function (event) {
  console.log(event);
});

self.addEventListener('activate', function (event) {
  console.log("activate");
});


self.addEventListener('fetch', function (event) {
  console.log(event);
});

self.addEventListener('message', function (event) {
  if (event.data.name === "RegisterEventSource") {

    var source = new EventSource('http://localhost:3000/stats');
    source.onopen = function (e) {
      console.log("Open channel Sussess");
      console.log(source);
    };

    source.onerror = function (e) {
      console.log(e);
    };

    source.onmessage = function (e) {

        self.registration.showNotification("Notificacion", {
          body: "Esta es una Prueba",
          icon: "/public/assets/img/icons/menu.svg",
          tag: "process-tag",
          data : {
            process: {
              status: 'OK'
            }
          }
        });

      self.clients.matchAll().then(function(d) {
        if ( d.length === 0 ){
          console.log("Cliente conectados 0")
        }else{
          console.log(d);
        }
      });

      /*if (event.data !== undefined) {
        console.log(e.data);
        var data = JSON.parse(e.data);
        if (data.uuid !== undefined) {
          console.log("Haciendo broadcast");
          event.ports[ 0 ].postMessage({
            data: "Respuesta a " + e.data
          });
        }
      }*/
    };
  }

  console.log('Handling message event:', event.data);
  event.ports[ 0 ].postMessage({
    data: "Respuesta a " + event.data
  });
});




