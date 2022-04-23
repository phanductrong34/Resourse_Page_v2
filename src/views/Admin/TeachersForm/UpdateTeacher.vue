<template>
    <div class="card card-admin" v-if="admin">
        <form @submit.prevent="handleSubmit" v-if="isExactUser || isAdmin">
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
                    <input id="admin-phone" type="text" class="validate" v-model="phone" required>
                    <label class="active"  for="admin-password">Phone Number</label>
                </div>
            </div>
            <div class="row" v-if="err2">
                <div class="center error-message">{{err2}}</div>
            </div>
            <div class="row" v-if="error">
                <div class="center error-message">{{error}}</div>
            </div>
            <div class="row" v-if="isAdmin && role=='teacher'">
                <div class="col s4">
                    <button @click.prevent="handleSubmit" class="waves-effect waves-light btn  teal lighten-2"><i class="material-icons left">edit</i>Edit</button>
                </div>
                <div class="col s4" @click.prevent="removeTeacher">
                    <button class="waves-effect waves-light btn red darken-4"><i class="material-icons left">delete</i>Del</button>
                </div>
                <div class="col s4">
                    <button class="waves-effect waves-light btn grey lighten-1" @click.prevent="clearField"><i class="material-icons left">cancel</i>Clear</button>
                </div>
            </div>
            <div class="row" v-else>
                <div class="col s6">
                    <button @click.prevent="handleSubmit" class="waves-effect waves-light btn  teal lighten-2"><i class="material-icons left">edit</i>Edit</button>
                </div>
                <div class="col s6">
                    <button class="waves-effect waves-light btn grey lighten-1" @click.prevent="clearField"><i class="material-icons left">cancel</i>Clear</button>
                </div>
            </div>
        </form>
        <div v-else>
            <h4>You don't have permission to update this data</h4> 
        </div>

    </div>
    <div v-else>
        <Loading/>
    </div>
    <div v-if="err1" class="error-message">{{err1}}</div> 
</template>

<script>
    import {ref, onMounted,watchEffect,watch,computed} from 'vue'
    import {useRouter} from 'vue-router'
    import {timestamp,projectFunctions} from '@/firebase/config'
    import removeDoc from '@/composable/removeDoc'
    import getUser from '@/composable/getUser'
    import getDoc from '@/composable/getDoc'
    import updateUser from '@/composable/updateUser'
    import updateDoc from '@/composable/updateDoc'
    import {useStore} from 'vuex'
    import {useRoute} from 'vue-router'
    import { useToast } from "vue-toastification";
    export default {
        props: ['id'],
        components: {
        },
        setup(props) {
            const store = useStore();
            const toast = useToast();


            //CHECK XEM UPDATE THÔNG TIN CÓ PHẢI ĐÚNG ADMIN ĐANG ĐĂNG NHẬP KO HAY CỐ TÌNH SỬA CỦA NGƯỜI KHÁC BẰNG NHẬP ID
            const {user,isAdmin} = getUser();
            // là chính mình thì trả về true
            const isExactUser = computed(()=> {
                if(user.value.uid == props.id || isAdmin.value) return true;
                else return false; 
            })


            // //SET UP FOR DROPDOWN INPUT
            // const loadSelect =()=> {
            //     $(document).ready(function(){
            //         $('select').formSelect();
            //     });
            // }
            // onMounted(() => {
            //     loadSelect();
            // })
            // watch(isAdmin,()=>{
            //     loadSelect()
            // })
            /////////////////////////////////

            //ref
            const error = ref(null);
            const nickname = ref("");
            const name = ref("");
            const role = ref("");
            const phone = ref("");

            //Fetch data cua admin có id đc truyền vào
            const {data : admin , error : err1, load} = getDoc("admins")

            watchEffect(()=>{
                load(props.id)
                    .then(()=>{
                        nickname.value = admin.value.nickname
                        name.value = admin.value.name
                        role.value = admin.value.role
                        phone.value = admin.value.phone
                    })
            })


            
            const clearField = ()=>{
                nickname.value = "";
                name.value = "";
                phone.value = "";
                error.value = null;
            }

            //update toàn bộ field vào đúng cái id cũ
            
            const {error: err2, update} = updateDoc("admins")
            const updateUser = projectFunctions.httpsCallable('updateUser')

            const router = useRouter();
            const handleSubmit = async()=> {
                if(!isAdmin.value){ // nếu ko phải admin
                    toast.warning("You are not admin");
                    return false;
                }   
                error.value = null;
                if(nickname.value.length > 6){
                    error.value = "Nickname must less than 7 character"
                }else{
                    let avaRef = null;
                    if(role.value == 'admin') avaRef = "teacher/ava-teacher.png"
                    else if(role.value == 'teacher') avaRef = "teacher/ava-mentor.png";

                    const newAdmin = {
                        avaRef,
                        nickname: nickname.value,
                        name: name.value,
                        phone: phone.value,
                        createdAt: timestamp()
                    }
                    // //update user ở auth = firebase admin 
                    // await updateUser({uid: props.id, email: newAdmin.email, password : password.value})
                    // update user doc ở firestore
                    await update(props.id,newAdmin);
                    if(!err2.value){
                        clearField();
                        toast.success(`${newAdmin.name} has been updated`);
                        router.push({name: 'Teachers'});
                    }
                }
            }


            //Delete Teacher (Only Admin)

            const removeTeacher = async()=>{
                // nếu ko phải admin và người bị xóa ko phải teacher thì return=> chăc chắn ko thể tự hủy rồi, hoặc các admin tàn sát lẫn nhau
                if(!isAdmin.value && role.value != 'teacher') return false;  
                const {error: err3, remove} = removeDoc("admins")
                const deleteUser = projectFunctions.httpsCallable('deleteUser')
                await remove(props.id);
                if(!err1.value){
                    await deleteUser({uid: props.id});
                    router.push({name: "Teachers"});
                    toast.success("Remove teacher successfully!")
                }
            }

            //closeUpdate
        
            const closeModal = ()=>{
                router.push({name: 'Teachers'})
            }
            
            return  {admin,name,nickname,role,phone, err1, err2,error,isExactUser,isAdmin,
                    clearField,handleSubmit,closeModal,removeTeacher}
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