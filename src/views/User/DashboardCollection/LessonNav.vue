<template>
    <div class="lesson-nav">
        <div :class="[{active: activeTab == 'detail'},'lesson-tab']" @click="$emit('activateTab','detail')">Detail</div>
        <div :class="[{active: activeTab == 'assignment'},'lesson-tab']" @click="$emit('activateTab','assignment')">Assignment</div>
        <div :class="[{active: activeTab == 'resource'},'lesson-tab']" @click="$emit('activateTab','resource')">Resource</div>
        <div :class="[{done : hasWork},'homework-state']">
            <span v-if="hasWork">Completed</span> 
            <span v-else>Incompleted</span>
        </div>
    </div>
</template>

<script>
    import {ref} from 'vue'
    export default {
        props:['activeTab','hasWork'],
        setup(props) {
            
        }
    }
</script>

<style lang="scss" scoped>
    .lesson-nav{
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 2rem;
        font-size: 1.4rem;
        color: $color-gray-light-1;
        display: flex;
        justify-content: space-around;
    }

    .lesson-tab{
        font-size: 20px;
        color: $color-gray-light-1;
        cursor: pointer;
        transition: all 0.15s ease-in-out;
        &::before{
            content: "";
            position: absolute;
            left: 0;
            bottom: -1px;
            width: 0%;
            height: 3px;
            background-color: $color-primary;
            transition: all 0.15s ease-in-out
        }
    }

    .lesson-tab:hover{
        color: $color-gray-dark;
    }
    .lesson-tab.active:hover{
        color: darken($color-primary, 10);
    }
    .active{
        color: $color-primary;
        position: relative;
        &::before{
            width: 100%;
        }

    }
    .homework-state{
            padding: 0.2rem 1rem 0.2rem 1rem;
            border-radius: 0.4rem;
            cursor: pointer;
            color: white;
            background-color: $color-primary;
            @include transition;

        &.done{
            background-color: $color-green;
        }
    }
</style>