// firebaseClient.ts

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDa4IOboYaj3w3GfkQZgmYs9hnPQhDSjWA",
  authDomain: " ",
  projectId: "databtc-3e2e6",
  storageBucket: "databtc-3e2e6.appspot.com",
  messagingSenderId: "478858949221",
  appId: "1:478858949221:web:e0bc34dc37095b4c2f0c8c",
  measurementId: "G-C7TD1EXEFH"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { auth, db, storage };