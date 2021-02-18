/*
    <RedBall :mode="redBallMode"/>
    Nhận vào 1 số, đc computed thành mode + số gán vào class
    Đổi style dựa vào class là mode1, mode2 hay mode3
 */

<template>
    <div class="red-ball">
        <span :class="['ball1', modeComputed]"></span>
        <span :class="['ball2', modeComputed]"></span>
    </div>
</template>

<script>
import { computed } from "vue";
export default {
    props: ["mode"],
    setup(props) {
        // truyền vào 1 ==> mode1
        const modeComputed = computed(() => {
            return "mode" + props.mode;
        });
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
    transition: 0.3s ease-in-out;
}
//MODE 1
.ball1.mode1 {
    top: -230px;
    right: -250px;
    width: 50rem;
    height: 50rem;
}
.ball2.mode1 {
    bottom: -150px;
    right: 200px;
    width: 22rem;
    height: 22rem;
}


//MODE 2
.ball1.mode2 {
    top: -100px;
    right: -500px;
    width: 30rem;
    height: 30rem;
}
.ball2.mode2 {
    bottom: -500px;
    right: 100px;
    width: 50rem;
    height: 50rem;
}

//MODE 3
.ball1.mode3 {
    top: -100px;
    right: -500px;
    width: 30rem;
    height: 30rem;
}
.ball2.mode3 {
    bottom: -500px;
    right: 100px;
    width: 50rem;
    height: 50rem;
}

</style>