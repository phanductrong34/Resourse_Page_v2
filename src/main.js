/*
ĐIỀU KHIỂN TOÀN BỘ APP
TẠO VÀ ESTABLISH VUE VÀO APP
*/


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {store} from './store/index'
import {projectAuth} from './firebase/config'
import {sync} from 'vuex-router-sync'

// import component;
import Image from '@/components/Base/Image.vue'
import Loading from '@/components/Base/Loading.vue'
import NoData from '@/components/Base/NoData.vue'

//import Toast
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import '@/styles/global.scss';


//option for toast
const option = {
    transition: "Vue-Toastification__fade",
    maxToasts: 5,
    newestOnTop: true,
    position: "top-center",
    timeout: 1000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 1.36,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false,
}


let app
sync(store, router, {moduleName: 'route'});
//Chạy lần đầu và mỗi lần user thay đổi thi lại chạy lại
projectAuth.onAuthStateChanged(async(_user) => {
    if(!app){   //chỉ chạy một lần
        app = createApp(App);
        //register gloabal component
        app.component('Image', Image);    //props: refUrl
        app.component('Loading',Loading); 
        app.component('NoData',NoData);  // props: data
        // app.component('star-rating', VueStarRating.default)
        
        app
        .use(store)
        .use(router)
        .use(Toast,option)
        .mount('#app')
    }

    if(_user){
        // lấy id token và check admin
        let isAdmin = false;
        let isTeacher = false;
        const idTokenResult = await _user.getIdTokenResult()
        if(idTokenResult.claims.admin){
            isAdmin = true;
        }else if(idTokenResult.claims.teacher){
            isTeacher = true;
        }
        //update lên store dữ liệu của ngườ dùng đang có
        store.dispatch('user/updateUserData',{
            user: _user,
            isAdmin: isAdmin,
            isTeacher:isTeacher
        });
    }else{
        store.dispatch('user/resetUser');
    }
})


//những thằng có namespace true tức là ở ngoài mà dfng store thì để lấy các state, mutation,actions thì phải trỏ đúng địa chỉ
/* ví dụng có user là 1 modules đc register
Lấy STATE:  store.state.user.isAdmin ===> lấy trường isAdmin  // nhưng mình ko lấy trức tiếp mà nên qua getters
Lấy GETTERS: store.getters['user/getIsAdmin"]
Lấy ACTION:  store.dispatch('user/updateUserData', {isAdmin:true, user:user} })  //nhét parameter vào object và destructure ra ở bên này



*/