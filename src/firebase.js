// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBJyTh69yHaxG56Rw3y6mnHpu-JXimAEfY",
    authDomain: "employeemgmt-c0589.firebaseapp.com",
    projectId: "employeemgmt-c0589",
    storageBucket: "employeemgmt-c0589.appspot.com",
    messagingSenderId: "995287002916",
    appId: "1:995287002916:web:e1ecb9dc024af4ab3d8db1",
    measurementId: "G-YSVERTBGF6"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

