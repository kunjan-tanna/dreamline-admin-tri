import firebase from 'firebase/app'
//   import * as firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/auth'
  import 'firebase/storage'
  import 'firebase/analytics'
  import 'firebase/functions'

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCozCFtIQAqw1Eidy8lsnD8MDUyOPZCUi4",
    authDomain: "dreamline-2c92b.firebaseapp.com",
    databaseURL: "dreamline-2c92b.firebaseio.com",
    projectId: "dreamline-2c92b",
    storageBucket: "dreamline-2c92b.appspot.com",
    messagingSenderId: "97524186646",
    appId: "1:97524186646:web:a75140815e0c633df27f37",
    measurementId: "G-GBYZJ1DY4J"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  console.log(firebase.app().name);
  firebase.analytics()

  export default firebase