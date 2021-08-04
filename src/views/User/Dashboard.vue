<template>
    <div class="page dashboard">
        <div class="left-section overflowList">
            <Loading v-if="!computedInfo" />
            <div class="course-container" v-else>
                <h3 class="course-title">Course Lesson</h3>
                <p class="course-info">{{computedInfo}}</p>
                <div class="course-active">
                    <span class="course-btn prev" @click="changeLesson('prev')"><i class="material-icons">chevron_left</i></span>
                    <p class="course-lesson">Lesson {{$route.params.number}}</p>
                    <span class="course-btn next" @click="changeLesson('next')"><i class="material-icons">chevron_right</i></span>
                </div>
            </div>
            <div class="lesson-container" v-if="lessonUnlock.length">
                <div v-for="number in lessonCount" :key="number">
                    <LessonCard :number="number" :filterList="filterList" :unlockObject="unlockObject" />
                </div>
            </div>
        </div>
        <div class="right-section overflowList" v-if="!firstLoad">
            <router-view></router-view>
        </div>
        <div class="right-section" v-else><Loading/></div>
    </div>
</template>

<script>
import LessonCard from '@/components/Lessons/LessonCard.vue'
import {useStore} from 'vuex'
import {useRouter, useRoute} from 'vue-router'
import {ref, computed,watch} from 'vue'
import _ from 'lodash'
    export default {
        components:{LessonCard},
        setup(props) {
            const store = useStore();
            const router = useRouter();

            const activeCourse = computed(() => store.getters['course/getCurrentCourse'] || null);
            const activeClass = computed(() => store.getters['class/getCurrentClass'] || null);
            const lessonCount = computed(()=> store.getters['lessons/getCount'] || 0);

            //list có data đã đc sort luôn
            const firstLoad = ref(true);
            // tận dụng việc load để chọn thời điểm push router(khi có params), và ngăn ko cho chại lại bằng biến firstLoad
            const filterList = computed(()=> {
               const list=  store.getters['lessons/getFilterList'] || [];
               if(firstLoad.value){
                   firstLoad.value = false
                   router.push({name: "LessonUser", params:{number: list[0].number}});
               }
               return list;
            }); 


            //biến lessonUnlock từ [1,2,3]  ==> {1:true, 2:true , 3:true}
            const lessonUnlock = computed(()=> store.getters['lessons/getUnlockList'] || []);      // list chỉ có số
            const unlockObject = computed(() => {
                const obj = {};
                if(filterList.value.length){
                    let i = 1;
                    for(i = 1; i <= lessonCount.value; i++){
                        if(lessonUnlock.value.includes(i)){  
                            obj[i] = filterList.value.find((lesson)=>lesson.number == i)
                        }else obj[i] = false;
                    }
                }
                    return obj
            })


            //////////////////   computed properties
            const computedCourseName = computed(()=> (activeCourse.value.name).toUpperCase() || null);

            const computedInfo = computed(()=>{
                if(activeClass.value){
                    const time1 = activeClass.value.timeOccur[0].date + ' - ' + activeClass.value.timeOccur[0].time;
                    const time2 = activeClass.value.timeOccur[1].date + ' - ' + activeClass.value.timeOccur[1].time;
                    return time1 + ' | ' + time2;
                }else return null
            })

            ////////////////  function
            const route = useRoute();
            const changeLesson = (mode)=> {
                const max = lessonUnlock.value.length-1;
                const current = Number(route.params.number);
                if(mode == 'prev' && current > 1){
                    router.push({name:"LessonUser",params:{number: current - 1}});
                }else if(mode == 'next' && current < max){
                    router.push({name:"LessonUser",params:{number: current + 1}});
                }
            }



            return {activeClass,lessonCount,filterList, changeLesson,firstLoad,
                    computedInfo,lessonUnlock,unlockObject}
        }
    }
</script>

<style lang="scss" scoped>
.dashboard{
    display: flex;
    width: 100%;
    height: 100%;
}
.left-section{
    width: 35%;
    height: 100vh;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow-y: auto;
}
.right-section{
    width: 65%;
    padding: 0 3rem 0 10rem;
}

// left-Section
.course{
    &-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;

    }
    &-title{
        margin-bottom: 0.4rem;
    }   
    &-info{
        color: $color-gray-light-1;
        margin-bottom: 1.5rem;
    }
    &-active{
        margin-bottom: 2rem;
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }
    &-lesson{
        font-size: 1.4rem;
        color:$color-primary;
    }
    &-btn{
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1px;
        border-radius: 50%;
        background-color: $color-primary;
        color:white;
        font-size: 0.8rem;
        cursor: pointer;
        @include transition;
        &:hover{
            transform: scale(1.1);
        }
        &.prev{
            margin-right: 1rem
        }
        &.next{
            margin-left: 1rem;
        }
    }
}
.lesson{
    &-container{
        width: 82%; 
    }
    
}
</style>