<template>
    <div class="teachers page">
        <div class="teachers-display">
            <div class="teachers-nav">
                <h3>Teachers</h3>
                <button class="btn-create btn waves-effect waves-light red darken-4">
                    <router-link :to="{name: 'CreateTeacher'}">create</router-link>
                </button>
            </div>
            <div class="teacher-container" v-if="admins">
                <div class="main-container">
                    <h4 class="title">Main Teachers</h4>
                    <TeacherList :admins="filterTeachers" @update="updateTeacher" @remove="removeTeacher"/>
                </div>
                <div class="mentor-container">
                    <h4 class="title">Mentors</h4>
                    <TeacherList :admins="filterMentors" @update="updateTeacher" @remove="removeTeacher"/>
                </div>
            </div>
            <div v-else>
                <Loading/>
            </div>
            <div v-if="err1" class="error-message">{{err1}}</div>
        </div>

        <div class="form">
            <router-view></router-view>
        </div>

    </div>
</template>

<script>
import {ref,computed} from 'vue'
import {useRouter} from 'vue-router'
import TeacherList from '@/components/Teachers/TeacherList.vue'
import getCollectionRT from '@/composable/getCollectionRT'
import removeDoc from '@/composable/removeDoc'
import removeUser from '@/composable/removeUser'
import useLogout from "@/composable/useLogout"
import Loading from '@/components/Loading.vue'
import {projectAuth,projectFunctions} from '@/firebase/config'
import {useStore} from 'vuex'
export default {
    components: {
        TeacherList,Loading
    },
    //fetch all admin
    setup() {
        const {documents : admins, error} = getCollectionRT("admins");

        //Filtering teacher and mentor
        const filterTeachers = computed(()=>{
            return admins.value.filter((ad) => {
                return ad.role == "Teacher"
            })
        })
        const filterMentors = computed(()=>{
            return admins.value.filter((ad) => {
                return ad.role == "Mentor"
            })
        })


        //handle button click from teacher list
        const router = useRouter();
        const store = useStore();
        const {logout, error: errLogout} = useLogout();
        const isAdmin = computed(()=> store.getters['user/getIsAdmin']);
        const currentUserID = computed(()=> store.getters['user/getCurrentUser'].uid);
        console.log("🚀 ~ file: Teachers.vue ~ line 70 ~ currentUserID", currentUserID.value)
        
        const updateTeacher = (adminID)=>{   //adminID là id của thẻ teacher truyền lên
            router.push({name: 'UpdateTeacher',params : {id:adminID}});


        }

        const {error: err1, remove} = removeDoc("admins")
        const deleteUser = projectFunctions.httpsCallable('deleteUser')

        const removeTeacher = async(params)=>{
            const currentUid = currentUserID.value;
            if(currentUid == params.id){  // tức tự xóa chính mình
                const checkDelete = confirm("You are about to delete yourself. Continue?");
                if(checkDelete){
                        //remove doc trước đã, vì vẫn còn đăng nhập
                        await remove(params.id);
                        if(!err1.value){
                            await deleteUser({uid: params.id});
                            logout();
                            router.push({name: 'Welcome'})
                        }
                }
            }else{
                const checkDeleteOther = confirm("This is not your account. Continue delete?");
                if(checkDeleteOther){
                        //remove doc trước đã, vì vẫn còn đăng nhập
                        await remove(params.id);
                        if(!err1.value){
                            await deleteUser({uid: params.id});
                            router.push({name: "Teachers"});
                            alert("remove other teacher succeed!")
                        }
                }
            }

        }

        
        return {admins, error, filterTeachers, filterMentors,
                updateTeacher,removeTeacher,err1}
      
    }
}
</script>

<style lang="scss" scoped>
    .teachers {
        display: flex;
        width: 100%;
        height: 100%;

    }
    .teachers-display{
        width: 60%;
        & > *{
            &:not(:last-child){
                margin-bottom: 25px;
            }
        }
    }
    .teachers-nav{
        display: flex;
        align-items: flex-end;
        
        & > *{
            margin-right: 20px;
        }
    }

    //NAV
    .form{
        width: 40%;
        display: flex;
        flex-direction: column;
        justify-content: center;

    }
    .btn-create{
        border-radius: 10rem;
        text-transform: lowercase;
        font-family: "Averta Semi Bold";
        font-size: 15px;
        & a{
            color: white;
        }
    }

    //CONTAINER
    .teacher-container{
        display: flex;
        flex-direction: column;
        height: 80%;
        & > *{
            margin-bottom: 25px;
        }
    }

    .main-container{
        flex-grow: 1;
    }
    .mentor-container{
        flex-grow: 1;
    }
    .title{
        margin-bottom: 25px;
    }

</style>