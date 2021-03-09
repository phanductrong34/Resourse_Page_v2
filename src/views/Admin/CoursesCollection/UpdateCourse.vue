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

                <div class="row">
                    <div class="input-field col s12">
                        <select v-model="type" id="course-type" required>
                            <option value="" disabled selected>Choose your option</option>
                            <option value="animation">Animation</option>
                            <option value="illustration">Illustration</option>
                        </select>
                        <label for="course-type">Type</label>
                    </div>          
                </div>
                <div class="row" v-if="error">
                    <div class="error-message center">{{error}}</div>
                </div>
                <div class="row" v-if="errUpdate">
                    <div class="error-message center">{{errUpdate}}</div>
                </div>
                <div class="row" v-if="errGet">
                    <div class="error-message center">{{errGet}}</div>
                </div>
                <div class="row" v-if="errRemove">
                    <div class="error-message center">{{errRemove}}</div>
                </div>
                <div class="row">
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

            </form>

        </div>
    </div>
</template>

<script>
    import {ref,onMounted} from 'vue'
    import {useRouter} from 'vue-router'
    import {timestamp,projectFirestore,projectFunctions} from '@/firebase/config'
    import updateDoc from '@/composable/updateDoc'
    import getDoc from '@/composable/getDoc'
    import removeDoc from '@/composable/removeDoc'
    import removeDocsFilter from '@/composable/removeDocsFilter'
    import getCollectionFilter from '@/composable/getCollectionFilter'
    export default {
        props: ['id'],
        setup(props) {
            //SET UP FOR DROPDOWN INPUT
            onMounted(() => {
                $(document).ready(function(){
                    $('select').formSelect();
                });
            })

            const router = useRouter();
            const {data : course , error: errGet, load} = getDoc("courses")
            const {error :errUpdate, update} = updateDoc("courses");
            const {error : errRemove, remove} = removeDoc("courses");
            const {error : errRemoveStudent, remove: removeStudent} = removeDoc("students");
            const {error : errRemoveFilter, remove: removeDocs} = removeDocsFilter();

            const {dataArray: filterStudents , error : errGetStudent, load : loadStudent} = getCollectionFilter();

            //ref//
            const error = ref(null);
            const name = ref("");
            const type = ref("");

            //fetch lấy cái class đó và gán lại giá trị
            load(props.id)
                .then(()=>{
                    name.value = course.value.name;
                    type.value = course.value.type;
                })


            const closeModal = ()=>{
                router.back();
            }

            const clearField = ()=>{
                error.value = null;
                name.value = "";
                type.value = "";
            }

            // cóa theo trình tự nhỏ lên trên, xóa sinh viên có mã lớp, xóa lớp có mã course, xóa course
            const deleteUser = projectFunctions.httpsCallable("deleteUser");

            const deleteCourse = async()=> {
                error.value = null;
                // xóa sinh viên có courseID trong cả auth lẫn firestore
                await loadStudent("students","courseID",props.id);
                filterStudents.value.forEach((student)=>{
                    deleteUser({uid: student.id});
                    removeStudent(student.id)
                    console.log(`delete user ${student.nickname}`);
                })

                // xóa class có courseID
                removeDocs("classes","courseID",props.id);
                //Xóa lessons liên quan
                removeDocs("lessons",'courseID',props.id);
                // Xóa bản thân course
               await remove(props.id);

               if(!errRemove.value){
                   alert('Delete course succeed!');
                    // lấy id của doc đầu tiên trong collection courses
                    const res = await projectFirestore.collection("courses").orderBy('createdAt','desc').limit(1).get();
                    const newID = (res.docs)[0].id;
                   router.push({name: 'Lessons', params:{id: newID}});
               }
            }

            const handleSubmit = async()=>{
                error.value = null;
                    const updatedCourse = {
                        name: name.value,
                        type: type.value,
                    }
                    await update(props.id,updatedCourse);
                    if(!errUpdate.value){
                        alert(`Update course ${props.id} new course succeed!`);                        
                        router.push({name : "Lessons", params: {id:props.id}});
                    }
            }

            return {error,name,type,
                    errGet,course,deleteCourse,errRemove,
                    closeModal,clearField,handleSubmit,errUpdate}
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