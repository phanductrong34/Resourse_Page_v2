<template>
    <teleport to="#modal">
        <transition name="fadeModal" appear>
            <div
                v-if="showModal"
                class="modal-back"
                @click="closeUpdateModal"
            ></div>
        </transition>

        <transition name="slideModal" appear>
            <div v-if="showModal" class="modal-card card">

                <form @submit.prevent="handleSubmit" class="container">
                    <div class="row center">
                        <h3 class="modal-title">Update class {{classID}}</h3>
                        <h5 class="modal-subtitle">{{courseID}}</h5>
                    </div>
                    <div class="row">
                        <h6 class="title">Time Occur</h6>
                    </div>
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="createmodal-date1" type="text" class="validate" v-model="date1">
                            <label class="active" for="createmodal-date1">Date 1st</label>
                        </div>
                        <div class="input-field col s6">
                            <input id="createmodal-time1" type="text" class="validate" v-model="time1">
                            <label class="active" for="createmodal-time1">Time 1st</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s6">
                            <input id="createmodal-date2" type="text" class="validate" v-model="date2">
                            <label class="active" for="createmodal-date2">Date 2nd</label>
                        </div>
                        <div class="input-field col s6">
                            <input id="createmodal-time2" type="text" class="validate" v-model="time2">
                            <label class="active" for="createmodal-time2">Time 2nd</label>
                        </div>
                    </div>
                    <div class="row" v-if="error"> 
                        <p class="error center" >{{error}}</p>
                    </div>
                    <div class="row" v-if="isAdmin">
                        <div class="col s4">
                            <button class="waves-effect waves-light btn red red darken-4 btn-small" @click.prevent="deleteClass"><i class="material-icons left">delete</i>Delete</button>
                        </div>
                        <div class="col s4">
                            <button class="waves-effect waves-light btn red grey lighten-1 btn-small" @click.prevent="closeUpdateModal"><i class="material-icons left">cancel</i>Cancel</button>
                        </div>
                        <div class="col s4">
                            <button class="waves-effect waves-light btn btn-small"><i class="material-icons left">add</i>Update</button>
                        </div>

                    </div>
                    <div class="row" v-if="isTeacher">
                        <div class="col s6">
                            <button class="waves-effect waves-light btn red grey lighten-1 btn-small" @click.prevent="closeUpdateModal"><i class="material-icons left">cancel</i>Cancel</button>
                        </div>
                        <div class="col s6">
                            <button class="waves-effect waves-light btn btn-small"><i class="material-icons left">add</i>Update</button>
                        </div>

                    </div>
                </form>

            </div>
        </transition>
    </teleport>
</template>

