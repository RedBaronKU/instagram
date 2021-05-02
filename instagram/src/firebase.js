import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDh2J3MNp_-CE4fPRoGDTCU3h8jVNT71To",
  authDomain: "instagram-ffe36.firebaseapp.com",
  projectId: "instagram-ffe36",
  storageBucket: "instagram-ffe36.appspot.com",
  messagingSenderId: "71633411823",
  appId: "1:71633411823:web:565fe6488028c151ad851a",
  measurementId: "G-TZEW0GSEKB"
};


firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
const auth=firebase.auth();
const storage=firebase.storage();

export {db,auth,storage};

