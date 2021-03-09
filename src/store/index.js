import { createStore } from 'vuex'
import {projectFirestore} from '@/firebase/config'
import getDoc from '@/composable/getDoc'
import getCollectionFilter from '@/composable/getCollectionFilter'
import _ from 'lodash'

//hàm rải data của doc từ onSnapshot và thêm trường id nữa
const transformDoc = (document)=>{
  return {...document.doc.data(), id: document.doc.id};
}

const moduleUser = {
    namespaced: true,
    state: {
      isAdmin: false,
      currentUser: null,
      userData: null,
    },
    getters:{
      getIsAdmin(state){
        return state.isAdmin
      },
      getCurrentUser(state){
        return state.currentUser;
      },
      getUserData(state){
        return state.userData;
      },
      getCourseID(state){
        return state.userData.courseID || null;
      },
      getClassID(state){
        return state.userData.classID || null;
      }
    },
    mutations:{
      changeUser(state,user){
        if(user == null) state.currentUser = null;
        else state.currentUser = user
      },
      changeAdmin(state,check){
        state.isAdmin = check;
      },
      resetUser(state){
        state.isAdmin = false;
        state.currentUser = null;
        state.userData = null;
      }
    },
    actions: {
      async updateUserData({state,commit},{user,isAdmin}){    
        // update user and admin state
        commit('changeUser',user);
        commit('changeAdmin',isAdmin);
        
        let collection = null;
        isAdmin ? collection = "admins" : collection = "students" 
        
        const {data , error, load} = getDoc(collection);
        await load(user.uid);
        
        if(!error.value){
          state.userData = data.value;          
        }
      },
      resetUser({commit}){
        commit('resetUser');
        console.log("reset user from vuex store")
      }
    },
    modules: {

    }
}

const moduleLesson = {
  namespaced: true,
  state: {
    list: [],
    unlockList: []
  },
  getters:{
    getCount(state){
      return state.list.length;
    },
    getList(state){
      return state.list;
    },
    getUnlockList(state){
      return state.unlockList;
    },

    //trả ra list leson dầy đủ thông tin của những lesson đã đc mở khóa
    getFilterList(state){
      if(state.list.length && state.unlockList.length){
        const list = state.list.filter((lesson) => {
          return state.unlockList.includes(Number(lesson.number));
        })
        return _.orderBy(list, ['number'],['desc']);
      }
    },

    getLatestUnlockID(state,getters){
      if(state.list.length && state.unlockList.length ){
        const filterList = getters['getFilterList'];
        return filterList[0].id;
      }else{
        return 0;
      }
    },
  },
  mutations:{
    resetList(state){
      state.list = [];
      state.unlockList = [];
    },
    setList(state,list){
      state.list = list;
    },
    setUnlockList(state,list){
      state.unlockList = list;
    }

  },
  actions:{
    resetList({commit}){
      commit('resetList');
    },
    //lấy list lesson cùng có courseID của user, và unlock list ở class user đang học
    async firstLoadLesson({commit,rootGetters,state}){
      commit('resetList');

      const courseID = rootGetters['user/getCourseID']
    
      const {dataArray: lessonList , error : err1, load:loadLesson} = getCollectionFilter();      
      await loadLesson("lessons","courseID",courseID);
  
      if(lessonList.value.length >0){
        commit('setList',lessonList.value);
      }        
    },
    async firstLoadUnlock({commit,rootGetters}){
        const classID = rootGetters['user/getClassID'];
        const {data: activeClass, error : err2, load: loadClass} = getDoc("classes");
        await loadClass(classID);
        if(activeClass.value.unlockLessons.length > 0){
          commit('setUnlockList', [...activeClass.value.unlockLessons])
          console.log("set unlock ",[...activeClass.value.unlockLessons]);
        }
    },
    setListenerLessons({rootGetters,state}){
      // khởi tạo listener chạy mỗi khi thay đổi data base
      const courseID = rootGetters['user/getCourseID']
      console.log("🚀 ~ file: index.js ~ line 133 ~ courseID", courseID)
      
      projectFirestore.collection("lessons").where("courseID", "==", courseID)
      .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
              const newDoc = transformDoc(change)
              if (change.type === "added") {
                  state.list.unshift(newDoc);
              }
              if (change.type === "modified") {
                  const index = state.list.findIndex((lesson)=>{
                    return newDoc.id == lesson.id;
                  })
                  (state.list)[index] = newDoc;
              }
              if (change.type === "removed") {
                const index = state.list.findIndex((lesson)=>{
                  return newDoc.id == lesson.id;
                })
                state.list.splice(index,1);
              }
          });
      });
    },
    setListenerUnlock({rootGetters,commit}){
      const classID = rootGetters['user/getClassID'];
      projectFirestore.collection("classes").doc(classID)
        .onSnapshot((doc) => {
          commit('setUnlockList',doc.data().unlockLessons);
        })
    }
    

  }
}

const moduleCourse = {
  namespaced: true,
  state:{
    currentCourse: null
  },
  getters:{
    getCurrentCourse(state){
      return state.currentCourse;
    }
  },
  mutations:{
    setCurrentCourse(state,data){
      state.currentCourse = data;
    },
    resetCourse(state){
      state.currentCourse = null;
    }
  },
  actions: {
    async firstLoadCourse({rootGetters,commit}){
      const courseID = rootGetters['user/getCourseID'];
      console.log("🚀 ~ file: index.js ~ line 211 ~ courseID", courseID)
      const {data , error, load} = getDoc("courses")
      if(courseID){
        await load(courseID);
       commit("setCurrentCourse",data.value);
      }
    },
    resetCourse({commit}){
      commit('resetCourse');
    }
  }
}

const moduleClass = {
  namespaced: true,
  state:{
    currentClass: null
  },
  getters:{
    getCurrentClass(state){
      return state.currentClass;
    }
  },
  mutations:{
    setCurrentClass(state,data){
      state.currentClass = data;
    },
    resetClass(state){
      state.currentClass = null;
    }
  },
  actions: {
    async firstLoadClass({rootGetters,commit}){
      const classID = rootGetters['user/getClassID'];
      const {data , error, load} = getDoc("classes")
      if(classID){
        await load(classID);
        commit("setCurrentClass",data.value);
      }
    },
    resetCourse({commit}){
      commit('resetClass');
    }
  }
}


export const store =  createStore({
  state: {
  },
  mutations:{
  },
  actions: {
  },
  modules: {
    user: moduleUser,
    lessons: moduleLesson,
    course: moduleCourse,
    class: moduleClass,
  }
})
