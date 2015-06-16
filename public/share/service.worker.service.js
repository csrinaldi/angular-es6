/**
 * Created by scit on 12/06/15.
 */
export default (function () {


  /**
   * TODO cambiar el rootScope por algun evento que se dispare
   */
  class ServiceWorkerService {

    constructor($window,$rootScope,$http) {
      this.navigator = $window.navigator;
      this.$rootScope = $rootScope;
      this.$http = $http;
    }

    subscribe() {
      console.log("ServiceWorkerService.subscribe");
      let vm = this;
      vm.navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
          .then(function(subscription) {

            // TODO: Send the subscription subscription.endpoint
            // to your server and save it to send a push message
            // at a later date
            console.log(subscription);

            return vm.$http(
              {
                url: 'http://localhost/rest/app_dev.php/notification',
                method: "POST",
                data : {
                  subscription : subscription
                },
                withCredentials: true,
                headers: {
                  'scit-token': 'a833f5cac52c2cc5401ff2f73dd7203143e2f65b',
                  'Content-Type': 'application/json; charset=utf-8'
                }
              }
            );


            return true; //sendSubscriptionToServer(subscription);
          })
          .catch(function(e) {
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

    initialiseState(){
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

        function(serviceWorkerRegistration) {
        // Do we already have a push message subscription?
        serviceWorkerRegistration.pushManager.getSubscription()
          .then(function(subscription) {

            console.log(subscription);


            if (!subscription) {
              // We aren't subscribed to push, so set UI
              // to allow the user to enable push
              return;
            }


            console.log(subscription);

            vm.$rootScope.notifications = true;

            // Enable any UI which subscribes / unsubscribes from
            // push messages.

            /*var pushButton = document.querySelector('.js-push-button');
            pushButton.disabled = false;

            if (!subscription) {
              // We aren't subscribed to push, so set UI
              // to allow the user to enable push
              return;
            }

            // Keep your server in sync with the latest subscriptionId
            sendSubscriptionToServer(subscription);

            // Set your UI to show they have subscribed for
            // push messages
            pushButton.textContent = 'Disable Push Messages';
            isPushEnabled = true;*/


            console.log(subscription);

          })
          .catch(function(err) {
            console.warn('Error during getSubscription()', err);
          });
      });

    }

    activate(){
      let vm = this;
      if ('serviceWorker' in vm.navigator) {
        vm.navigator.serviceWorker.register('/worker.js', {scope : '/'}).then(function (registration) {
          // Registration was successful
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
