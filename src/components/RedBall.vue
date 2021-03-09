/*
    <RedBall :mode="redBallMode"/>
    Nhận vào 1 số, đc computed thành mode + số gán vào class
    Đổi style dựa vào class là mode1, mode2 hay mode3
 */

<template>
    <div class="red-ball">
        <span :class="['ball1', modeComputed]"></span>
        <span :class="['ball2', modeComputed]"></span>
        <span :class="['ball3', modeComputed]"></span>
        <span :class="['ball4', modeComputed]"></span>
    </div>
</template>

<script>
import { computed,watch } from "vue";
import {useRoute} from 'vue-router';
export default {
    props: ["mode"],
    setup(props) {
        // truyền vào 1 ==> mode1
        const modeComputed = computed(() => {
            return "mode" + props.mode;
        });

        const route = useRoute();
        
        return { modeComputed };
    },
};
</script>

<style lang="scss" scoped>
.red-ball {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    pointer-events: none;
}
.red-ball span {
    display: inline-block;
    border-radius: 50%;
    position: absolute;

    background: $color-primary;
    transition: 0.6s cubic-bezier(.73,-0.44,.24,1.52);
    // transition: 0.1s ease;
}
//MODE 1
.ball1.mode1 {
    top: -12%;
    right: 0%;
    left: 6%;
    bottom: 0%;
    width: 15rem;
    height: 15rem;
}
.ball2.mode1 {
    right: 0%;
    left: 37%;
    bottom: -27%;
    width: 30rem;
    height: 30rem;
}
.ball3.mode1 {
    top: 48%;
    left: 169%;
    right: 0%;
    bottom: 0%;
    width: 5rem;
    height: 5rem;
}
.ball4.mode1 {
    top: 8%;
    left: 42%;
    right: 0%;
    bottom: 0%;
    width: 0rem;
    height: 0rem;
}

//MODE 2
.ball1.mode2 {
    top: -6%;
    right: 0%;
    left: -22%;
    bottom: 0%;
    width: 55rem;
    height: 55rem;
}
.ball2.mode2 {
    right: 20%;
    left: 67%;
    bottom: -25%;
    width: 17rem;
    height: 16rem;
}
.ball3.mode2 {
    top: -6%;
    left: 80%;
    right: 0%;
    bottom: 0%;
    width: 55rem;
    height: 55rem;
}
.ball4.mode2 {
    top: 8%;
    left: 42%;
    right: 0%;
    bottom: 0%;
    width: 0rem;
    height: 0rem;
}
//MODE 3
.ball1.mode3 {
    top: -6%;
    right: 0%;
    left: -18%;
    bottom: 0%;
    width: 55rem;
    height: 55rem;
}
.ball2.mode3 {
    right: 21%;
    left: 74%;
    bottom: -22%;
    width: 22rem;
    height: 22rem;
}
.ball3.mode3 {
    top: -6%;
    left: 80%;
    right: 0%;
    bottom: 0%;
    width: 25rem;
    height: 25rem;
}
.ball4.mode3 {
    top: 1%;
    left: 37%;
    right: 0%;
    bottom: 0%;
    width: 9rem;
    height: 9rem;
}


</style>