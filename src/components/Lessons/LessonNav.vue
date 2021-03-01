<template>
    <div class="lesson-nav">
        <h3 class="title">Lessons.</h3>
        <div class="nav-lesson" v-if="lessonCount && unlockCount">
            <div class="lesson-count">{{computedLesson}}</div>
            <div class="lesson-unlock-count">{{computedUnlock}}</div>

        </div>

    </div>
</template>

<script>
    import {ref,computed} from 'vue'
    export default {
        props: ['lessonCount','unlockCount'],
        setup(props) {
            const computedLesson = computed(()=>{
                if(props.lessonCount > 1) return props.lessonCount +' lessons';
                else return props.lessonCount +' lesson';
            })
            const computedUnlock = computed(()=>{
                if(props.unlockCount > 1) return props.unlockCount +' unlocks';
                else return props.unlockCount +' unlock';
            })
            return {computedLesson,computedUnlock}
        }
    }
</script>

<style lang="scss" scoped>
    .lesson-nav{
        display: flex;
        align-items: flex-end;
        & *{
            margin-right: 20px;
        }
    }  
    .nav-lesson{
        display: flex;
    }
    .lesson-count,.lesson-unlock-count{
        display: flex;
        margin-bottom: 5px;
        margin-right: 20px ;
        font-size: 20px;
        color: $color-gray-dark;
        cursor: pointer;
    }
</style>