<script>
import { ref, watchEffect,computed } from "vue"
import {timestamp,projectFunctions} from '@/firebase/config'
import removeDoc from '@/composable/removeDoc'
import removeDocsFilter from '@/composable/removeDocsFilter'
import getDoc from '@/composable/getDoc'
import getCollectionFilter from '@/composable/getCollectionFilter'
import updateDoc from '@/composable/updateDoc'
import {useStore} from 'vuex'
export default {
    emits: ['closeModal'],
    props: ["showModal","classID"],
    setup(props,context) {

        const store = useStore()
        const isAdmin = computed(()=>store.getters['user/getIsAdmin']);
        const isTeacher = computed(()=> store.getters['user/getIsTeacher']);


        const {data : activeClass, error : errGetClass, load: loadClass} = getDoc("classes")
        const {dataArray: filterStudents , error : errGetStudent, load : loadStudent} = getCollectionFilter();
    
        const {error : errRemoveClass, remove: removeClass} = removeDoc("classes");
        const {error : errRemoveStudent, remove: removeStudent} = removeDoc("students");
        const {error : errRemoveFilter, remove: removeDocs} = removeDocsFilter();

        const {error : errUpdate, update:updateClass} = updateDoc("classes")


        // Các trường bên trong của modal
        const date1 = ref("");
        const date2 = ref("");
        const time1 = ref("");
        const time2 = ref("");
        const error = ref(null);
        const courseID = ref("");

        //LOAD NEW DATA :ở đây do ta truyền trực tiếp data từ cardClass nên không phải check nữa
        watchEffect(async()=>{
            if(props.classID != null){
                const trigger = props.showModal // chỉ để trigger thôi
                await loadClass(props.classID);
                if(!errGetClass.value){
                    date1.value = activeClass.value.timeOccur[0].date;
                    date2.value = activeClass.value.timeOccur[1].date;
                    time1.value = activeClass.value.timeOccur[0].time;
                    time2.value = activeClass.value.timeOccur[1].time;
                    courseID.value = activeClass.value.courseID;
                    error.value =  null;
                }
            }
        })
        
        

        // hàm reset toàn bộ field
        const resetField = ()=>{
            error.value = null
            date1.value = "";
            date2.value = "";
            time1.value = ""
            time2.value = "";
        }

        // hàm đóng modal lại
        const closeUpdateModal = ()=>{
            resetField();
            context.emit('closeModal')
        }

        //delete class có id này, và delete tất cả student có chứa ID này nữa
        // delete cả student khỏi auth bằng admin luôn
        const deleteUser = projectFunctions.httpsCallable("deleteUser")
        const deleteClass = async()=>{
            if(!isAdmin.value) return false;
            error.value = null
            const deletedClassID = props.classID;
            //load toàn bộ sinh viên về và thực hiện lần lượt xóa ở auth và firestore ko cần await nhau
            await loadStudent("students","classID",deletedClassID);
                filterStudents.value.forEach((student)=>{
                    //xóa hs khỏi auth đã
                    deleteUser({uid: student.id});
                    removeStudent(student.id)
                    //console.log(`delete user ${student.nickname}`);
                })
                //xóa toàn bộ works có classiD
                removeDocs("works","classID",props.classID);
                //xóa lớp
                await removeClass(props.classID);
                if(!errRemoveClass.value){
                    
                    closeUpdateModal();
                    alert(`Delete class ${deletedClassID} success`);
                }

        }

        // Nếu update thành công rồi thì emit event tắt modal + set tất cả các biến ref về mặc định ban đầu
        const handleSubmit = () =>{
            try {
                const load = async ()=>{

                    const newClass = {
                        timeOccur: [
                            {date : date1.value, time: time1.value},
                            {date : date2.value, time: time2.value}
                        ],                       
                    }
                    
                    //Update to database
                    await updateClass(props.classID,newClass);
                    //Catch error from database
                    if(!errUpdate.value){
                            //clear field from UI
                            //close modal
                            closeUpdateModal();
                    }

                }
                load(); // chạy hàm load tất cả thứ trên
            } catch (err) {
                error.value = err.message;
                console.log(error.value);
            }

        }
        return {date1, date2, time1, time2,courseID,
                error,errUpdate,errRemoveClass,errRemoveStudent,isAdmin,isTeacher,
                closeUpdateModal,handleSubmit,deleteClass};
    },
};
</script>

<style lang="scss" scoped>
//////////////////BACK GROUND/////////////////
.modal-back {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 98;
    background-color: rgba(0, 0, 0, 0.3);
}
.fadeModal-enter-from,
.fadeModal-leave-to {
    opacity: 0;
}

.fadeModal-enter-active,
.fadeModal-leave-active {
    transition: opacity 0.5s;
}

//////////////////// MODAL ////////////////////
.modal-card {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    border-radius: 1rem;
    padding: 2rem 0;

    width: 100%;
    max-width: 40rem;
}

.slideModal-enter-from,
.slideModal-leave-to {
    transform: translateY(-50%) translateX(100vw);
}

.slideModal-enter-active,
.slideModal-leave-active {
    transition: transform 0.5s;

}
/////////// STYLEING MODAl ///////////////
.title{
    padding-left: 10px;
}
.error{
    color: $color-primary;
}
</style>
