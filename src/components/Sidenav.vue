<template>

    <div class="Sidenav">   
            <!-- nhấtđịnh phải đúng tên của component thì nó mới hiện cơ -->
            <div class="logo-container">
                <a href="https://umaster.edu.vn/">
                    <img class="logo" src="@/assets/png/logo-animation.png" target="_blank" alt="">
                </a>
            </div>
            <div class="main-container">
                <ul class="router">
                    <li @click="changeBallMode(1)"><router-link :to="{name: 'ClassManage'}">Class Manage</router-link></li>
                    <li @click="changeBallMode(2)"><router-link :to="{name: 'Courses'}">Courses</router-link></li>
                    <li @click="changeBallMode(3)"><router-link :to="{name: 'Resource'}">Resource</router-link></li>
                    <li @click="changeBallMode(4)"><router-link :to="{name: 'Teachers'}">Teacher</router-link></li>
                </ul>
                <div class="signout-container">
                    <div class="lottie" data-file="laptop"></div>
        
                    <h6>Back to login page</h6>
                    <a class="btn red darken-4 waves-effect waves-light" href="#" @click="signIn">
                        <i class="material-icons left">power_settings_new</i>
                        Sign Out
                    </a> 
                </div>
                <div class="attribute-container">
                    <a href="https://www.facebook.com/profile.php?id=100007780805626" target="_blank">@pdtrong2020</a>
                </div>
            </div>


    </div>
    
    <RedBall :mode="redBallMode"/>

</template>

<script>
import RedBall from '@/components/RedBall'
import lottie from 'lottie-web'
import {onMounted, ref} from 'vue'
//development 
import useLogin from '@/composable/useLogin'
 
export default {
    components: {
        RedBall
    },
    setup() {
    //Chuyển style cho red-ball bằng cách 
    //click vào các router-link thì trigger đổi số mode truyền vào cho <RedBall/>
        const redBallMode = ref(1);
        const changeBallMode = (num) => {
            redBallMode.value = num
        }

    //SETUP lottieJs cho bunny
        onMounted(()=>{
            lottie.loadAnimation({
                container: document.querySelector(".lottie"), // the dom element that will contain the animation
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '../../assets/anim/bunny-laptop.json' // the path to the animation json
            });

        })


        //development purpose
        const {error, login} = useLogin()
        const signIn = async()=>{
            const user = await login("phanductrong.glb@gmail.com",'123456789')
            if(!error.value){
                console.log("login succedddd at nav")
            }
        }

        return {redBallMode,changeBallMode,signIn}
    }
}
</script>

<style lang="scss" scoped>
.Sidenav{
    display:flex;
    background-color: $color-primary;
    align-items: flex-end;
    justify-content: center;
    width: 15%;
    min-width: 256px;
    @include nav-drop;
    position: relative;
    z-index: 0;

}
.logo-container{
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;

    a{
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover{
            
        }
        
    }
    img{
        max-width:120%;
        max-height:120%;
        
    }
}
.main-container{
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    background-color: white;
    padding: 2rem; 
    height: 87%;
    width: 100%;
    border-radius: 2rem 2rem 0 0 ;
    position: relative;
    z-index: 0;

}
.router{

    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: left;
    font-size: 1.3rem;
    // font-family: "Averta Bold";
    li{
        padding: 0.5rem 0; 
        a{
            &,
            &:link,
            &:visited{
                color: $color-gray-light-1;
                transition: 0.2s ease-in-out;
            }
            
            &:hover{
                color: $color-gray-dark;
            }
        }
    }
}
.router li a.router-link-active{
    color: $color-primary;
    position: relative;
    font-size: 1.5rem;
    
    &::before{
        content: "";
        display: inline-block;
        width: 5px;
        height: 100%;
        position: absolute;
        top: 0;
        left: -1rem;
        background-color:$color-primary;
    }
}

.signout-container{
    @include card-shadow;
    width: 100%;
    padding: 1.8rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 1rem;
    position: relative;
    background-color: $color-white;

    & > *{
        &:not(:last-child){
            margin-bottom: 1rem;
        }
    }
    h6{
        font-size: 1rem;
    }
}
.btn{
    border-radius: 0.5rem;
    i{
        margin-right: 7px;
    }
}

.lottie{
    position: absolute;
    width: 11rem;
    top: -31%;
    left: 50%;
    transform: translate(-50%,-50%) scale(1.5);
    z-index: -2; 
}

.attribute-container{
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%,-50%);

    & a{
        &,
        &:link,
        &:focus{
            color: $color-gray-light-1
        }
    }
    
    
}



</style>

