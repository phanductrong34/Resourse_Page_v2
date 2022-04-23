<template>
    <div class="teachers page">
        <div class="teachers-display">
            <div class="teachers-nav">
                <h3>Teachers</h3>
                <button class="btn-create btn waves-effect waves-light red darken-4" v-if="isAdmin">
                    <router-link :to="{name: 'CreateTeacher'}">create</router-link>
                </button>
            </div>
            <div class="teacher-container" v-if="admins">
                <div class="main-container">
                    <h4 class="title">Admin</h4>
                    <TeacherList v-if="filterAdmins.length" :admins="filterAdmins" @update="updateTeacher" :currentID="currentID" :isAdmin="isAdmin"/>
                    <div v-else><NoData :data="'teachers'"/></div>
                </div>
                <div class="mentor-container">
                    <h4 class="title">Teachers</h4>
                    <TeacherList v-if="filterTeachers.length" :admins="filterTeachers" @update="updateTeacher" :currentID="currentID" :isAdmin="isAdmin"/>
                    <div v-else><NoData :data="'teachers'"/></div>
                </div>
            </div>
            <div v-else>
                <Loading/>
            </div>
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
import {useStore} from 'vuex'
import getUser from '@/composable/getUser'
import { useToast } from "vue-toastification";
export default {
    components: {
        TeacherList
    },
    //fetch all admin
    setup() {
        const toast = useToast()
        const {documents : admins, error} = getCollectionRT("admins");

        //Filtering teacher and mentor
        const filterAdmins = computed(()=>{
            return admins.value.filter((ad) => {
                return ad.role == "admin"
            })
        })
        const filterTeachers = computed(()=>{
            return admins.value.filter((ad) => {
                return ad.role == "teacher"
            })
        })


        //handle button click from teacher list
        const router = useRouter();
        const store = useStore();
        const {user,isAdmin,isTeacher} = getUser();
        const currentID = computed(()=> user.value.uid);

        const updateTeacher = (adminID)=>{   //adminID là id của thẻ teacher truyền lên
            if(user.value.uid == adminID || isAdmin.value){
                router.push({name: 'UpdateTeacher',params : {id:adminID}});
            }
            else{
                toast.error("You don't have permission to access this page");
                router.push({name:'Teachers'})
            }
        }

        return {admins, error, filterTeachers, filterAdmins,isTeacher,isAdmin,isTeacher,currentID,
                updateTeacher}
      
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