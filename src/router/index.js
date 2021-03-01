import { createRouter, createWebHistory } from 'vue-router'
import {projectAuth,getCurrentUser} from '@/firebase/config'
import Welcome from '../views/Login/Welcome.vue'
import Admin from '../views/Admin/Admin.vue'
import ClassManage from '../views/Admin/ClassManage.vue'
import Courses from '../views/Admin/Courses.vue'
import Resource from '../views/Admin/Resource.vue'
import Teachers from '../views/Admin/Teachers.vue'

import CreateFile from '../views/Admin/ResourceCollection/CreateFile.vue'
import UpdateFile from '../views/Admin/ResourceCollection/UpdateFile.vue'
import Folders from '../views/Admin/ResourceCollection/Folders.vue'

import Lessons from '../views/Admin/CoursesCollection/Lessons.vue'
import CreateCourse from '../views/Admin/CoursesCollection/CreateCourse.vue'
import CreateLesson from '../views/Admin/CoursesCollection/CreateLesson.vue'
import UpdateCourse from '../views/Admin/CoursesCollection/UpdateCourse.vue'
import UpdateLesson from '../views/Admin/CoursesCollection/UpdateLesson.vue'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome,
    meta: {requiredAuth: false},
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    redirect: '/admin/classes',
    meta: {
      requiredAuth: true //tức là phải có kiểm tra auth mới đc vào
    },
    children:[
      {
        path: 'classes',
        name: 'ClassManage',
        component: ClassManage,
        meta: {requiredAuth: true},
      },
      {
        path: 'courses',
        name: 'Courses',
        component: Courses,
        meta: {requiredAuth: true},
        children:[
          {
            path: 'lessons/:id',
            name: 'Lessons',
            component: Lessons,
            props:true,
            meta: {requiredAuth: true}
          },
          {
            path: 'createcourse',
            name: 'CreateCourse',
            component: CreateCourse,
            meta: {requiredAuth: true}
          },
          {
            path: 'createlesson',
            name: 'CreateLesson',
            component: CreateLesson,
            props:true,
            meta: {requiredAuth: true}
          },
          {
            path: 'updatecourse/:id',
            name: 'UpdateCourse',
            component: UpdateCourse,
            props: true,
            meta: {requiredAuth: true}
          },
          {
            path: 'updatelesson/:id',
            name: 'UpdateLesson',
            component: UpdateLesson,
            props: true,
            meta: {requiredAuth: true}
          },
        ]
      },
      {
        path: 'resource',
        name: 'Resource',
        component: Resource,
        meta: {requiredAuth: true},
        children:[
          {
            path: 'folders/:name',
            name: 'Folders',
            component: Folders,
            props:true,
            meta: {requiredAuth: true}
          },
          {
            path: 'createfile',
            name: 'CreateFile',
            component: CreateFile,
            props: true,
            meta: {requiredAuth: true}
          },
          {
            path: 'updatefile/:id',
            name: 'UpdateFile',
            component: UpdateFile,
            props: true,
            meta: {requiredAuth: true}
          }
        ]
      },
      {
        path: 'teachers',
        name: 'Teachers',
        component: Teachers,
        meta: {requiredAuth: true},
        children:[
          {
            path:'create',
            name: 'CreateTeacher',
            component: () => import('../views/Admin/TeachersForm/CreateTeacher.vue'),
            meta: {requiredAuth: true},
          },
          {
            path:'update/:id',
            name: 'UpdateTeacher',
            component: () => import('../views/Admin/TeachersForm/UpdateTeacher.vue'),
            props: true,
            meta: {requiredAuth: true},
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

// Tất cả các route đều đc gán cái guard này trước khi truy cập vào
router.beforeEach(async(to, from, next) => {
  const requiredAuth = to.matched.some(record => record.meta.requiredAuth);
  if (requiredAuth && !await getCurrentUser()){
    next({name: 'Welcome'});
  }else{
    next();
  }
});

export default router


// component: () => import(/* webpackChunkName: "classManage" */ './views/Resource') thay thế cho import thông thường
// nó là 1 tính năng của webpack cho phép bao h đi tới router đó thì mưới laod chunk(hoặc phần bundle) mà các router đó cần (ở đây là 1 file js đc nén bằng webpack)
// tốc độ đc cải thiẹn
