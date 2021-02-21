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
            <div v-if="errRemoveAuth" class="error-message">{{errRemoveAuth}}</div>
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
import Loading from '@/components/Loading.vue'
import {projectAuth} from '@/firebase/config'
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
        const updateTeacher = (adminID)=>{
            const uid = projectAuth.currentUser.uid;
            if(uid == adminID){
                router.push({name: 'UpdateTeacher',params : {id:adminID}});
            }else{
                alert("You can not change data of other admin")
                // chỗ này làm route guard sẽ hay hơn
            }


        }

        const {error: err1, remove} = removeDoc("admins")
        const {error: errRemoveAuth, deleteUser} = removeUser();

        const removeTeacher = async(params)=>{
            const user = projectAuth.currentUser;
            const uid = projectAuth.currentUser.uid;
            if(uid === params.id){
                const input = String(prompt("Type admin's password to remove: "));
                if(input === params.password){
    
                    await deleteUser(user);
                    if(!errRemoveAuth.value){
                        await remove(params.id);
                        if(!err1.value){
                            router.push({name: 'Teachers'});
                            alert("Remove admin sucessful");
                        }
                    }
    
                }else{
                    alert("Wrong password, Failed to remove admin")
                }
            }else{
                alert("You can not remove others admin account")
            }

        }
        return {admins, error, filterTeachers, filterMentors,
                updateTeacher,removeTeacher,err1,errRemoveAuth}
      
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