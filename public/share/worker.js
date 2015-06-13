/**
 * Created by scit on 12/06/15.
 */


function WorkerInstance() {
  self.addEventListener('install', function (event) {
    console.log("install-----");
    console.log(event);
    console.log("install-----");

    /*event.waitUntil(
     fetchStuffAndInitDatabases()
     );*/
  });

  self.addEventListener('activate', function (event) {
    console.log("activate-----");
    console.log(event);
    console.log("activate-----");
  });
}



