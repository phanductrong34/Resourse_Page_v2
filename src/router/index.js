import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Login/Welcome.vue'
import Admin from '../views/Admin/Admin.vue'
import ClassManage from '../views/Admin/ClassManage.vue'
import Courses from '../views/Admin/Courses.vue'
import Resource from '../views/Admin/Resource.vue'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    children:[
      {
        path: '',
        name: 'ClassManage',
        component: ClassManage
      },
      {
        path: 'courses',
        name: 'Courses',
        component: Courses
      },
      {
        path: 'resource',
        name: 'Resource',
        component: Resource
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router


// component: () => import(/* webpackChunkName: "classManage" */ './views/Resource') thay thế cho import thông thường
// nó là 1 tính năng của webpack cho phép bao h đi tới router đó thì mưới laod chunk(hoặc phần bundle) mà các router đó cần (ở đây là 1 file js đc nén bằng webpack)
// tốc độ đc cải thiẹn
