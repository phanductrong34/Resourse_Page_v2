import { createRouter, createWebHistory } from 'vue-router'
import {projectAuth,getCurrentUser} from '@/firebase/config'
import {store} from '../store/index'

// import Welcome from '../views/Login/Welcome.vue'
// import Admin from '../views/Admin/Admin.vue'
// import ClassManage from '../views/Admin/ClassManage.vue'
// import Courses from '../views/Admin/Courses.vue'
// import Resource from '../views/Admin/Resource.vue'
// import Teachers from '../views/Admin/Teachers.vue'

// import CreateFile from '../views/Admin/ResourceCollection/CreateFile.vue'
// import UpdateFile from '../views/Admin/ResourceCollection/UpdateFile.vue'
// import Folders from '../views/Admin/ResourceCollection/Folders.vue'

// import Lessons from '../views/Admin/CoursesCollection/Lessons.vue'
// import CreateCourse from '../views/Admin/CoursesCollection/CreateCourse.vue'
// import CreateLesson from '../views/Admin/CoursesCollection/CreateLesson.vue'
// import UpdateCourse from '../views/Admin/CoursesCollection/UpdateCourse.vue'
// import UpdateLesson from '../views/Admin/CoursesCollection/UpdateLesson.vue'
// import ResourceUser from '../views/User/ResourceUser.vue'
// import FoldersUser from '../views/User/ResourceUserCollection/FoldersUser.vue'

// import NotFound from '../views/NotFound/NotFound.vue'

//Student
import User from '../views/User/User.vue'
import Laboratory from '../views/User/Laboratory.vue'
import Dashboard from '../views/User/Dashboard.vue'
import Slide from '../views/User/LaboCollection/Slide.vue'
import LessonUser from '../views/User/DashboardCollection/LessonUser.vue'
import Classroom from '../views/User/Classroom.vue'



// GUARD: protect welcome screen---- Cái này phải viết trên biến router
const requiredNoAuth = (to, from,next)=>{

  const user = projectAuth.currentUser
  const isAdmin = store.getters['user/getIsAdmin']
 // console.log("isAdmin",isAdmin);
  
  if(user && isAdmin){
    next({name: 'ClassManage'});
  }else if(user && !isAdmin){
    next({name: 'User'})
  }else{
    next();  // cho next tới Welcome
  }
}


const requiredLoadLesson = (to,from,next) => {
  const haveID = store.getters['lessons/getLatestUnlockID'];
  if(!from.name){
    next({name:'Dashboard'});
  }else if(from.name && haveID){
    next()
  }
}

const requiredNewUser = (to,from,next)=>{
  const isAdmin = store.getters['user/getIsAdmin'];
  if(isAdmin){ // là admin
    next({name: 'ClassManage'});
  }else{  // là student
    const check = store.getters['user/getUserData'];
   // console.log("🚀 ~ file: index.js ~ line 65 ~ check", check)
    if(from.name =='Welcome' && check){
      next()
    }else{
      next({bame: from.name});
    }
  }
}


