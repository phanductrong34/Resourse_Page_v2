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

                <form @submit.prevent="handleSubmit">
                    <div class="row center title">
                        <h3>Create new students for {{activeClassID}}</h3>
                    </div>
                    <!-- LIST OF NEW STUDENTS -->
                    <div class="row add-student" v-for="(student,index) in newStudents" :key="index">
                        <div class="col s1 center add-number">
                            {{index + studentCount + 1}}
                        </div>
                        <div class="col s3 center add-nickname"> <p>{{student.nickname}}</p> </div>
                        <div class="col s6 center add-email"> <p>{{student.email}}</p> </div>
                        <div class="col s2 add-delete">
                            <i class="material-icons" @click="deleteStudent(index)">cancel</i>
                        </div>
                    </div>
                    <!-- INPUT FOR NEW STUDENT -->
                    <div class="row">
                        <div class="col s1 center student-number">
                            {{newStudents.length + studentCount + 1}}
                        </div>
                        <div class="input-field col s3">
                            <input id="studentmodal-nickname" type="text" class="validate" v-model="curNickname" placeholder="nickname" ref="nicknameTag"
                                        @keypress.enter.prevent="addStudent">
                        </div>
                        <div class="input-field col s6">
                            <input id="studentmodal-email" type="email" class="validate" v-model="curEmail" placeholder="email" ref="emailTag"
                                        @keydown.alt.prevent="addGmail" 
                                        @keypress.enter.prevent="addStudent">
                        </div>
                        <div class="col s2 gmail-container">
                            <button class="waves-effect waves-light btn red grey lighten-1 btn-small" @click.prevent="addGmail">@gmail</button>
                        </div>
                    </div>
                    

                    <div class="row" v-if="error"> 
                        <p class="error-message center" >{{error}}</p>
                    </div>
                    <div class="row">
                        <div class="col s6">
                            <p class="class-info center">{{studentCount}} students already in class</p></div>
                        <div class="col s5">
                            <button class="waves-effect waves-light btn btn-small red darken-4 button-submit"><i class="material-icons left">add</i>add {{newStudents.length}} students</button>
                        </div>
                    </div>
                </form>
            </div>
        </transition>
    </teleport>
</template>

<script>
import { ref} from "vue"
import {timestamp} from '@/firebase/config'
import useCollection from '@/composable/useCollection'

export default {
    emits:['closeModal','updateCount'],
    props: ["showModal","activeClassID" ,"studentCount"],
    setup(props,context) {

        // ref

        const error = ref("");
        const curNickname = ref("");
        const curEmail = ref("");
        //DOM
        const emailTag = ref(null);
        const nicknameTag = ref(null)
        const newStudents = ref([])


        // hàm reset toàn bộ field
        const resetField = ()=>{
            curEmail.value = "";
            curNickname.value = "";
            error.value = "";
        }

        // hàm đóng modal lại
        const closeCreateModal = ()=>{
            resetField();
            //xóa toàn bộ list
            newStudents.value = [];
            context.emit('closeModal')
        }

        /// các function tiện ích cho riêng modal tạo học sinh
        const addGmail = ()=>{
            curEmail.value = curEmail.value + '@gmail.com';
        }

        const addStudent = ()=>{
            error.value = "";
            if(curNickname.value && curEmail.value){
                const newStudent = {
                    nickname : curNickname.value,
                    email: curEmail.value,
                }
                newStudents.value.push(newStudent);
                //clearField và set lại focus
                resetField();
                nicknameTag.value.focus();
            }else{
                error.value = "You must fill all field to add"
                !curNickname.value ? nicknameTag.value.focus() : emailTag.value.focus();
            }

        }

        const deleteStudent = (index)=>{
            newStudents.value.splice(index,1);
        }

        const {error: errAdd, addDoc : addStudentDoc} = useCollection("students")

        const handleSubmit = () =>{
            const newStudentsArray = newStudents.value.map((student,index) => {
                return {...student,
                        classID: props.activeClassID,
                        fullname: "",
                        works: [],
                        phone: "",
                        createdAt: timestamp()
                    };
            });
            console.log(newStudentsArray);
            newStudentsArray.forEach(async(newStudent)=>{
                await addStudentDoc(newStudent);
            });
            //đánh đông lên StudentSection để nó load lại
            context.emit('updateCount',newStudentsArray.length);
            //resetField và đóng modal 
            resetField();
            closeCreateModal();
            alert("Add students succeed!")
        }

        return {curEmail,curNickname,emailTag,nicknameTag,newStudents,
                addGmail, addStudent,deleteStudent,
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
    padding: 2rem 3rem;

    width: 100%;
    max-width: 60rem;
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

.student-number{
    padding: 2rem 0 2rem 0;
    color: $color-gray-dark;
    font-family: "Averta Semi Bold";
    font-size: 1.2rem;
}
.gmail-container{
    padding: 1.5rem 0 1.5rem 0;
}

// ADD STUDENT LIST
.add-student{
    font-size: 1.2rem;
    font-family: "Averta Semi Bold";
    color: $color-gray-dark;
}

.add-delete{
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover{
        color: $color-primary;
    }
}
////////////

.button-submit{
    width: 100%;
    font-family: "Averta Semi Bold";
}
.class-info{
    font-size: 1.2rem;
    font-family: "Averta Semi Bold";
}
</style>
