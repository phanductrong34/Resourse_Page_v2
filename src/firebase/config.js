import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'

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
// kết hợp với route gaurd ở bên kia để mỗi lần nhảy trang ta lại check lại sự tồn tại cùa user
// kết hợp với trường check isAdmin ở meta của các route, ta sẽ check thêm token của admin tại đây mỗi khi nhảy router mới
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
const projectFunctions = firebase.functions();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const FieldValue = firebase.firestore.FieldValue;

export {projectAuth,projectFirestore,projectStorage,projectFunctions, timestamp,getCurrentUser,FieldValue}

