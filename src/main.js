/*
ĐIỀU KHIỂN TOÀN BỘ APP
TẠO VÀ ESTABLISH VUE VÀO APP
*/


import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import Vue from 'vue'


const app = createApp(App);
app.use(store).use(router).mount('#app')
