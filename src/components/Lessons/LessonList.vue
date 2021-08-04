<template>
    <div class="lesson-list overflowList">
        <div :class="[{unlock : checkUnlock(lesson.number)},'lesson-card']" 
            v-for="lesson in orderLessons" :key="lesson.id"
            @click="$emit('toggleLesson',lesson.number)"
        >
            <p>lesson {{lesson.number}} </p>
            <i class="lesson-icon material-icons" v-if="!checkUnlock(lesson.number)">lock</i>
        </div>
    </div>
</template>

<script>
    import {computed} from 'vue'
    import _ from 'lodash'
    export default {
        props:['lessons','unlockLessons'],
        setup(props) {
            const orderLessons = computed(()=>{
                return _.orderBy(_.get(props,'lessons'),'number','asc');
            });
            const checkUnlock = (number)=>{

                return props.unlockLessons.includes(Number(number))
            }
            return {orderLessons,checkUnlock}
        }
    }
</script>

<style lang="scss" scoped>
.lesson-list{
    display: flex;
    padding: 1.5rem 0 1.5rem 0rem;
    width: 100%;
    overflow-x: visible;
    overflow-y: hidden;
}
.lesson-card{
    min-height: 4rem;
    min-width: 8.2rem;
    background-color: $color-orange;
    margin-right: 1rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    position: relative;
    font-size: 1.3rem;
    cursor: pointer;
    @include transition;
    &:hover{
        transform: scale(1.05);
    }
    &.unlock{
        background-color: $color-green;
    }
}
.lesson-icon{
    position: absolute;
    top: 12%;
    right: 5%;
    font-size: 1rem;
}
</style>