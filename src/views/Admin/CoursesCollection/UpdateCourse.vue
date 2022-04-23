<template>
    <div class="create-course">
        <div class="back-button" @click="closeModal"><i class="small material-icons">arrow_back</i></div>
        <h3 class="title center">Update Course {{id}}</h3>
        <div class="create-container">

            <form @submit.prevent="handleSubmit" class="container form-container">
                <div class="row">
                    <div class="input-field col s12">
                        <input id="course-name" type="text" class="validate" v-model="name" required>
                        <label class="active"  for="course-name">Course name</label>
                    </div>
                </div>

                <div class="row" v-if="isAdmin">
                    <div class="col s4">
                        <button class="button-course waves-effect waves-light btn grey lighten-1" @click.prevent="deleteCourse"><i class="material-icons left">delete</i>Delete Course</button>
                    </div>
                    <div class="col s4">
                        <button class="button-course waves-effect waves-light btn grey lighten-1" @click.prevent="clearField"><i class="material-icons left">cancel</i>Clear</button>
                    </div>
                    <div class="col s4">
                        <button class="button-course waves-effect waves-light btn red darken-4"><i class="material-icons left">add</i>Update Course</button>
                    </div>
                </div>
                <div class="row" v-if="isTeacher">
                    <div class="col s6">
                        <button class="button-course waves-effect waves-light btn grey lighten-1" @click.prevent="clearField"><i class="material-icons left">cancel</i>Clear</button>
                    </div>
                    <div class="col s6">
                        <button class="button-course waves-effect waves-light btn red darken-4"><i class="material-icons left">add</i>Update Course</button>
                    </div>
                </div>

            </form>

        </div>
    </div>
</template>

<script>
    import {ref,onMounted,computed} from 'vue'
    import {useRouter} from 'vue-router'
    import {projectFirestore} from '@/firebase/config'
    import getDoc from '@/composable/getDoc'
    import {useStore} from 'vuex'

    export default {
        props: ['id'],
        setup(props) {

            const store = useStore();
            const isAdmin = computed(()=>store.getters['user/getIsAdmin']);
            const isTeacher = computed(()=> store.getters['user/getIsTeacher']);

            const router = useRouter();
            const {data : course , error: errGet, load} = getDoc("courses")
            
            //ref//
            const error = ref(null);
            const name = ref("");

            //fetch lấy cái class đó và gán lại giá trị
            load(props.id)
                .then(()=>{
                    name.value = course.value.name;
                })


            const closeModal = ()=>{
                router.back();
            }

            const clearField = ()=>{
                error.value = null;
                name.value = "";
            }


            const deleteCourse = async()=> {
                if(!isAdmin.value) return false;
                const res = await store.dispatch('admin/deleteCourse',{
                    courseID : props.id
                })

               if(res){
                    // lấy id của doc đầu tiên trong collection courses
                    const res = await projectFirestore.collection("courses").orderBy('createdAt','desc').limit(1).get();
                    const newID = (res.docs)[0].id;
                   router.push({name: 'Lessons', params:{id: newID}});
               }
            }

            const handleSubmit = async()=>{
                const updatedCourse = {
                    name: name.value
                }
                const res = await store.dispatch('admin/updateCourse',{
                    courseID: props.id,
                    updatedCourse: updatedCourse
                })
                if(res){
                    router.push({name : "Lessons", params: {id:props.id}});
                }
            }

            return {error,name,isAdmin,isTeacher,
                    course,deleteCourse,
                    closeModal,clearField,handleSubmit}
        }
    }
</script>

<style lang="scss" scoped>
.back-button{
    position: absolute;
    top: 0.5rem;
    left: 2rem; 
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
    @include transition;
    &:hover{
        background-color: $color-gray-dark;
        color: white;
    }
}
.title{

}
.create-course{
    width: 75%;
    position: relative;
    
}
.create-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: -3%;
}
.form-container{

}
.button-course{
    width: 100%;
    font-family: "Averta Semi Bold";
}
</style>