const requiredAdmin =(to,from,next) =>{
  const isAdmin = store.getters['user/getIsAdmin'];
  if(isAdmin) next();
  else next({name: from.name});
}
const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: ()=>import('../views/Login/Welcome.vue'),
    meta: {requiredAuth: false},
    beforeEnter: requiredNoAuth
  },
  {
    path:'/updateInfo',
    name: "NewUser",
    component: ()=> import('../views/Login/NewUser.vue'),
    meta: {requiredAuth : true},
    beforeEnter: requiredNewUser,
  },
  {
    path:'/:catchAll(.*)',
    name: 'NotFound',
    component: ()=> import('../views/NotFound/NotFound.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: ()=>import('../views/Admin/Admin.vue'),
    redirect: '/admin/classes',
    beforeEnter: requiredAdmin,
    meta: {
      requiredAuth: true //tức là phải có kiểm tra auth mới đc vào
    },
    children:[
      {
        path: 'classes',
        name: 'ClassManage',
        component:() => import('../views/Admin/ClassManage.vue'),
        meta: {requiredAuth: true},
        beforeEnter: requiredAdmin,
      },
      {
        path: 'courses',
        name: 'Courses',
        component: () => import('../views/Admin/Courses.vue'),
        meta: {requiredAuth: true},
        beforeEnter: requiredAdmin,
        children:[
          {
            path: 'lessons/:id',
            name: 'Lessons',
            component: () => import('../views/Admin/CoursesCollection/Lessons.vue'),
            props:true,
            meta: {requiredAuth: true},
            beforeEnter: requiredAdmin,
          },
          {
            path: 'createcourse',
            name: 'CreateCourse',
            component: () => import('../views/Admin/CoursesCollection/CreateCourse.vue'),
            meta: {requiredAuth: true},
            beforeEnter: requiredAdmin
          },
          {
            path: 'createlesson',
            name: 'CreateLesson',
            component: () => import('../views/Admin/CoursesCollection/CreateLesson.vue'),
            props:true,
            meta: {requiredAuth: true},
            beforeEnter: requiredAdmin
          },
          {
            path: 'updatecourse/:id',
            name: 'UpdateCourse',
            component: () => import('../views/Admin/CoursesCollection/UpdateCourse.vue'),
            props: true,
            meta: {requiredAuth: true},
            beforeEnter: requiredAdmin
          },
          {
            path: 'updatelesson/:id',
            name: 'UpdateLesson',
            component: () => import('../views/Admin/CoursesCollection/UpdateLesson.vue'),
            props: true,
            meta: {requiredAuth: true},
            beforeEnter: requiredAdmin
          },
        ]
      },
      {
        path: 'resource',
        name: 'Resource',
        component:()=>import('../views/Admin/Resource.vue'),
        meta: {requiredAuth: true},
        beforeEnter: requiredAdmin,
        children:[
          {
            path: 'folders/:name',
            name: 'Folders',
            component: () => import('../views/Admin/ResourceCollection/Folders.vue'),
            props:true,
            meta: {requiredAuth: true},
            beforeEnter: requiredAdmin,
            
          },
          {
            path: 'createfile',
            name: 'CreateFile',
            component: () => import('../views/Admin/ResourceCollection/CreateFile.vue'),
            props: true,
            meta: {requiredAuth: true},
            beforeEnter: requiredAdmin,
          },
          {
            path: 'updatefile/:id',
            name: 'UpdateFile',
            component: () => import('../views/Admin/ResourceCollection/UpdateFile.vue'),
            props: true,
            meta: {requiredAuth: true},
            beforeEnter: requiredAdmin,
          }
        ]
      },
      {
        path: 'teachers',
        name: 'Teachers',
        component: () => import('../views/Admin/Teachers.vue'),
        meta: {requiredAuth: true},
        beforeEnter: requiredAdmin,
        children:[
          {
            path:'create',
            name: 'CreateTeacher',
            component: () => import('../views/Admin/TeachersForm/CreateTeacher.vue'),
            meta: {requiredAuth: true},
            beforeEnter: requiredAdmin,
          },
          {
            path:'update/:id',
            name: 'UpdateTeacher',
            component: () => import('../views/Admin/TeachersForm/UpdateTeacher.vue'),
            props: true,
            meta: {requiredAuth: true},
            beforeEnter: requiredAdmin,
          }
        ]
      }
    ]
  },
  {
    path: '/user',
    name: 'User',
    component:()=> import('../views/User/User.vue'),
    meta: {requiredAuth: true},
    redirect: '/user/dashboard',
    children:[
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/User/Dashboard.vue'),
        meta: {requiredAuth : true},
        children:[
          {
            path:'lesson/:number',
            name: 'LessonUser',
            props:true,
            component:() => import('../views/User/DashboardCollection/LessonUser.vue'),
            meta:{requiredAuth:true}
          }
        ]
      },
      {
        path:'laboratory',
        name: 'Laboratory',
        component: () => import('../views/User/Laboratory.vue'),
        meta: {requiredAuth: true},
        beforeEnter: requiredLoadLesson,
        children: [
          {
            path: 'slide/:id',
            name: 'Slide',
            component: () => import('../views/User/LaboCollection/Slide.vue'),
            props:true,
            meta: {requiredAuth: true},
          }
        ]
      },
      {
        path: 'resource',
        name: 'ResourceUser',
        component: () => import('../views/User/ResourceUser.vue'),
        meta: {requiredAuth: true},
        children:[
          {
            path: 'folders/:name',
            name: 'FoldersUser',
            component: () => import('../views/User/ResourceUserCollection/FoldersUser.vue'),
            props:true,
            meta: {requiredAuth: true}
          }
        ]
      },
      {
        path:'classroom',
        name: 'Classroom',
        component: () => import('../views/User/Classroom.vue'),
        meta:{requiredAuth: true}
      }
    ]
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Tất cả các route đều đc gán cái guard này trước khi truy cập vào  ---- cái này phải viết sau biến router, thì mới truy cập trường meta đc
router.beforeEach(async(to, from, next) => {
  const requiredAuth = to.matched.some(record => record.meta.requiredAuth);
  if (requiredAuth && !await getCurrentUser()){
    //console.log("routeGuard bắt đc và ném về login")
    next({name: 'Welcome'});
  }else{
    next();
  }
});



export default router


// component: () => import(/* webpackChunkName: "classManage" */ './views/Resource') thay thế cho import thông thường
// nó là 1 tính năng của webpack cho phép bao h đi tới router đó thì mưới laod chunk(hoặc phần bundle) mà các router đó cần (ở đây là 1 file js đc nén bằng webpack)
// tốc độ đc cải thiẹn
