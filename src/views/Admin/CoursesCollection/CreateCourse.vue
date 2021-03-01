<template>
    <div class="create-course">
        <div class="back-button" @click="closeModal"><i class="small material-icons">arrow_back</i></div>
        <h3 class="title center">Create Course</h3>
        <div class="create-container">

            <form @submit.prevent="handleSubmit" class="container form-container">

                <div class="row">
                    <div class="input-field col s12">
                        <input id="course-ID" type="text" class="validate" v-model="courseID" required>
                        <label class="active"  for="course-ID">Course ID</label>
                    </div>
                </div>

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
                <div class="row" v-if="errSet">
                    <div class="error-message center">{{errSet}}</div>
                </div>
                <div class="row">
                    <div class="col s6">
                        <button class="button-course waves-effect waves-light btn grey lighten-1" @click.prevent="clearField"><i class="material-icons left">cancel</i>Clear</button>
                    </div>
                    <div class="col s6">
                        <button class="button-course waves-effect waves-light btn red darken-4"><i class="material-icons left">add</i>Create Course</button>
                    </div>
                </div>

            </form>

        </div>
    </div>
</template>

<script>
    import {ref,onMounted} from 'vue'
    import {useRouter} from 'vue-router'
    import {timestamp,projectFirestore} from '@/firebase/config'
    import setDoc from '@/composable/setDoc'
    export default {
        setup() {
            //SET UP FOR DROPDOWN INPUT
            onMounted(() => {
                $(document).ready(function(){
                    $('select').formSelect();
                });
            })

            const router = useRouter();
            const {error : errSet, set} = setDoc("courses");

            //ref//
            const error = ref(null);
            const courseID = ref("");
            const name = ref("");
            const type = ref("");


            const closeModal = ()=>{
                router.back();
            }

            const clearField = ()=>{
                error.value = null;
                courseID.value = "";
                name.value = "";
                type.value = "";
            }

            const handleSubmit = async()=>{
                error.value = null;
                //check có tồn tại courseID ấy chưa 
                const res = await projectFirestore.collection("courses").doc(courseID.value).get();
                if(res.exists){  // nếu tồn tại
                    error.value = `${courseID.value} is already exists. Choose another one`
                }else{
                    const newCourse = {
                        name: name.value,
                        type: type.value,
                        createdAt : timestamp()
                    }
                    await set(courseID.value,newCourse);
                    if(!errSet.value){
                        alert(`Create new course  succeed!`);
                        router.push({name : "Courses"});
                    }
                }


            }

            return {error,courseID,name,type,
                    closeModal,clearField,handleSubmit,errSet}
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