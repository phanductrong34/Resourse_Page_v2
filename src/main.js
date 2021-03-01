/*
ĐIỀU KHIỂN TOÀN BỘ APP
TẠO VÀ ESTABLISH VUE VÀO APP
*/


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import component;
import Image from '@/components/Base/Image.vue'
import Loading from '@/components/Base/Loading.vue'
import NoData from '@/components/Base/NoData.vue'

const app = createApp(App);

//register gloabal component
app.component('Image', Image);    //props: refUrl
app.component('Loading',Loading); 
app.component('NoData',NoData);  // props: data

app.use(store).use(router).mount('#app')
