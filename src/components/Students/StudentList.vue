<template>
    <div class="student-list" v-if="students.length">
        <div class="student-card" v-for="student in students" :key="student.id">
            <div class="student-ava"></div>
            <div class="student-edit" @click="toggleModal(student.id)">
                <i class="material-icons">edit</i>
            </div>
            <div class="student-nickname">{{computedName(student.nickname)}}</div>
            <div class="student-submit">
                <span class="student-icon"><i class="material-icons">arrow_drop_up</i></span>
                <span class="student-works">{{computedSubmit(student.works.length)}}</span>
            </div>
        </div>

        <UpdateStudentModal :studentID="studentID"
                            :showModal="showModalCreate" @closeModal="toggleModal(null)" 
                            @updateCount="$emit('updateCount',$event)"/>
    </div>
    <div v-else>
        <Loading/>
    </div>
</template>

<script>
    import Loading from '@/components/Loading'
    import UpdateStudentModal from '@/components/Students/UpdateStudentModal'
    import {ref} from 'vue'
    export default {
        props: ['students'],
        components:{
            Loading, UpdateStudentModal
        },
        setup(props) {
            //set up modal control
            const showModalCreate = ref(false);
            const studentID = ref(null);
            const toggleModal = (id)=> {
                if(!id){    //đóng modal
                    showModalCreate.value = !showModalCreate.value;
                }else{   //nạp ID vào và mở modal
                    studentID.value = id;
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

            return {computedSubmit,computedName,studentID,
                    showModalCreate,toggleModal};
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

        &:hover{
            cursor: pointer;
            transform: scale(1.05);
        }
    }

    &-ava{
        position: absolute;
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        top: 10%;
        left: 10%;
        transform: translate(-50%,-50%);
        background-color: $color-orange;
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
        background-color: $color-gray-light-2;
        color: $color-gray-dark;
        position: absolute;
        top: -15%;
        left: -4%;
        @include transition;

        &:hover{
            color: $color-primary;
        }
    }
}
</style>