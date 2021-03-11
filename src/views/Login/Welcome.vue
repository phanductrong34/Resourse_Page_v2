<template>
    <div class="login">
        <div class="login-form">
            <div class="card login-card">
                <form @submit.prevent="handleSubmit">
                    <div class="logo">
                        <a href="https://umaster.edu.vn/" target="_blank"><img src="@/assets/png/login-logo.png" alt=""></a>
                    </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <input id="login-email" type="email" class="validate" v-model="email">
                                <label class="active"  for="login-email">Email</label>
                            </div>
                        </div>
                        <div class="row">
                            <div class="input-field col s12">
                                <input id="login-password" type="password" class="validate" v-model="password">
                                <label class="active"  for="login-password">Password</label>
                            </div>
                        </div>
                        <div class="row" v-if="error">
                            <div class="center error-message">{{error}}</div>
                        </div>
                        <div class="row" v-if="errLogin">
                            <div class="center error-message">{{errLogin}}</div>
                        </div>
                        <div class="row center">
                            <h6 class="no-account">No account yet? <a href="https://www.facebook.com/profile.php?id=100007780805626" target="_blank">Contact me</a> to join a class</h6>
                        </div>
                        <div class="row">
                            <button class="waves-effect waves-light btn red darken-4 btn-large">Log in</button>
                        </div>
                </form>
            </div> 
        </div>
        <div class="login-lottie">
        </div>
        <div class="login-background"></div>
    </div>
</template>

<script>
    import lottie from 'lottie-web'
    import {ref,onMounted} from 'vue'
    import {useRouter} from 'vue-router'
    import useLogin from '@/composable/useLogin'
    import useLogout from '@/composable/useLogout'
    import {useStore} from 'vuex'
    import getUser from '@/composable/getUser'
    export default {
        setup() {
            onMounted(()=>{
                var pageAnim = lottie.loadAnimation({
                    container: document.querySelector(".login-lottie"), // the dom element that will contain the animation
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: './assets/anim/login-page.json' // the path to the animation json
                });
                var backgroundAnim = lottie.loadAnimation({
                    name: "background",
                    container: document.querySelector(".login-background"), // the dom element that will contain the animation
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: './assets/anim/login-background.json' // the path to the animation json
                });
                backgroundAnim.setSpeed(0.2)
                pageAnim.setSpeed(1)

            })
            
            const email = ref("");
            const password = ref("");
            const {user,isAdmin} = getUser();  // dặt sẵn biến và khởi tạo 1 hàm onAuth ở đây đã để login hay logout gì nó cũng sẽ load lại user và check admin

            const router = useRouter();
            const error =ref(null);
            const {login, error : errLogin} = useLogin();
            const {logout, error :errLogout} = useLogout();
            const store = useStore();
            const handleSubmit = async () => {
                store.dispatch('user/resetUser');
                error.value = null;
                errLogin.value = null; 

                const res = await login(email.value,password.value);  //khi login đổi user thì onAuthStateChange ở main ko chạy, nhưng chạy trong getUser
                if(!errLogin.value){

                    //check emailVerified ở đây
                    if(!res.user.emailVerified){
                        res.user.sendEmailVerification().then(()=>{
                            error.value = "Please verified your email and login again"
                            logout();
                        })
                    }else{ // nếu đã verified
                        await store.dispatch('user/updateUserData',{user: user.value, isAdmin : isAdmin.value});
                        //console.log("dispatch success", user.value, isAdmin.value);
                        //login thành công và ko ném ra bất cứ lỗi nào
                        if(!error.value){
                            if(isAdmin.value){
                                router.push({name: 'ClassManage'});
                            }else if(store.getters['user/getUserData'].isNewUser){
                                await store.dispatch('user/updateNewUser');
                                router.push({name:'NewUser'});
                            }else{
                                router.push({name:'User'});
                            }
                        }
    
                    }

                }


            }
            return {handleSubmit,email,password,error,errLogin}
        }
        
    }
</script>

<style lang="scss" scoped>
    .login{
        width: 100vw;
        height: 100%;
        display: flex;
        align-items: center;
    }
    .login-form{
        width: 60%;
        display: flex;
    }
    .login-lottie{
        width: 40%;
        min-width: 600px;
        transform: scale(1.5) translateX(-16%);
        pointer-events: none;
    }
    .login-background{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 120%;
        height: 120%;
        background-color: $color-primary;
        z-index: -10;

    }

    //LOGIN_ CARD
    .login-card{
        position: relative;
        width: 55%;
        max-width: 600px;
        margin: 0 auto;
        padding: 90px 60px 60px 60px;
        border-radius: 20px;
        transform: translateX(-10%);
    }
    .logo{
        position: absolute;
        top: 0%;
        left: 50%;
        transform: translate(-50%,-50%);
        transition:transform 0.2s;

        &:hover{
            transform: translate(-50%,-50%) scale(1.1);
        }
        & img{
            width: 100px;
            height: 100px;
        }
        &::before{
            content: "";
            position: absolute;
            width: 120%;
            height: 115%;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: white;
            z-index: -1;
            border-radius: 20px;
            @include card-shadow
        }
    }
    .no-account{
        & a{
            font-family: "Averta Bold";
            text-decoration: underline;
        }
        margin-bottom: 10px;
    }
    button{
        width: 100%;
        font-family: "Averta Semi Bold";
        border-radius: 8px;
    }

</style>