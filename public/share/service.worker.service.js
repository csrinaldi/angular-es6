
export default (function () {


  /**
   * TODO cambiar el rootScope por algun evento que se dispare
   */
  class ServiceWorkerService {

    constructor($window, $rootScope, $http) {
      this.navigator = $window.navigator;
      this.$rootScope = $rootScope;
      this.$http = $http;
      this.registration = null;
      this.controller = null;
    }

    sendMessage(message) {
      let vm = this;
      // This wraps the message posting/response in a promise, which will resolve if the response doesn't
      // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
      // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
      // a convenient wrapper.
      return new Promise(function (resolve, reject) {
        if (vm.controller === null) {
          reject("Registration is Null");
        } else {
          var messageChannel = new MessageChannel();
          messageChannel.port1.onmessage = function (event) {
            if (event.data.error) {
              console.log("Error");
              console.log(event);
              reject(event.data.error);
            } else {
              console.log("Resolviendo ....");
              console.log(event);
              resolve(event.data);
            }
          };

          // This sends the message data as well as transferring messageChannel.port2 to the service worker.
          // The service worker can then use the transferred port to reply via postMessage(), which
          // will in turn trigger the onmessage handler on messageChannel.port1.
          // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
          console.log("Enviando .......");
          console.log( vm.controller);
          console.log("Enviando .......");

          vm.controller.postMessage(message, [ messageChannel.port2 ]);
        }
      });
    }

    subscribe() {
      console.log("ServiceWorkerService.subscribe");
      let vm = this;
      vm.navigator.serviceWorker.ready.then(
        function (serviceWorkerRegistration) {

          serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
            .then(function (subscription) {

              // TODO: Send the subscription subscription.endpoint
              // to your server and save it to send a push message
              // at a later date
              console.log("------------------------------------------------------------------------------------------");

              return vm.$http(
                {
                  url: 'http://localhost:3000/api/notifications',
                  //url: 'http://localhost/rest/app_dev.php/notificaciones',
                  method: "POST",
                  data: {
                    subscription: subscription
                  },
                  withCredentials: false,
                  headers: {
                    'scit-token': 'a833f5cac52c2cc5401ff2f73dd7203143e2f65b'
                  }
                }
              ).success(function () {
                  console.log("Notification add to server")
                }
              ).error(function (err) {
                  console.log("Notification error");
                  console.log(err);
                }
              );


              return true; //sendSubscriptionToServer(subscription);
            })
            .catch(function (e) {
              console.log(e);
              if (Notification.permission === 'denied') {
                // The user denied the notification permission which
                // means we failed to subscribe and the user will need
                // to manually change the notification permission to
                // subscribe to push messages
                //window.Demo.debug.log('Permission for Notifications was denied');
                //pushButton.disabled = true;
              } else {
                // A problem occurred with the subscription, this can
                // often be down to an issue or lack of the gcm_sender_id
                // and / or gcm_user_visible_only
                //window.Demo.debug.log('Unable to subscribe to push.', e);
                //pushButton.disabled = false;
                //pushButton.textContent = 'Enable Push Messages';
              }
            });
        });
    }

    initialiseState() {
      let vm = this;

      if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        console.warn('Notifications aren\'t supported.');
        return;
      }

      if (Notification.permission === 'denied') {
        console.warn('The user has blocked notifications.');
        return;
      }

      if (!('PushManager' in window)) {
        console.warn('Push messaging isn\'t supported.');
        return;
      }

      vm.navigator.serviceWorker.ready.then(
        function (serviceWorkerRegistration) {
          // Do we already have a push message subscription?
          serviceWorkerRegistration.pushManager.getSubscription()
            .then(function (subscription) {
              console.log(subscription);
              if (!subscription) {
                // We aren't subscribed to push, so set UI
                // to allow the user to enable push
                return;
              }
              console.log(subscription);
              vm.$rootScope.notifications = true;
              console.log(subscription);
            })
            .catch(function (err) {
              console.warn('Error during getSubscription()', err);
            });
        });

    }

    activate() {
      let vm = this;
      if ('serviceWorker' in vm.navigator) {
        vm.navigator.serviceWorker.register('/worker.js', {scope: '/'}).then(function (registration) {
          // Registration was successful
          vm.registration = registration;
          vm.controller = vm.registration.active;
          vm.initialiseState();
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        });
      }
    }
  }
  return ServiceWorkerService;
})();
