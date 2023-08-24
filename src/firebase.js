// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3bV5sobMGRLmoe1cyjzTmZWe74bJE4T0",
  authDomain: "chatapp-8c120.firebaseapp.com",
  projectId: "chatapp-8c120",
  storageBucket: "chatapp-8c120.appspot.com",
  messagingSenderId: "835502071052",
  appId: "1:835502071052:web:e4b3f878b00308d45c7d29",
  measurementId: "G-2LL9DS2344"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestPermission = () => {
  Notification.requestPermission().then( permission => {
    if(permission === "granted"){
      console.log("permission granted");
      return getToken(messaging, {
        vapidKey: "BGj7VA54IsYMuUcrXIYa5PKNXZXOvVcEWtfdJ3SdUgknVvAxVX2cjT8U7PA6-ZOvoUayawZ8lsbstUg0rk1mY54"
      })
      .then( currentToken => {
        console.log("token = " + currentToken);
        if(currentToken){
          fetch("https://chatappserver1.onrender.com/users/update_token", {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              phone_number: localStorage.getItem('myPhoneNumber'),
              token: currentToken,
            })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              console.log("token save success")
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }
        else{
          console.log("error getting token")
        }
      })
    }
  })
};

