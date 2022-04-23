<template>
            
        <div class="card card-admin">
            <form @submit.prevent="handleSubmit">
                <span class="close" @click="closeModal">
                    <i class="material-icons">clear</i>
                </span>
                <div class="row">
                    <h3 class="center">Create Teacher</h3>
                </div>
                <div class="row">
                    <div class="input-field col s8">
                        <input id="admin-name" type="text" class="validate" v-model="name" required>
                        <label class="active"  for="admin-name">Name</label>
                    </div>
                    <div class="input-field col s4">
                        <input id="admin-nickname" type="text" class="validate" v-model="nickname" required>
                        <label class="active"  for="admin-nickname">Nickname</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input id="admin-email" type="email" class="validate" v-model="email" required>
                        <label class="active"  for="admin-email">Email</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input id="admin-password" type="password" class="validate" v-model="password" required>
                        <label class="active"  for="admin-password">Password</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input id="admin-phone" type="text" class="validate" v-model="phone" required>
                        <label class="active"  for="admin-password">Phone Number</label>
                    </div>
                </div>
                <div class="row" v-if="error">
                    <div class="center error-message">{{error}}</div>
                </div>
                <div class="row" v-if="errSet">
                    <div class="center error-message">{{errSet}}</div>
                </div>
                <div class="row">
                    <div class="col s6">
                        <button class="waves-effect waves-light btn grey lighten-1" @click.prevent="clearField"><i class="material-icons left">cancel</i>Clear</button>
                    </div>
                    <div class="col s6">
                        <button class="waves-effect waves-light btn red darken-4"><i class="material-icons left">add</i>Create teacher</button>
                    </div>
                </div>
            </form>

        </div>
</template>

<script>
    import {ref, onMounted} from 'vue'
    import {useRouter} from 'vue-router'
    import setDoc from '@/composable/setDoc'
    import {timestamp ,projectFunctions} from '@/firebase/config'
    import {useToast} from 'vue-toastification'
    export default {
        setup() {
            //SET UP FOR DROPDOWN INPUT
            onMounted(() => {
                $(document).ready(function(){
                    $('select').formSelect();
                });
            })
            /////////////////////////////////
            const router = useRouter();
            const toast = useToast();
            const {error:errSet, set} = setDoc("admins")

            //ref
            const error = ref(null);
            const name = ref("");
            const nickname = ref("");
            const email = ref("");
            const password = ref("");
            const phone = ref("");
            
            const clearField = ()=>{
                error.value = null;
                name.value = "";
                nickname.value = "";
                email.value = "";
                password.value = "";
                phone.value = "";
            }

            //Tạo user mói ở auth, lấy uid trả về tạo 1 doc lưu thông tin trong firestore (admins)
            const addTeacherRole = projectFunctions.httpsCallable('addTeacherRole');
            const createUser = projectFunctions.httpsCallable('createUser');
            const handleSubmit = async()=> {
                error.value = null;
                if(nickname.value.length > 6){
                    error.value = "Nickname must less than 7 character"
                }else{
                    let avaRef = null;

                    const admin = {
                        avaRef: "teacher/ava-mentor.png",
                        name: name.value,
                        nickname: nickname.value,
                        phone: phone.value,
                        email: email.value,
                        role: 'teacher',
                        createdAt: timestamp()
                    }
                    // tạo user mới trên auth bằng admin SDK
                    const resCreate = await createUser({email: admin.email, password: password.value})
                    const uid = resCreate.data.uid;
                    
                    
                    // tạo doc admin trên firestore
                    await set(uid,admin);
                    // thêm claim cho teacher
                    const resAdmin = await addTeacherRole({email: admin.email})
                    //console.log("🚀 ~ file: CreateTeacher.vue ~ line 116 ~ resAdmin", resAdmin)
                    
                    if(!errSet.value){
                        clearField();
                        toast.success(`Create new teacher succeesfully`);
                        router.push({name: 'Teachers'})
                    }
                }
            }

            
            const closeModal = ()=>{
                router.push({name: 'Teachers'})
            }
            
            return  {name,email,password,phone,nickname,
                    clearField,handleSubmit,closeModal,error,errSet}
        }
    }
</script>

<style lang="scss" scoped>
    .card-admin{
        padding: 30px 30px;
        border-radius: 20px;
        position: relative;
        & button{
            width: 100%;
            font-family: "Averta Semi Bold";
        }

    }
    .close{
        position: absolute;
        top: 20px;
        right: 20px;
        color: $color-gray-dark;
        cursor: pointer;
    }


</style>