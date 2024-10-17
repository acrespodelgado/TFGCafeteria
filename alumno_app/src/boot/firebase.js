// https://firebase.google.com/docs/web/setup#available-libraries

import { boot } from 'quasar/wrappers'
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClHRYDx7r-cdCwRpn9IZe0w6Wr-c1UGvI",
  authDomain: "app-cafeteria-9ab95.firebaseapp.com",
  projectId: "app-cafeteria-9ab95",
  storageBucket: "app-cafeteria-9ab95.appspot.com",
  messagingSenderId: "1027686836199",
  appId: "1:1027686836199:web:b9b9194a7d9cab6a38bf42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const db = getFirestore(app);

const currentUser = app.getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = app.auth().onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  })
};

export default boot(async (/* { app, router, ... } */) => {
  //app.config.globalProperties.$app = app;
})

export { app, firebaseAuth, db, currentUser };