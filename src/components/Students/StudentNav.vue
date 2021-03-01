<template>
    <div class="student-nav">
        
        <h3 class="title">Students.</h3>
        <div class="student-count">{{studentCount}} students</div>
        <div class="student-count">{{submitCount}} submits</div>

        <button class="btn waves-effect waves-light red darken-4" @click="toggleModal">
            add student
        </button>
        <CreateStudentModal :activeClassID="activeClassID" :studentCount="studentCount"
                            :showModal="showModalCreate" @closeModal="toggleModal" 
                            @updateCount="$emit('updateCount',$event)"/>
    </div>
</template>

<script>
    import {ref} from 'vue'
    import CreateStudentModal from '@/components/Students/CreateStudentModal'

    export default {
        props:[
            'activeClassID',"studentCount",'submitCount'
        ],
        components: {
          CreateStudentModal  
        },
        setup() {
            //Model control
            const showModalCreate = ref(false);
            const toggleModal = ()=> {
                showModalCreate.value = !showModalCreate.value;
            }

            return {showModalCreate,toggleModal}
        }
    }
</script>

<style lang="scss" scoped>
    .student-nav{
        display: flex;
        align-items: flex-end;
        & *{
            margin-right: 20px;
        }
    }   
    .student-count,.student-count{
        display: flex;
        margin-bottom: 5px;
        margin-right: 20px ;
        font-size: 20px;
        color: $color-gray-dark;
        cursor: pointer;
    }
    button{
        border-radius: 10rem;
        text-transform: lowercase;
        font-family: "Averta Semi Bold";
        font-size: 15px;
    }
</style>