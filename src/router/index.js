import { createRouter, createWebHistory } from 'vue-router'
import Welcome from '../views/Login/Welcome.vue'
import Admin from '../views/Admin/Admin.vue'
import ClassManage from '../views/Admin/ClassManage.vue'
import Courses from '../views/Admin/Courses.vue'
import Resource from '../views/Admin/Resource.vue'
import Teachers from '../views/Admin/Teachers.vue'

import CreateFile from '../views/Admin/ResourceCollection/CreateFile.vue'
import Folders from '../views/Admin/ResourceCollection/Folders.vue'

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
        path: 'classes',
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
        component: Resource,
        children:[
          {
            path: 'folders/:name',
            name: 'Folders',
            component: Folders
          },
          {
            path: 'createfile',
            name: 'CreateFile',
            component: CreateFile
          }
        ]
      },
      {
        path: 'teachers',
        name: 'Teachers',
        component: Teachers,
        children:[
          {
            path:'create',
            name: 'CreateTeacher',
            component: () => import('../views/Admin/TeachersForm/CreateTeacher.vue')
          },
          {
            path:'update/:id',
            name: 'UpdateTeacher',
            component: () => import('../views/Admin/TeachersForm/UpdateTeacher.vue'),
            props: true
          }
        ]
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
