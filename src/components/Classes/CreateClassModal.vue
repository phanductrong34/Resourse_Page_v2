<template>
    <teleport to="#modal">
        <transition name="fadeModal" appear>
            <div
                v-if="showModal"
                class="modal-back"
                @click="closeCreateModal"
            ></div>
        </transition>

        <transition name="slideModal" appear>
            <div v-if="showModal" class="modal-card card">

                <form @submit.prevent="handleSubmit" class="container">
                    <div class="row center">
                        <h3>Create new class</h3>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <input id="createmodal-courseID" type="text" class="validate" v-model="courseID">
                            <label class="active"  for="createmodal-courseID">Course ID</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s12">
                            <input id="createmodal-classID" type="text" class="validate" v-model="classID">
                            <label class="active"  for="createmodal-classID">Class ID</label>
                        </div>
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
                    <div class="row">
                        <div class="col s4 offset-s2">
                            <button class="waves-effect waves-light btn red grey lighten-1 btn-small" @click.prevent="closeCreateModal"><i class="material-icons left">cancel</i>cancel</button>
                        </div>
                        <div class="col s4">
                            <button class="waves-effect waves-light btn btn-small"><i class="material-icons left">add</i>create</button>
                        </div>

                    </div>
                </form>

            </div>
        </transition>
    </teleport>
</template>

<script>
import { ref,onMounted } from "vue"
import {projectFirestore, timestamp} from '@/firebase/config'
import setDoc from '@/composable/setDoc'
export default {
    props: ["showModal"],
    setup(props,context) {



        // Các trường bên trong của modal
        const courseID = ref("ae-1");
        const classID = ref("MT");
        const date1 = ref("T3");
        const date2 = ref("T5");
        const time1 = ref("6h45-8h45");
        const time2 = ref("6h45-8h45");
        const type = ref("")
        
        const valid = ref([false,false]);

        const error = ref("");

        // hàm reset toàn bộ field
        const resetField = ()=>{
            error.value = "";
            courseID.value = "ae-1";
            classID.value = "MT";
            date1.value = "T3";
            date2.value = "T5";
            time1.value = "6h45-8h45";
            time2.value = "6h45-8h45";
            type.value = "";
            valid.value = [false,false];
        }

        // hàm đóng modal lại
        const closeCreateModal = ()=>{
            resetField();
            context.emit('closeModal')
        }
        //1. check hai trường class ID và Course ID xem có vi phạm luật không
        // 2. Nếu đúng cả 2 rồi thì cho phép up lên database, bất cứ chỗ nào có lỗi cũng gán error và cho hiện lên UI
        // 3. Nếu up thành công rồi thì emit event tắt modal + set tất cả các biến ref về mặc định ban đầu
        const handleSubmit = () =>{
            try {
                const load = async ()=>{
        //CHECK tồn tại course 
                    const res1 = await projectFirestore.collection("courses").doc(courseID.value).get();
                    if(!res1.exists) {
                        (valid.value)[0] = false;
                       error.value = `The course ID ${courseID.value} didn't exists. Please create course first`;
                    }else {
                        (valid.value)[0] = true;
                        type.value = res1.data().type;
                    }

        //CHECK không tồn tại mã lớp
                    if(classID.value.length >=5){
                        const res2 = await projectFirestore.collection("classes").doc(classID.value).get();
                        if(res2.exists) {
                            (valid.value)[1] = false;
                            error.value = `Class ${classID.value} has already exists. Please create another`;
                        }else {
                            (valid.value)[1] = true;
                        }
                    }else{
                        error.value = "Class ID must have at least 5 characters";
                        (valid.value)[1] = false;
                    }


        // nếu cả hai cùng true rồi (không còn false nào) thì mới submit lên
                    if(!valid.value.includes(false)){
                        const newClass = {
                            courseID : courseID.value,
                            classID : classID.value,
                            dateCreated : timestamp(),
                            latestUnlock: 0,
                            studentCount : 0,
                            timeOccur: [
                                {date : date1.value, time: time1.value},
                                {date : date2.value, time: time2.value}
                            ],
                            type : type.value 
                                
                        }
                        //POST to database
                        const {error : setError,set} = setDoc();
                        set("classes",classID.value,newClass);

                        //Catch error from database
                        if(setError.value){
                            error.value = setError.value;
                        }else{
                                //clear field from UI
                                //close modal
                                closeCreateModal();
                        }
                    }
                }
                load(); // chạy hàm load tất cả thứ trên
            } catch (err) {
                error.value = err.message;
                console.log(error.value);
            }

        }
        return {courseID,classID, date1, date2, time1, time2,
                error,closeCreateModal,handleSubmit};
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
