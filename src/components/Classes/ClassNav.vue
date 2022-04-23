/*
Nhận vào là biến activeCourse: animation hoặc illustrator, và thằng tab nào trùng thì là activated() {
Khi click vào tab thì đổi biến activeCourse ở ngoài bố
*/


<template>

    <div class="class-nav">
        
        <h3 class="title">Classes.</h3>
        <div class="course-list" v-if="filterCourseType.length">
            <div   
                v-for="type in filterCourseType" 
                :key="type"
                :class="[{active : type === activeCourse},'course']"
                @click="$emit('activateCourse',type)">
                    {{type}}
            </div>
        </div>
        <div class="course-list" v-else>
            <div 
                class="skeleton" 
                v-for="index in 2"
                :key="index">
            </div>
        </div>
        <button class="btn waves-effect waves-light red darken-4" @click="toggleModal" v-if="isAdmin">
            add Class
        </button>
        <CreateClassModal v-if="isAdmin" :showModal="showModalCreate" @closeModal="toggleModal"/>
    </div>

    
</template>

<script>
    import CreateClassModal from "@/components/Classes/CreateClassModal"
    import getCollection from "@/composable/getCollection"
    import {ref,computed} from 'vue'
    import {useStore} from 'vuex'

    export default {
        components: {
            CreateClassModal
        },
        props: ['activeCourse'],
        setup() {
            //Model control
            const store = useStore()
            const isAdmin = computed(()=>store.getters['user/getIsAdmin']);
            const isTeacher = computed(()=> store.getters['user/getIsTeacher']);

            const showModalCreate = ref(false);
            const toggleModal = ()=> {
                showModalCreate.value = !showModalCreate.value;
            }

            //Load all tab of courses
            const {dataArray : courses , error, load} = getCollection("courses");
            load();
            
            const filterCourseType = computed(()=>{
                if(courses.value.length == 0){ return []}
                else{
                    let newSet = new Set();
                    courses.value.forEach(course => {
                        newSet.add(course.type);
                    })
                    return [...newSet];
                }
            })
            return{courses , error,filterCourseType,isAdmin,isTeacher,
                   showModalCreate,toggleModal}
        }
    }
</script>

<style lang="scss" scoped>
    .class-nav{
        display: flex;
        align-items: flex-end;
        & *{
            margin-right: 20px;
        }
    }   
    .course-list{
        display: flex;
        margin-bottom: 5px;
    }




    //Course///////////
    .course{
        font-size: 20px;
        color: $color-gray-light-1;
        cursor: pointer;
        transition: all 0.15s ease-in-out;
        &::before{
            content: "";
            position: absolute;
            left: 0;
            bottom: -1px;
            width: 0%;
            height: 3px;
            background-color: $color-primary;
            transition: all 0.15s ease-in-out
        }
    }

    .course:hover{
        color: $color-gray-dark;
    }
    .course.active:hover{
        color: darken($color-primary, 10);
    }
    .active{
        color: $color-primary;
        position: relative;
        &::before{
            width: 100%;
        }

    }

    /////////////////




    button{
        border-radius: 10rem;
        text-transform: lowercase;
        font-family: "Averta Semi Bold";
        font-size: 15px;
    }


    //// SKELETON //////////////////

    .skeleton{
        display: inline-block;
        width: 100px;
        height: 25px;
        border-radius: 5px;
        background-color: $color-gray-light-1;
        animation: pulse 1s ease-in-out infinite;
    }

</style>