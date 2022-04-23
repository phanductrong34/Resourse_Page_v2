import { createStore } from 'vuex'
import {projectFirestore,timestamp,FieldValue,projectFunctions} from '@/firebase/config'
import getDoc from '@/composable/getDoc'
import getCollectionFilter from '@/composable/getCollectionFilter'
import useCollection from '@/composable/useCollection'
import updateDoc from '@/composable/updateDoc'
import setDoc from '@/composable/setDoc'
import removeDoc from '../composable/removeDoc'
import removeDocsFilter from '@/composable/removeDocsFilter'
import _ from 'lodash'
import { useToast } from "vue-toastification";
const toast = useToast()

//hàm rải data của doc từ onSnapshot và thêm trường id nữa
const transformDoc = (document)=>{
  return {...document.doc.data(), id: document.doc.id};
}

const moduleUser = {
    namespaced: true,
    state: {
      isAdmin: false,
      isTeacher: false,
      currentUser: null,
      userData: null,
    },
    getters:{
      getIsAdmin(state){
        return state.isAdmin
      },
      getIsTeacher(state){
        return state.isTeacher
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
      updateNameAndPhone({state},{phone,fullname}){
        state.userData.phone = phone;
        state.userData.fullname = fullname;
      },
      async updateUserData({state,commit},{user,isAdmin,isTeacher}){    
        // update user and admin state
        commit('changeUser',user);
        state.isAdmin = isAdmin;
        state.isTeacher = isTeacher;
        
        let collection = null;
        (isAdmin || isTeacher) ? collection = "admins" : collection = "students" 
        
        const {data , error, load} = getDoc(collection);
        await load(user.uid);
        
        if(!error.value){
          state.userData = data.value;          
          //console.log("🚀 ~ file: index.js ~ line 62 ~ USERdata", state.userData);
        }
      },
      async updateNewUser({state,commit}){
        state.userData.isNewUser = false;
        const {error, update} = updateDoc("students");
        await update(state.currentUser.uid,{
          isNewUser: false
        })
        //console.log("update newUser to false")
      },

      resetUser({commit}){
        commit('resetUser');
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
    resetLesson(state){
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
    resetLesson({commit}){
      commit('resetLesson');
    },
    //lấy list lesson cùng có courseID của user, và unlock list ở class user đang học
    async firstLoadLesson({commit,rootGetters,state}){
      commit('resetLesson');

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
          //console.log("set unlock ",[...activeClass.value.unlockLessons]);
        }
    },
    setListenerLessons({rootGetters,state}){
      // khởi tạo listener chạy mỗi khi thay đổi data base
      const courseID = rootGetters['user/getCourseID']
      
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
    resetClass({commit}){
      commit('resetClass');
    }
  }
}

const moduleWorks = {
  namespaced: true,
  state:{
    workList: []
  },
  getters:{
    getWorks:(state)=>(number)=>{  // trả về array works của 1 lesson trong mảng tất cả bài của học viên ấy
      if(state.workList.length == 0) return null;
      else{
        const curWorks = state.workList.filter((work)=> work.lessonNumber == number);
        if(curWorks.length > 0) return curWorks;
        else return null;
      }
    },
    getWorkList(state){
      return state.workList;
    },
    // getWorkCount(state){
    //   return state.list.length;
    // },
  },
  mutations: {
    pushWork(state,work){
      state.workList.push(work);
    },
    setWorks(state,works){
      state.workList = works
    },
    updateWork(state,newWork){
      const index = state.workList.findIndex((work)=>work.id == newWork.id);
      if(index > -1){
        state.workList[index] = newWork;
      }
    },
    resetWorks(state){
      state.workList = [];
    }
  },
  actions: {
    resetWorks({commit}){
      commit('resetWorks');
    },
    async firstLoadWorks({rootGetters,commit}){
      commit('resetWorks');
      const studentID = rootGetters['user/getCurrentUser'].uid;
      const {dataArray : works, error, load: loadWorks} = getCollectionFilter();
      await loadWorks("works","studentID",studentID);
      
      if(works.value.length){
        commit('setWorks',works.value);
      }
    },
    //payload = {inputURL, number}
    async uploadWork({commit,rootGetters}, {videoUrl,thumbnailUrl, workSize, workName, workDuration, publicId, number,downloadUrl}){
      const newWork = {
        lessonNumber: number,
        videoUrl,
        thumbnailUrl,
        workSize,
        workDuration,
        workName,
        publicId,
        downloadUrl,
        studentNickname:rootGetters['user/getUserData'].nickname,
        studentFullName:rootGetters['user/getUserData'].fullname,
        avaRef: rootGetters['user/getUserData'].avaRef,
        studentID: rootGetters['user/getCurrentUser'].uid,
        classID: rootGetters['user/getClassID'],
        courseID: rootGetters['user/getCourseID'],
        createdAt: timestamp(),
        score: 0
      }    
      const {error :err1, addDoc} = useCollection("works");
      const res = await addDoc(newWork);
      if(!err1.value){
        //Đợi để lấy ID sau đó
        commit('pushWork',{...newWork, id: res.id, createdAt: 'Just now'});
        // thêm id này vào works curea học sinh
        await projectFirestore.collection("students").doc(newWork.studentID).update({
          works: FieldValue.arrayUnion(res.id)
        })

        // thêm work mới này vào studentWorks module để cập nhật ở trang classroom
        // commit('studentWorks/pushWork',{...newWork, id: res.id, createdAt: 'Just now'},{root : true})

        //toast thành công ở đây
        toast.clear();
        toast.success("Upload Homework succesfully");
        return newWork;
      }else{
        alert("Upload Fail: "+ err1.value)
        //toast fail ở đây
        return null;
      }

    },

    async deleteWork({state,rootGetters,commit},{workID,studentID}){
  
      //xóa ở collection work
      const {remove, error: err1} = removeDoc("works");
      await remove(workID);
      if(err1.value){
        console.log(err1.value);
        toast.error('Delete homework failed');
        return null;
      }
  
      //xóa ở student works array bằng cách update lại field, fiter ra
      const {update, error: err2} = updateDoc('students')
      const studentId = rootGetters
      await update(studentID,{
        works: FieldValue.arrayRemove(workID)
      })
      if(err1.value){
        console.log(err2.value);
        toast.error('Delete homework failed');
        return null;
      }
  
      // thành công thì xóa ở state offline array worklist
      state.workList = state.workList.filter(work => work.id !== workID);

      // và xóa  ở trường studentWorks + studentsList trong module studentWorks
      const data = {workID,studentID} // phải làm thế này vì commit ở module khác chỉ cho phép 1 biến đc truyền
      // commit('studentWorks/deleteWork',data, {root: true});
      toast.clear();
      toast.success(`Delete homework successfully!!`);
      // 
    }

  },



}

// để lưu dữ liệu ở trang classroom
const moduleStudentWorks = {
  namespaced: true,
  state:{
    studentList:[], // [student1, student2, student3]
    studentWorks:{}, //"studentID": [work1, work2]
    allWorks:[]  // [work1, work2],
  },
  getters:{
  },
  mutations:{
    pushWork(state,work){
      const index = state.studentList.findIndex(student => student.id == work.studentID);
      if(index >0) {
        state.studentList[index].works.push(work.id);
      }
      state.studentWorks[work.studentID].push(work);
      state.allWorks.push(work);
    },  
    deleteWork(state,data){
      const workID = data.workID;
      const studentID = data.studentID;
      const index1 = state.studentList.findIndex(student => student.id == studentID); // tìm ra học sinh có bài tập ấy
      const index2 = state.studentWorks.findIndex(work => work.id == workID); // tìm ra bài tập ấy trong studentWorks
      const index3 = state.allWorks.findIndex(work => work.id == workID);
      if(index1 > 0){
        state.studentList[index1].works =  state.studentList[index1].works.splice(index1,1);
      }
      if(index2 > 0){
        state.studentWorks[studentID] = state.studentWorks[studentID].splice(index2,1)
      }
      if(index3 > 0){
        state.allWorks.splice(index3,1);
      }
    }
  },
  actions:{
    resetStudentWorks({state}){
      state.studentList = []
      state.studentWorks = []
      state.allWorks=[] 
    },
    async getWorks({state},{studentID}){
      const works = state.studentWorks[studentID]
      if(!works){
        //get từ firestore
        const {dataArray , error, load} = getCollectionFilter();
        await load("works","studentID",studentID);
        if(dataArray.value.length){
          state.studentWorks[studentID] = dataArray.value;
          //console.log("🚀 ~ file: index.js ~ line 379 ~ dataArray.value", dataArray.value)
          return dataArray.value;
        }else return null; // fetch mà ko có work thì trả null
      }else{
        return works  // get mà có trong kho rồi thì không lấy nữa
      }
    },
    async getAllWorks({state,rootGetters}){
      if(!state.allWorks.length){
        const classID = rootGetters['user/getClassID'];
        const {dataArray , error, load} = getCollectionFilter(); 
        await load("works","classID",classID);
        if(dataArray.value.length){
          state.allWorks = dataArray.value;
          return dataArray.value
        }else return null;
      }else{
        return state.allWorks;
      }

    },
    async getStudentList({state,rootGetters}){
      if(!state.studentList.length){
        const classID = rootGetters['user/getClassID'];
        const {dataArray , error, load} = getCollectionFilter();
        await load("students","classID",classID);
        if(dataArray.value.length){
          state.studentList = dataArray.value;
          //console.log("🚀 ~ file: index.js ~ line 403 ~ state.studentList", state.studentList)
          return state.studentList;
        }
      }else return state.studentList
    }
  }
}

const moduleImages = {
  namespaced:true,
  state: {
    imageList: {}
  },
  getters:{
    getImage: (state)=>(refUrl)=>{
      return state.imageList[refUrl] || null;
    }
  },
  mutations:{

  },
  actions:{
    addImage({state},{refUrl,photoURL}){
      state.imageList[refUrl] = photoURL;
    }
  }
}

const moduleAdmin = {
  namespaced: true,
  state:{
    classWorks:{}, //"mt1.1":[work1,work2,..],
    classStudents:{}, //"mt1.1": [student1, student2],
    activeStudentID: null,
    activeClassID: null,

  },
  getters:{
    getClassWorks: (state)=>(classID)=>{
      if(state.classWorks[classID]){
        return state.classWorks[classID];
      }else{
        return null;
      }
    },
    getStudentsFromClass: (state) => (classID)=>{
      if(!state.classStudents[classID]){  // nhận null(chưa load), nhận [] (laod rồi nhưng rỗng), [student, student2] nếu có
        return null
      }else if(state.classStudents[classID].length == 0){
        return []
      }else{
        return state.classStudents[classID];
      }
    },
    getActiveStudentID(state){
      return state.activeStudentID;
    }

  },
  mutations:{
    setActiveStudentID(state,newID){
      state.activeStudentID = newID;
    }
  },
  actions:{
    resetAdmin({state}){
      state.classWorks = {};
      state.classStudents = {};
      state.activeStudentID = null;
      state.activeClassID = null;
    },
    async loadClassWorks({state},{classID}){
      const {dataArray : classWorks, error, load} = getCollectionFilter();
      await load("works","classID",classID);
      if(error.value){ // nếu có lỗi
        toast.error("Load Class Works Failed");
        console.log(error.value);
        return null;
      }else if(classWorks.value.length == 0){   // nếu không lỗi nhưng ko có bài
        state.classWorks[classID] = [];
        return 0;
      }else{  // không lỗi và có bài
        state.classWorks[classID] = classWorks.value;
        return classWorks.value;
      }
    },

    //fetch students thuộc trong 1 lớp và lưu lại owr dajgn array
    async loadStudentsClass({state},{classID}){
      const {dataArray : students, error, load} = getCollectionFilter();
      await load("students","classID",classID);
      if(!error.value){ //nếu fetch không lỗi 
        if(students.value.length == 0){ // ko lỗi những không có data
          state.classStudents[classID] = [];
          return 0;
        }else{
          state.classStudents[classID] = students.value;
          return students.value;
        }
      }
    },

    async deleteWork({state},{workID,studentID,classID}){
  
      /////////////xóa ở collection work
      const {remove, error: err1} = removeDoc("works");
      await remove(workID);
      if(err1.value){
        console.log(err1.value);
        toast.error('Delete homework failed');
        return null;
      }
  
      //xóa ở student works array bằng cách update lại field, fiter ra
      const {update, error: err2} = updateDoc('students')
      await update(studentID,{
        works: FieldValue.arrayRemove(workID)
      })
      if(err1.value){
        console.log(err2.value);
        toast.error('Delete homework failed');
        return null;
      }
      
      // thành công thì xóa ở state offline array worklist
      state.classWorks = state.classWorks[classID].filter(work => work.id !== workID);
      //xóa offline ở trường works trong student
      const index = state.classStudents[classID].findIndex(student => student.id == studentID)
      state.classStudents[classID][index].works =state.classStudents[classID][index].works.filter(id => id !== workID);
      toast.clear();
      toast.success(`Delete homework successfully!!`);
    },

    // thêm học viên mới ở auth, lấy id ở auth trả về thêm ở firestore và offline và classStudent
    async addNewStudent({state}, {newStudents,activeClassID,activeCourseID,defaultPass}){  //input là array
      const {error, set: setStudentDoc} = setDoc("students")
      const createUser = projectFunctions.httpsCallable("createUser");
      toast.info(`Adding new students to class ${activeClassID}...`);
    //format lại 
      const newStudentsArray = newStudents.map((student,index) => {
        return {...student,
                classID: activeClassID,
                courseID: activeCourseID,
                fullname: "",
                works: [],
                phone: "",
                avaRef:`ava/ava-(${Math.ceil(Math.random()*50)}).svg`,
                createdAt: timestamp(),
                isNewUser: true,
            };
      });
    // loop qua array mới tạo tk cho user và lấy id set lên firestore, rồi set vào cuối classStudents[activeClassID] offline 
      newStudentsArray.forEach(async(newStudent)=>{
        const resCreate = await createUser({email: newStudent.email, password: defaultPass})
        if(resCreate.data){
          const uid = resCreate.data.uid;
          await setStudentDoc(uid,newStudent);
          state.classStudents[activeClassID].push({...newStudent, id: uid});
          toast.clear();
          toast.success(`Adding successfully ${newStudent.nickname} successfully !`);
        }else{
          toast.clear();
          toast.error(`Email ${newStudent.email} has existed in another class`)
        }
      });
    },

    /* tìm work ở firestore và xóa hết trước
    xóa học viên, xóa cả tk ở auth, 
    xóa doc ở firestore cả student 
    xóa offline cả classWorks,classStudents, 
    đổi lại activeStudent vè đầu*/
    async deleteStudent({state},{studentID, classID}){
      toast.info("Delete student and works...");
      const {error: errWorks, remove : removeWorks} = removeDocsFilter();
      const {error : errStudent, remove: removeStudent} = removeDoc("students");
      const deleteUser = projectFunctions.httpsCallable("deleteUser");

      removeWorks("works","studentID",studentID);
      removeStudent(studentID);
      await deleteUser({uid: studentID});
      if(!errWorks.value && !errStudent.value){
        state.classWorks[classID] = state.classWorks[classID].filter(work => work.studentID !== studentID);
        state.classStudents[classID] = state.classStudents[classID].filter(student => student.id !== studentID);
        toast.clear();
        toast.success("Delete student successfully!");
      }else{
        toast.clear();
        toast.error("Delete student failed!");
        console.log(errWorks.value,errStudent.value);
      }


    },


    //update ở fireStore và offline classStudent + classWorks là xong
    async updateStudent({state},{studentID,classID,newData}){
      const {error : errUpdate, update} = updateDoc("students");
      await update(studentID,newData);
      if(!errUpdate.value){
        //update thông tin ở student đang đổi
        const idx1 = state.classStudents[classID].findIndex(stu => stu.id == studentID);
        state.classStudents[classID][idx1] = {
          ...state.classStudents[classID][idx1],
          fullname: newData.fullname,
          nickname: newData.nickname,
          phone: newData.phone
        } 
        //update thông tin ở các work trùng với student đang update
        state.classWorks[classID].forEach((work,index) => {
          if(work.studentID == studentID){
            state.classWorks[classID][index].fullname = newData.fullname;
            state.classWorks[classID][index].nickname = newData.nickname;
            state.classWorks[classID][index].phone = newData.phone;
          }
        })

        toast.clear();
        toast.success("Update student successfully!");

      }else{
        toast.clear();
        toast.error("Update student failed");
      }
    },

    async addNewLesson({state}, {newLesson}){
        if(newLesson.tags.length == 0){
          toast.error("You must have at least 1 tag");
          return false;
        }else{
            //check có tồn tại trong courseID ấy có number ấy chưa 
            const res = await projectFirestore.collection("lessons")
                .where('courseID','==',newLesson.courseID)
                .where('number','==',newLesson.number)
                .get();
            
            if(res.size){  // nếu tồn tại lesson có number ấy rồi
              toast.error(`Lesson ${newLesson.number} is already exists. Choose another one`)
              return false;
            }else{
                const {error : errAdd, addDoc} = useCollection("lessons");
                await addDoc(newLesson);
                if(!errAdd.value){
                    toast.clear();
                    toast.success(`Create new lesson successfully!`);
                    
                    return true;
                }else{
                  toast.error("Create new lesson failed");
                  return false;
                }
            }

        }
    } ,
    
    async updateLesson({state},{lessonID, updatedLesson,lessonNumber}){
      if(updatedLesson.tags.length == 0){
          toast.error("You must have at least 1 tag");
          return false
      }else{
          const {error: errUpdate, update} = updateDoc("lessons");
          await update(lessonID,updatedLesson);
          if(!errUpdate.value){
              toast.clear();
              toast.success(`Update lesson ${lessonNumber} successfully!`);
              return true;
          }else{
              toast.error('Update lesson failed');
              return false
          }

      }

    },

    async deleteLesson({state},{lessonID,lessonNumber}){
      const {error: errRemove, remove} = removeDoc("lessons");
      await remove(lessonID);
      if(!errRemove.value){
          toast.clear();
          toast.success(`Delete lesson ${lessonNumber} succeessfully`);
          return true
      }else{
        toast.error(`Delete lesson ${lessonNumber} failed`)
        return false
      }
    },


    async addNewCourse({state},{courseID,newCourse}){
        //check có tồn tại courseID ấy chưa 
        const res = await projectFirestore.collection("courses").doc(courseID).get();
        if(res.exists){  // nếu tồn tại
            toast.error(`${courseID} is already exists. Choose another one`)
            return false
        }else{
            const {error : errSet, set} = setDoc("courses");
            await set(courseID,newCourse);
            if(!errSet.value){
                toast.clear();
                toast.success(`Create new course successfully!`);
            }else{
              toast.error(`Create new course failed`);
              return false
            }
        }
    },

    async updateCourse({state},{courseID,updatedCourse}){
      const {error :errUpdate, update} = updateDoc("courses");
        await update(courseID,updatedCourse);
        if(!errUpdate.value){
            toast.clear();
            toast.success(`Update course ${courseID} successfully!`);                        
            return true;
        }else{
          toast.error('Update course failed - 1');
        }
    },

    async deleteCourse({state},{courseID}){
  // xóa online trước theo thứ tự: work -> student -> class -> lesson -> course mà có courseID trùng
  
      //batch delete works
          const {error: errWorks, remove: removeWorks} = removeDocsFilter();
          removeWorks("works","courseID",courseID);
          if(errWorks.value){
            toast.error("Delete course failed! - 2");
            return false
          }
        
      //load tất cả student có course id ấy để xóa tài khoảng trong auth
          const deleteMultiUser = projectFunctions.httpsCallable("deleteMultiUser");
          const {dataArray: filterStudents , error : errGetStudent, load : loadStudent} = getCollectionFilter();
          await loadStudent("students","courseID",courseID);
          if(filterStudents.value.length){
            const ids = filterStudents.value.map(student => student.id);
            deleteMultiUser({ids:ids});
          }
          
          const {error: errRemove, remove: removeDocs} = removeDocsFilter();
        //batch delete students
          removeDocs("students","courseID",courseID);
          if(errRemove.value){
            toast.error("Delete course failed! - 3");
            return false;
          }

      // batch delete class
          // lấy ds các class có courseID ấy về để xóa offline trong object classWorks và classStudents
          const {dataArray: classes , error : errGetClasses, load : loadClasses} = getCollectionFilter();
          await loadClasses("classes","courseID",courseID);
          classes.value.forEach(classi => {
            delete state.classStudents[classi.id];
            delete state.classWorks[classi.id];
          })

          removeDocs("classes","courseID",courseID);
          if(errRemove.value){
            toast.error("Delete course failed! - 4");
            return false;
          }
      //batch delete lesson
          removeDocs("lessons","courseID",courseID);
          if(errWorks.value){
            toast.error("Delete course failed! - 5");
            return false
          }


      //delete course
          const {remove: removeCourse, error: errCourse} = removeDoc("courses");
          await removeCourse(courseID);
          if(errCourse.value){
            toast.error("Delete course failed! - 6");
            return false;
          }else{
            // ko cần xóa offline vì mất lớp rồi thì cũng khỏi hiện 
            toast.clear();
            toast.success("Delete course successfully!")
            return true;
          }

    },

    async createFile({state},{newFile}){
      if(newFile.from.length == 0 || newFile.type.length == 0){
        toast.error("You must choose both from and type");
        return false;
      }
      const {error : errCreate, addDoc} = useCollection("files")
      await addDoc(newFile);
      if(!errCreate.value){
        toast.clear();
        toast.success(`Create new ${newFile.folder} successfully!`);
        return true
      }else{
        toast.error( `Create ${newfile.folder} failed`);
        return false;
      }
    },
    
    async updateFile({state},{fileID,updatedFile,folder}){
      const {error : errUpdate, update} = updateDoc("files")
      await update(fileID,updatedFile);
      if(!errUpdate.value){
          toast.clear();
          toast.success(`Update ${folder} successfully!`);
          return true;
      }else{
        toast.error( `Update ${folder} failed`);
        return false;
      }
    },

    async deleteFile({state},{fileID,folder}){
      const {remove, error} = removeDoc("files");
      await remove(fileID);
      if(!error.value){
        toast.clear();
        toast.success(`Delete ${folder} successfully!`);
        return true
      }else{
        toast.error(`Delete ${folder} failed`);
        return false;
      }
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
    works: moduleWorks,
    studentWorks: moduleStudentWorks,
    images: moduleImages,
    admin: moduleAdmin
  }
})
