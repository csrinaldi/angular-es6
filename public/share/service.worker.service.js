/**
 * Created by scit on 12/06/15.
 */
export default (function () {

  class ServiceWorkerService {

    constructor($window) {
      this.navigator = $window.navigator;
      this.serviceRegistrations = undefined;
    }

    initPushNotification() {
      let vm = this;
      // Check if push messaging is supported
      if (!('PushManager' in window)) {
        console.log('Ooops Push Isn\'t Supported',
          'If this isn\'t an expected error please get in touch with ' +
          '<a href="https://twitter.com/gauntface">@gauntface</a> as the ' +
          'demo is probably broken.');
        return;
      }

      // Is the Permissions API supported
      if ('permissions' in navigator) {
        vm.navigator.permissions.query({name: 'push', userVisibleOnly: true})
          .then(function (permissionStatus) {
            console.log(permissionStatus);

            if (vm.serviceRegistration !== undefined) {
              vm.serviceRegistration.pushManager.getSubscription()
                .then(function (subscription) {
                  if (!subscription) {
                    // NOOP
                    console.log('No subscription given');
                    return;
                  }

                  // Set the initial state of the push switch
                  //window.PushDemo.ui.setPushChecked(true);

                  // Update the current state with the
                  // subscriptionid and endpoint
                  //onPushSubscription(subscription);
                })
                .catch(function (e) {
                  console.log('An error occured while calling getSubscription()', e);
                });
            }
          });
        return;
      } else {
        return;
      }
    }

    waitUntilInstalled(registration) {
      return new Promise(function(resolve, reject) {
        if (registration.installing) {
          // If the current registration represents the "installing" service worker, then wait
          // until the installation step (during which the resources are pre-fetched) completes
          // to display the file list.
          registration.installing.addEventListener('statechange', function(e) {
            if (e.target.state == 'installed') {
              console.log(registration);
              console.log('ServiceWorker registration successful with scope: ', registration.scope);
              resolve();
            } else if(e.target.state == 'redundant') {
              reject();
            }
          });
        } else {
          // Otherwise, if this isn't the "installing" service worker, then installation must have been
          // completed during a previous visit to this page, and the resources are already pre-fetched.
          // So we can show the list of files right away.
          resolve();
        }
      });
    }


    activate() {
      let vm = this;
      if ('serviceWorker' in vm.navigator) {
        vm.navigator.serviceWorker.register("public/share/service.worker.js", {scope: 'public/share/'})
          .then(vm.waitUntilInstalled)
          .catch(function (err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        });
      }
    }
  }
  return ServiceWorkerService;
})();
