import firebase from "firebase/app";
import "firebase/messaging";
import store from "@/store";
import browser from "@/helpers/browser-detect";
import * as Sentry from "@sentry/browser";
import Configuration from "@/helpers/configuration";

const firebaseConfig = {
  projectId: Configuration.value("VUE_APP_FIREBASE_PROJECT_ID"),
  appId: Configuration.value("VUE_APP_FIREBASE_APP_ID"),
  databaseURL: Configuration.value("VUE_APP_FIREBASE_DATABASE_URL"),
  storageBucket: Configuration.value("VUE_APP_FIREBASE_STORAGE_BUCKET"),
  apiKey: Configuration.value("VUE_APP_FIREBASE_API_KEY"),
  authDomain: Configuration.value("VUE_APP_FIREBASE_AUTH_DOMAIN"),
  messagingSenderId: Configuration.value(
    "VUE_APP_FIREBASE_MESSAGING_SENDER_ID"
  ),
  measurementId: Configuration.value("VUE_APP_FIREBASE_MEASUREMENT_ID"),
};

let messaging;

if (firebaseConfig && !browser.isSafari) {
  firebase.initializeApp(firebaseConfig);
  messaging = firebase.messaging();
}

// eslint-disable-next-line no-unused-vars
function getMessagingObject() {
  // [START messaging_get_messaging_object]
  // [END messaging_get_messaging_object]
}

let receiveMessage = function receiveMessage() {
  // [START messaging_receive_message]
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.onBackgroundMessage` handler.
  return messaging.onMessage((payload) => {
    console.log("Message received. ", payload);
    // ...
    return payload;
  });
  // [END messaging_receive_message]
};

let getToken = function getToken() {
  // [START messaging_get_token]
  // Get registration token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.
  messaging
    .getToken({
      vapidKey: Configuration.value("VUE_APP_FIREBASE_VAPID_KEY"),
    })
    .then((currentToken) => {
      if (currentToken) {
        console.log("FCM token: ", currentToken);
        store.commit("notify/SET_FCM_TOKEN", currentToken);
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
        // ...
      }
    })
    .catch((err) => {
      Sentry.captureException(err);
      console.log("An error occurred while retrieving token. ", err);
      // ...
    });
  // [END messaging_get_token]
};

// eslint-disable-next-line no-unused-vars
function requestPermission() {
  // [START messaging_request_permission]
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      // TODO(developer): Retrieve a registration token for use with FCM.
      // ...
    } else {
      console.log("Unable to get permission to notify.");
    }
  });
  // [END messaging_request_permission]
}

// eslint-disable-next-line no-unused-vars
function deleteToken() {
  // [START messaging_delete_token]
  messaging
    .deleteToken()
    .then(() => {
      console.log("Token deleted.");
      // ...
    })
    .catch((err) => {
      Sentry.captureException(err);
      console.log("Unable to delete token. ", err);
    });
  // [END messaging_delete_token]
}

if (!browser.isSafari) {
  getToken();
  receiveMessage();
}

export default {
  getToken: getToken,
  receiveMessage: receiveMessage,
};
