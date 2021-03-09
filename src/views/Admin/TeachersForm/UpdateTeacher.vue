<template>
    <div class="card card-admin" v-if="admin">
        <form @submit.prevent="handleSubmit">
            <span class="close" @click="closeModal">
                <i class="material-icons">clear</i>
            </span>
            <div class="row">
                <h3 class="center">Update</h3>
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
            <div class="row">
                <div class="input-field col s12">
                    <select v-model="role" id="admin-role" required>
                        <option value="" disabled selected>Choose your option</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Mentor">Mentor</option>
                    </select>
                    <label>Role</label>
                </div>
            </div>
            <div class="row" v-if="err2">
                <div class="center error-message">{{err2}}</div>
            </div>
            <div class="row" v-if="error">
                <div class="center error-message">{{error}}</div>
            </div>
            <div class="row">
                <div class="col s6">
                    <button class="waves-effect waves-light btn grey lighten-1" @click.prevent="clearField"><i class="material-icons left">cancel</i>Clear</button>
                </div>
                <div class="col s6">
                    <button class="waves-effect waves-light btn red darken-4"><i class="material-icons left">edit</i>Update teacher</button>
                </div>
            </div>
        </form>

    </div>
    <div v-else>
        <Loading/>
    </div>
    <div v-if="err1" class="error-message">{{err1}}</div> 
</template>

<script>
    import {ref, onMounted,watchEffect} from 'vue'
    import {useRouter} from 'vue-router'
    import {timestamp,projectFunctions} from '@/firebase/config'
    import getDoc from '@/composable/getDoc'
    import updateUser from '@/composable/updateUser'
    import updateDoc from '@/composable/updateDoc'
    export default {
        props: ['id'],
        components: {
        },
        setup(props) {

            //CHECK XEM DATA SỬA CÓ PHẢI ĐÚNG ADMIN ĐANG ĐĂNG NHẬP KO


            //SET UP FOR DROPDOWN INPUT
            const loadSelect =()=> {
                $(document).ready(function(){
                    $('select').formSelect();
                });
            }
            onMounted(() => {
                loadSelect();
            })
            /////////////////////////////////

            //ref
            const error = ref(null);
            const nickname = ref("");
            const name = ref("");
            const email = ref("");
            const password = ref("");
            const role = ref("");
            const phone = ref("");

            //Fetch data cua admin có id đc truyền vào
            const {data : admin , error : err1, load} = getDoc("admins")

            watchEffect(()=>{
                load(props.id)
                    .then(()=>{
                        nickname.value = admin.value.nickname
                        name.value = admin.value.name
                        email.value = admin.value.email
                        password.value = admin.value.password
                        role.value = admin.value.role
                        phone.value = admin.value.phone
                        loadSelect();
                    })
            })


            
            const clearField = ()=>{
                nickname.value = "";
                name.value = "";
                email.value = "";
                password.value = "";
                role.value = "";
                phone.value = "";
                error.value = null;
            }

            //update toàn bộ field vào đúng cái id cũ
            const {error: err2, update} = updateDoc("admins")
            const updateUser = projectFunctions.httpsCallable('updateUser')

            const router = useRouter();
            const handleSubmit = async()=> {
                error.value = null;
                if(nickname.value.length > 6){
                    error.value = "Nickname must less than 7 character"
                }else{
                    let avaRef = null;
                    if(role.value == 'Teacher') avaRef = "teacher/ava-teacher.png"
                    else if(role.value == 'Mentor') avaRef = "teacher/ava-mentor.png";

                    const newAdmin = {
                        avaRef,
                        nickname: nickname.value,
                        name: name.value,
                        phone: phone.value,
                        email: email.value,
                        role: role.value,
                        createdAt: timestamp()
                    }
                    //update user ở auth = firebase admin 
                    await updateUser({uid: props.id, email: newAdmin.email, password : password.value})
                    // update user doc ở firestore
                    await update(props.id,newAdmin);
                    if(!err2.value){
                        clearField();
                        alert(`${newAdmin.name} has been updated`);
                        router.push({name: 'Teachers'});
                    }
                }
            }



            //closeUpdate
        
            const closeModal = ()=>{
                router.push({name: 'Teachers'})
            }
            
            return  {admin,name,nickname,email,password,role,phone, err1, err2,error,
                    clearField,handleSubmit,closeModal}
        }
    }
</script>

<style lang="scss" scoped>
    .card-admin{
        padding: 30px 30px;
        border-radius: 20px;
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