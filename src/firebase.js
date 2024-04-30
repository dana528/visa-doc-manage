import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; // Import storage module


const firebaseConfig = {
  apiKey: "AIzaSyCkCgguvSm6qQhzOpP3hbyVGBtjc6MSsDE",
  authDomain: "visa-docs-manage.firebaseapp.com",
  projectId: "visa-docs-manage",
  storageBucket: "visa-docs-manage.appspot.com",
  messagingSenderId: "308111204463",
  appId: "1:308111204463:web:1574df7ab4751e8aa06d9a"
};
  

const app = firebase.initializeApp(firebaseConfig)

// Initialize Firestore and Storage
const db = app.firestore();
const storage = app.storage();

// Export Firestore and Storage
export { db, storage };