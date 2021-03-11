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
//MODE 4
.ball1.mode4 {
    top: -12%;
    right: 0%;
    left: 6%;
    bottom: 0%;
    width: 15rem;
    height: 15rem;
}
.ball2.mode4 {
    right: 0%;
    left: 72%;
    bottom: -22%;
    width: 20rem;
    height: 20rem;
}
.ball3.mode4 {
    top: -24%;
    left: 73%;
    right: 0%;
    bottom: 0%;
    width: 47rem;
    height: 47rem;
}
.ball4.mode4 {
    top: 1%;
    left: 37%;
    right: 0%;
    bottom: 0%;
    width: 0rem;
    height: 0rem;
}

//////////////////////////////////////////////////////MODE 5
.ball1.mode5 {
    top: -12%;
    right: 0%;
    left: -4%;
    bottom: 0%;
    width: 15rem;
    height: 15rem;
}
.ball2.mode5 {
    right: 0%;
    left: 68%;
    bottom: -19%;
    width: 21rem;
    height: 21rem;
}
.ball3.mode5 {
    top: -28%;
    left: 67%;
    right: 0%;
    bottom: 0%;
    width: 41rem;
    height: 41rem;
}
.ball4.mode5 {
    top: 8%;
    left: 42%;
    right: 0%;
    bottom: 0%;
    width: 0rem;
    height: 0rem;
}
//////////////////////////////////////////////////////MODE 6
.ball1.mode6 {
    top: -12%;
    right: 0%;
    left: -4%;
    bottom: 0%;
    width: 15rem;
    height: 15rem;
}
.ball2.mode6 {
    right: 0%;
    left: 92%;
    bottom: -17%;
    width: 13rem;
    height: 13rem;
}
.ball3.mode6 {
    top: -20%;
    left: 83%;
    right: 0%;
    bottom: 0%;
    width: 31rem;
    height: 31rem;
}
.ball4.mode6 {
    top: 8%;
    left: 42%;
    right: 0%;
    bottom: 0%;
    width: 0rem;
    height: 0rem;
}
//////////////////////////////////////////////////////MODE 7
.ball1.mode7 {
    top: -12%;
    right: 0%;
    left: -4%;
    bottom: 0%;
    width: 15rem;
    height: 15rem;
}
.ball2.mode7 {
    right: 0%;
    left: 92%;
    bottom: -17%;
    width: 13rem;
    height: 13rem;
}
.ball3.mode7 {
    top: -20%;
    left: 83%;
    right: 0%;
    bottom: 0%;
    width: 31rem;
    height: 31rem;
}
.ball4.mode7 {
    top: 8%;
    left: 42%;
    right: 0%;
    bottom: 0%;
    width: 0rem;
    height: 0rem;
}
//////////////////////////////////////////////////////MODE 0
.ball1.mode0 {
    top: -12%;
    right: 0%;
    left: -4%;
    bottom: 0%;
    width: 15rem;
    height: 15rem;
}
.ball2.mode0 {
    right: 0%;
    left: 112%;
    bottom: -27%;
    width: 3rem;
    height: 3rem;
}
.ball3.mode0 {
    top: -80%;
    left: 153%;
    right: 0%;
    bottom: 0%;
    width: 1rem;
    height: 1rem;
}
.ball4.mode0 {
    top: 8%;
    left: 42%;
    right: 0%;
    bottom: 0%;
    width: 0rem;
    height: 0rem;
}
</style>