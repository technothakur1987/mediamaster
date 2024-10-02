// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore"; 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMP7bjHcVzsuQBsBOXM_Q-CiTpPyTPSrs",
  authDomain: "mediamaster-7a52a.firebaseapp.com",
  projectId: "mediamaster-7a52a",
  storageBucket: "mediamaster-7a52a.appspot.com",
  messagingSenderId: "231821336951",
  appId: "1:231821336951:web:0f63ef625a2bad53f3c172"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const storage = getStorage(app);
const db = getFirestore(app);

export {auth,app,storage,db}