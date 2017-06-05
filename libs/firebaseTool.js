import firebase from 'firebase';
import config from '../config.js';

/* Init Firebase Config */
const firebaseConfig = {
  apiKey: config.firebase_app_key,
  authDomain: "youtuber-spy.firebaseapp.com",
  databaseURL: "https://youtuber-spy.firebaseio.com",
  storageBucket: "youtuber-spy.appspot.com",
};

/* Cuz it's for both server and client, maybe it's already been created */
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const getDatabaseConnection = () => {
  return firebase.database();
};

export const closeConnectionAfterSecs = (database, secs) => {
  setTimeout(function () {
    database.goOffline();
  }, secs * 1000);
};
