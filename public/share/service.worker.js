importScripts('../../jspm_packages/github/coonsta/cache-polyfill@master/index.js');


/**
 * Created by scit on 12/06/15.
 */

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/public/assets/main.css'
];


self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );


  /*event.waitUntil(
   fetchStuffAndInitDatabases()
   );*/
});

self.addEventListener('fetch', function(event) {

  console.log('fetch   ');
  console.log(event.request);

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        console.log("Retornando desde el cache ");
        console.lof(response);
        if (response) {
          return response;
        }

        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function (event) {
  console.log("activate----1");
  console.log(event);
  console.log("activate----1");
});

self.addEventListener('push', function (event) {
  console.log('Received a push message', event);

  var title = 'Yay a message.';
  var body = 'We have received a push message.';
  var icon = '/images/icon-192x192.png';
  var tag = 'simple-push-demo-notification-tag';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );
});



