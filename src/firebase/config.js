import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

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

//hàm này trả ra mỘt promise mà sẽ trả ra user ngay khi khi resolve
firebase.getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    })
};

const getCurrentUser = firebase.getCurrentUser;
//init firestore service
const projectAuth = firebase.auth();
const projectFirestore = firebase.firestore();
const projectStorage = firebase.storage()
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export {projectAuth,projectFirestore,projectStorage,timestamp,getCurrentUser}