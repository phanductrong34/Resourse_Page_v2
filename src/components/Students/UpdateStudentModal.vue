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

                <form @submit.prevent="handleSubmit" v-if="student">
                    <div class="row center title">
                        <h3>Update student </h3>
                        <h5 class="student-email">{{student.email}}</h5>
                    </div>
                    <!-- LIST OF NEW STUDENTS -->

                    <div class="row">
                        <div class="input-field col s12">
                            <input id="updateStudent-fullname" type="text" class="validate" v-model="fullname">
                            <label class="active"  for="updateStudent-fullname">Full name</label>
                        </div>
                    </div>  
                    <div class="row">
                        <div class="input-field col s12">
                            <input id="updateStudent-nickname" type="text" class="validate" v-model="nickname">
                            <label class="active"  for="updateStudent-nickname">Nickname</label>
                        </div>
                    </div>  
                    <div class="row">
                        <div class="input-field col s12">
                            <input id="updateStudent-phone" type="text" class="validate" v-model="phone">
                            <label class="active"  for="updateStudent-phone">Phone</label>
                        </div>
                    </div>  

                    <div class="row" v-if="error"> 
                        <p class="error-message center" >{{error}}</p>
                    </div>
                    <div class="row" v-if="errUpdate"> 
                        <p class="error-message center" >{{errUpdate}}</p>
                    </div>

                    <div class="row">
                        <div class="col s4">
                            <button class="waves-effect waves-light btn btn-small grey lighten-1 button-submit" @click.prevent="deleteStudent"><i class="material-icons left">delete</i>delete</button>
                        </div>
                        <div class="col s4">
                            <button class="waves-effect waves-light btn btn-small grey lighten-1 button-submit" @click.prevent="closeUpdateModal"><i class="material-icons left">cancel</i>cancel</button>
                        </div>
                        <div class="col s4">
                            <button class="waves-effect waves-light btn btn-small red darken-4 button-submit"><i class="material-icons left">add</i>Update Student</button>
                        </div>
                    </div>
                </form>
            </div>
        </transition>
    </teleport>
</template>

<script>
import { ref,watchEffect} from "vue"
import {projectAuth} from '@/firebase/config'
import removeDoc from '@/composable/removeDoc'
import updateDoc from '@/composable/updateDoc'
import getDoc from '@/composable/getDoc'

export default {
    emits: ['closeModal','updateCount'],
    props: ['studentID','showModal'],
    setup(props,context) {

        const {error : errRemove, remove} = removeDoc("students");
        const {data : studentGet, error : errStudent, load} = getDoc("students");
        const {error : errUpdate, update} = updateDoc("students")

        // ref
        const error = ref(null);
        const fullname = ref("");
        const nickname =ref("");
        const phone = ref("");

        // lọc ra student đang sửa
        const student = ref(null);
        watchEffect(async()=>{
            if(props.studentID != null){
                const trigger = props.showModal;

                await load(props.studentID);
                //update field
                student.value = studentGet.value;
                fullname.value = student.value.fullname;
                nickname.value = student.value.nickname;
                phone.value = student.value.phone;

            }
        })



        // hàm reset toàn bộ field
        const resetField = ()=>{
            error.value = null
            fullname.value = ""
            nickname.value =""
            phone.value = ""
        }

        // hàm đóng modal lại
        const closeUpdateModal = ()=>{
            resetField();
            //xóa toàn bộ list
            context.emit('closeModal')
        }

        //getAdmin password for further check
        const password = ref("")
        const {data : admin, error : errAdmin, load: loadAdmin} = getDoc("admins");
        if(!errAdmin.value && projectAuth.currentUser){
            loadAdmin(projectAuth.currentUser.uid)
            .then(()=>{
                password.value = admin.value.password;
            })
        }

        //hàm xóa student

        const deleteStudent = async() => {
            const check = prompt("Type your admin password to delete");
            if(check != null && check == password.value){
                await remove(props.studentID);
                if(!errRemove.value){
                    context.emit('updateCount',1);
                    closeUpdateModal();
                    alert("Delete student succeed!")
                }

            }else{
                alert ("Password Incorrect. Failed to delete File")
            }
        }


        const handleSubmit = async() =>{
            const newStudent = {
                fullname: fullname.value,
                nickname: nickname.value,
                phone: phone.value
            }
            await update(props.studentID,newStudent);
            // đánh đông lên StudentSection để nó load lại
            context.emit('updateCount',1);
            //resetField và đóng modal 
            resetField();
            closeUpdateModal();
            alert("Update students succeed!")
        }

        return {fullname,nickname,phone,errUpdate,
                error,closeUpdateModal,handleSubmit,
                student,deleteStudent,errStudent};
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
    padding: 2rem 3rem;

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
    margin-bottom: 2rem;
}

////////////

.button-submit{
    width: 100%;
    font-family: "Averta Semi Bold";
}
</style>
