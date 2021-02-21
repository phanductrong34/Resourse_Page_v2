<template>
            
        <div class="card card-admin">
            <form @submit.prevent="handleSubmit">
                <span class="close" @click="closeModal">
                    <i class="material-icons">clear</i>
                </span>
                <div class="row">
                    <h3 class="center">Create</h3>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input id="admin-name" type="text" class="validate" v-model="name" required>
                        <label class="active"  for="admin-name">Name</label>
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
                <div class="row" v-if="error">
                    <div class="center error-message">{{error}}</div>
                </div>
                <div class="row" v-if="errCreateUser">
                    <div class="center error-message">{{errCreateUser}}</div>
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
    import createUser from '@/composable/createUser'
    import {timestamp} from '@/firebase/config'
    export default {
        setup() {
            //SET UP FOR DROPDOWN INPUT
            onMounted(() => {
                $(document).ready(function(){
                    $('select').formSelect();
                });
            })
            /////////////////////////////////

            const {error, set} = setDoc("admins")
            const {error:errCreateUser, create} = createUser();

            //ref
            const name = ref("");
            const email = ref("");
            const password = ref("");
            const role = ref("");
            const phone = ref("");
            
            const clearField = ()=>{
                name.value = "";
                email.value = "";
                password.value = "";
                role.value = "";
                phone.value = "";
            }

            //Tạo user mói ở auth, lấy uid trả về tạo 1 doc lưu thông tin trong firestore (admins)
            const handleSubmit = async()=> {
                const admin = {
                    name: name.value,
                    phone: phone.value,
                    email: email.value,
                    password: password.value,
                    role: role.value,
                    createdAt: timestamp()
                }
                const res = await create(admin.email,admin.password);
                if(!errCreateUser.value){       //nếu tạo user + check form ko có lỗi gì
                    const uid = res.user.uid;
                    await set(uid,admin);
                    if(!error.value){
                        clearField();
                        alert(`Add new ${admin.role} succeed !`);
                    }
                }

            }

            const router = useRouter();
            const closeModal = ()=>{
                router.push({name: 'Teachers'})
            }
            
            return  {name,email,password,role,phone,
                    clearField,handleSubmit,closeModal,error,errCreateUser}
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