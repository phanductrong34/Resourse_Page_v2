<template>
    <router-link 
        v-if="unlockObject[number]" 
        :to="{name: 'LessonUser', params:{number}}">
            <div class="lesson-card">
                <span :class="[{active : currentWorksLength},'lesson-icon']">
                    <i v-if="currentWorksLength" class="material-icons">check</i>
                    <i v-else class="material-icons">close</i>
                </span>
                <Image class="lesson-thumb" :refUrl="unlockObject[number].thumbnailRef"/>
                <div class="lesson-info">
                    <h5 class="lesson-title">Lesson {{number}}</h5>
                    <p class="lesson-name">{{unlockObject[number].name}}</p>
                    <div class="lesson-tags">
                        <span class="lesson-tag" v-for="tag in unlockObject[number].tags" :key="tag">
                            {{tag}}
                        </span>
                    </div>
                </div>
            </div>
    </router-link>

    <div class="lesson-card lock" v-else>
        <span class="lesson-icon"><i class="material-icons">lock</i></span>
            <h5>Unlock Soon...</h5>
    </div>
</template>

<script>
    import {useStore} from 'vuex'
    import {ref, computed} from 'vue'
    export default {
        props:['number','filterList','unlockObject'],
        setup(props) {
            // lấy works của bài này tại vuex, nếu length > 0 thì là đã hoàn thành 
            const store = useStore();
            const currentWorks = computed(()=> store.getters['works/getWorks'](props.number) || []);
            const currentWorksLength = computed(()=> currentWorks.value.length);
    
            return {currentWorksLength}

        }
    }
</script>

<style lang="scss" scoped>
.lesson{
    &-container{
        width: 82%;
        
    }
    &-card{
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 8rem;
        padding: 0.5rem 1rem 0.5rem 1rem;
        background-color: white;
        @include card-shadow;
        margin-bottom: 1.2rem;
        border-radius: 1rem;
        position: relative;
        @include transition;
        &:hover{
            transform: scale(1.05);
        }
    }
    &-icon{
        position:absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: 1.2rem;
        height: 1.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        @include transition;
        background-color: $color-orange;
        color: white;
        & i{
            font-size: 1rem;
        }
        &.active{
            background-color: $color-green;
        }
    }
    &-thumb{
        width: 30%;
         margin-right: 1rem;
    }
    &-info{

    }
    &-title{
        color: black;
    }
    &-name{
        color: $color-gray-dark;
        margin-bottom: 0.4rem;
    }
    &-tags{
        display: flex;
        flex-wrap: wrap;
    }
    &-tag{
        display: inline-block;
        padding: 0.2rem 0.8rem 0.2rem 0.8rem;
        border-radius: 5rem;
        background-color: $color-orange;
        color: white;
        font-size: 0.9rem;
        margin-right: 0.3rem;
    }
}
.lesson-card.lock{
    background-color: $color-orange;
    cursor: not-allowed;
    justify-content: center;
    color: white;
    & .lesson-icon{
        background-color: transparent;
    }
}
.router-link-active .lesson-card{
    transform: scale(1.1);
    &:hover{
        transform: scale(1.1);
    }
}
</style>