<template>
    <div class="student-list">
        <div :class="[{active: student.id == activeStudentID},'student-card']" 
            @click="changeActiveStudent(student.id)"
            v-for="student in students" 
            :key="student.id">
            <div class="student-ava">
                <div class="ava-container"><Image class="ava" :refUrl="student.avaRef"/></div>
            </div>
            <div class="student-edit" @click="toggleModal(student)">
                <i class="material-icons">edit</i>
            </div>
            <div class="student-nickname">{{computedName(student.nickname)}}</div>
            <div class="student-submit">
                <span class="student-icon"><i class="material-icons">arrow_drop_up</i></span>
                <span class="student-works">{{computedSubmit(student.works.length)}}</span>
            </div>
        </div>

        <UpdateStudentModal :student="updateStudent"
                            :showModal="showModalCreate" @closeModal="toggleModal(null)"/>
    </div>
</template>

<script>
    import UpdateStudentModal from '@/components/Students/UpdateStudentModal'
    import {useStore} from 'vuex'
    import {ref,computed} from 'vue'
    export default {
        props: ['students','activeStudentID'],
        components:{
            UpdateStudentModal
        },
        setup(props) {
            //set up modal control
            const showModalCreate = ref(false);;
            const store = useStore()
            const updateStudent =  ref(null);

            const toggleModal = (student)=> {
                if(!student){    //đóng modal
                    showModalCreate.value = !showModalCreate.value;
                }else{   //nạp student vào và mở modal
                    updateStudent.value = student;
                    showModalCreate.value = !showModalCreate.value;
                }

            }

            const computedSubmit = (submit)=>{
                if(submit < 2) return submit +' submit';
                else return submit +' submits'
            }
            const computedName = (name)=>{
                return name.replaceAll(/\s/g,'')+'.'
            }


            const changeActiveStudent = (studentID) =>{
                store.commit('admin/setActiveStudentID',studentID);
            }
            return {computedSubmit,computedName,updateStudent,
                    showModalCreate,toggleModal,changeActiveStudent};
        }
    }   
</script>

<style lang="scss" scoped>
.student-list{
    display: flex;
    flex-wrap: wrap;
    padding: 2.5rem 1rem 0rem 1rem;
    min-height: 260px;
}


.student{
    &-card{
        position: relative;
        padding: 0.6rem 1.5rem 0.6rem 1rem;
        background-color: white;
        @include card-shadow-1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin: 0 1.5rem 2.5rem 0;
        min-width: 9rem;
        max-height: 74px;
        border-radius: 0.7rem;
        @include transition;
        z-index: 1;

        &:hover{
            cursor: pointer;
            transform: scale(1.05);
            & .ava{
                filter: brightness(80%);
            }
            & .student-edit{
                opacity: 1;
            }
        }
        &.active{
            &::after{
                content: "";
                position: absolute;
                width: 103%;
                height: 106%;
                top: -2px;
                left: -2px;
                z-index: -2;
                border-radius: 0.8rem;
                border: 3px solid $color-primary;
            }
        }
    }

    &-nickname{
        font-family: "Averta Black";
        font-size: 1.2rem;
    }
    &-submit{
        display: flex;
        justify-content: center;
        color: $color-gray-dark;
    }
    &-icon{
        transform: rotate(90deg) translateX(-3px);
    }

    &-edit{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        color: white;
        position: absolute;
        top: -13%;
        left: -4%;
        opacity: 0;
        @include transition;

        &:hover{
            transform: scale(1.5);
        }
    }

//////////////////// AVATA
    &-ava{
        position: absolute;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        top: 10%;
        left: 10%;
        transform: translate(-50%,-50%);
        background-color: $color-primary;
        @include transition;
    }
}
.ava-container{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5rem;
    border-radius: 10rem;
    display:flex;
    justify-content: center;
    overflow: hidden;
    
}
.ava{
    width: 100%;
    transform: translateY(1rem) scale(0.9);

}
</style>