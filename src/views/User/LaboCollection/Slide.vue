<template>
    <div class="lesson-slide">
        <div v-if="slideURL" class="slide-container">
            <iframe class="slide-frame" :src="slideURL+'/embed'" 
                    width="576" height="420" scrolling="no" frameborder="0" 
                    webkitallowfullscreen mozallowfullscreen allowfullscreen>
            </iframe>
        </div>
        <Loading v-else />
    </div>
</template>

<script>
import { computed} from 'vue'
import {useStore} from 'vuex'
import _ from 'lodash'
import { onBeforeRouteLeave } from 'vue-router'
    export default {
        props:['id'], //Là id của lesson
        setup(props) {
            const store = useStore();
            const filterList = computed(()=> store.getters['lessons/getFilterList'] || []);

            const slideURL = computed(()=>{
                if(filterList.value.length){
                    const activeLesson = filterList.value.find((lesson)=>{
                        return lesson.id == props.id;
                    })
                    return _get(activeLesson, "slideURL");
                }else return null;
            })

            onBeforeRouteLeave((to, from, next) => {
                if (to.name == 'Laboratory') {
                    next(false)
                } else {
                    next();
                }
            })

            return {slideURL}
        }
    }
</script>

<style lang="scss" scoped>
.lesson-slide{
    width: 94%;
    height: 82%;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(0,-50%);
    border-radius: 4rem 0 0 4rem;
    @include card-shadow;
    background-color: white;
    z-index: 1;
    padding: 2rem 16rem 2rem 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    
}
.slide-container{
    width: 100%;
    height: 90%;
    overflow: hidden;
}
.slide-frame{
    width: 100%;
    height: 108%;

}
</style>