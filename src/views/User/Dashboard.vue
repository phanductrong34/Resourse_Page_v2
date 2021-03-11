<template>
    <div class="page dashboard">
        <div class="left-section">
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
                    <router-link 
                        v-if="unlockObject[number]" 
                        :to="{name: 'LessonUser', params:{number}}">
                            <div class="lesson-card">
                                <span class="lesson-icon"><i class="material-icons">check</i></span>
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
import {useStore} from 'vuex'
import {useRouter, useRoute} from 'vue-router'
import {ref, computed,watch} from 'vue'
import _ from 'lodash'
    export default {
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
                const max = lessonUnlock.value.length;
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
.router-link-active .lesson-card{
    transform: scale(1.1);
    &:hover{
        transform: scale(1.1);
    }
}
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
        background-color: $color-green;
        color: white;
        & i{
            font-size: 1rem;
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
</style>