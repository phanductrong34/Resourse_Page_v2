import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyATq-wWOQ2328-4hYWJ-Maaa6wGlKJxHPE",
    authDomain: "umaster-resourse-page.firebaseapp.com",
    projectId: "umaster-resourse-page",
    storageBucket: "umaster-resourse-page.appspot.com",
    messagingSenderId: "345090573259",
    appId: "1:345090573259:web:54b0d139566d2284d7ec4e"
}

//init firebase
firebase.initializeApp(firebaseConfig)

//init firestore service
const projectAuth = firebase.auth();
const projectFirestore = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export {projectAuth,projectFirestore,timestamp}