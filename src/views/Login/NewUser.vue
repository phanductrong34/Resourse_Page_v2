<template>
    <div class="new-user">
        <div class="redball redball-1"></div>
        <div class="redball redball-2"></div>
        <div class="redball redball-3"></div>
        <div class="new-container">
                <form @submit.prevent="handleSubmit" v-if="userData">
                    <div class="row center new-title">
                        <h3 class="new-hello"> Hello {{userData.nickname}} 👋</h3>
                        <h5 class="new-welcome">Welcome to Umater <br> Advanced Animation Course</h5>
                        <h5 class="new-para">Take your time to update some info...</h5>
                    </div>

                    <div class="row">
                        <div class="input-field col s12">
                            <input id="new-fullname" type="text" class="validate" v-model="fullname" required>
                            <label class="active"  for="new-fullname">Full name</label>
                        </div>
                    </div>   
                    <div class="row">
                        <div class="input-field col s12">
                            <input id="new-phone" type="text" class="validate" v-model="phone" required>
                            <label class="active"  for="new-phone">Phone</label>
                        </div>
                    </div>  
                    <div class="row">
                        <div class="input-field col s12">
                            <input id="new-password" type="password" class="validate" v-model="password" required>
                            <label class="active"  for="new-password">New Password</label>
                        </div>
                    </div>  
                    <div class="row" v-if="error"> 
                        <p class="error-message center" >{{error}}</p>
                    </div>
                    <div class="row" v-if="errUpdate"> 
                        <p class="error-message center" >{{errUpdate}}</p>
                    </div>
                    <div class="row center new-button">
                        <div class="col s6 offset-s3">
                            <button class="new-btn waves-effect waves-light btn red darken-4 button-submit"><i class="material-icons left">add</i>Let's start 💪</button>
                        </div>
                    </div>
                </form>
        </div>
        <img class="new-laptop" src="@/assets/png/laptop.svg" alt="">
    </div>
</template>

<script>
    import {ref,computed} from 'vue'
    import { onBeforeRouteLeave } from 'vue-router'
    import {useStore} from 'vuex'
    import {projectAuth} from '@/firebase/config'
    import updateDoc from '@/composable/updateDoc'
    import {useRouter} from 'vue-router'
    import { useToast } from "vue-toastification";

    export default {
        setup(){
            const store = useStore();
            const userData = computed(()=> store.getters['user/getUserData'] || null)

            const router = useRouter();
            const toast = useToast();
            const {error :errUpdate, update} = updateDoc("students");

            const error = ref(null);
            const fullname = ref("");
            const phone = ref("");
            const password = ref("");
            
            const handleSubmit = (async()=>{
                error.value= null;
                errUpdate.value = null;
                if(fullname.value.length > 30){
                    error.value ="Are you trying to spam :)))";
                }else if(isNaN(phone.value) &&  phone.value.length < 10 && phone.value.length > 11){ 
                    error.value = "Invalid phone number format"
                }else{
                    projectAuth.currentUser.updatePassword(password.value)
                    .then(()=>{
                        if(!errUpdate.value && !error.value){
                            //console.log("handle sublmit") 
                            update(projectAuth.currentUser.uid,{
                                fullname: fullname.value,
                                phone: phone.value
                            }).then(()=>{
                                toast.success("Update new info success!");
                                // thêm cả vào user data ở store
                                store.dispatch('user/updateNameAndPhone',{phone: phone.value, fullname: fullname.value});
                                router.push({name: 'User'});
                            })
                        }
                    })
                    .catch((err)=>{
                        console.log("🚀 ~ file: NewUser.vue ~ line 65 ~ err", err.message)
                        error.value = err.message;
                    })

                }

            })

//////////// PREVENT BACK TO Welcome
            onBeforeRouteLeave((to, from, next) => {
                if (to.name == "Welcome") {
                    next(false)
                } else {
                    next();
                }
            })
            return {userData, fullname,phone,password,handleSubmit,error,errUpdate}

        }
    }
</script>

<style lang="scss" scoped>
.new-user{
    width: 100vw;
    height: 100vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}
.new-laptop{
    position: absolute;
    left: -11%;
    bottom: -2%;
    width: 37%;
}
.new-container{
    width: 30%;
    min-width: 35rem;
    background-color: white;
    position: relative;
    padding: 1rem 2rem 1rem 2rem;
    border-radius: 2rem;
    // @include card-shadow;
}
.new{
    &-title{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    &-hello{
        font-size: 4rem;
        color: $color-primary;
        margin-bottom: 1rem;
    }
    &-welcome{
        font-size: 2rem;
        padding: 0.5rem 2rem 0.5rem 2rem;
        border-radius: 0.5rem;
        background-color: $color-primary;
        color: white;
        margin-bottom: 1.2rem;
    }
    &-para{
        margin-bottom: 3rem;
        color: $color-gray-dark;
    }
    &-btn{
        font-family: "Averta Bold";
    }

}

.redball{
    background-color: $color-primary;
    position: absolute;
    border-radius: 50%;
    &-1{
        bottom: -18%;
        left: -10%;
        width: 40rem;
        height: 40rem;
    }
    &-2{
        top: -45%;
        right: -17%;
        width: 40rem;
        height: 40rem;
    }
    &-3{
        bottom: -10%;
        right: 7%;
        width: 10rem;
        height: 10rem;
    }
}
</style>