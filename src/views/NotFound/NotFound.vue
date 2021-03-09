<template>
    <div class="not-found">
        <div class="bunny-hori"></div>
        <div class="bunny-corner"></div>
        <div class="moon"></div>
        <img class="text" src="@/assets/png/404-text.svg" alt="">
    </div>
</template>

<script>
    import {onMounted} from 'vue'
    import lottie from 'lottie-web'
    export default {
        setup(props) {

        onMounted(()=>{
            lottie.loadAnimation({
                container: document.querySelector(".bunny-hori"), // the dom element that will contain the animation
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '../../assets/anim/404-bunny-hori.json' // the path to the animation json
            });
            lottie.loadAnimation({
                container: document.querySelector(".bunny-corner"), // the dom element that will contain the animation
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '../../assets/anim/404-bunny-corner.json' // the path to the animation json
            });
            lottie.loadAnimation({
                container: document.querySelector(".moon"), // the dom element that will contain the animation
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '../../assets/anim/404-moon.json' // the path to the animation json
            });

        })
            
        }
    }
</script>

<style lang="scss" scoped>
    .not-found{
        width: 100vw;
        height: 100vh;
        background-image: url('/assets/png/404-bg.svg');
        background-size: cover;
        position: relative;
    }
    .text{
        width: 40%;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(-22%,-50%);
    }
    .bunny-hori{
        position: absolute;
        width: 30%;
        bottom: 0;
        right: 0;
    }
    .bunny-corner{
        position: absolute;
        width: 100vw;
        top: 0;
        right: 0;
    }
    .moon{
        position: absolute;
        width: 50%;
        bottom: 0;
        left: 0;
    }
</style>