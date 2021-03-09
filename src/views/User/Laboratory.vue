<template>
    <div class="page labo">
        <router-view/>
        <div class="lesson-list">
            <div class="lesson-container" v-for="lesson in lessons" :key="lesson.id" v-if="unlockLessons.length">

                <div class="lesson-link" 
                    v-if="checkUnlock(lesson.number)"
                    >
                        <router-link :to="{name:'Slide',params:{id:lesson.id}}">
                            <p>Lesson {{lesson.number}}</p>
                        </router-link>
                </div>

                <div class="lesson-lock" v-else>
                        <p>Lesson {{lesson.number}}</p>
                        <i class="material-icons">lock</i>
                </div>
            </div>
            <div class="loading" v-else>
                <Loading />
            </div>
        </div>


    </div>
</template>

<script>
    import {useStore} from 'vuex'
    import { computed,ref,watch, watchEffect, onMounted } from 'vue'
    import {useRouter} from 'vue-router'
    import _ from 'lodash'
    export default {
        setup(props) {
            const store = useStore();
            const router = useRouter();
            // load Lesson and add listener for change
           
            const lessons = computed(()=> _.orderBy(store.getters['lessons/getList'], ['number'],['asc']) || []);
            const unlockLessons = computed(()=> store.getters['lessons/getUnlockList'] || []);
            const count = computed(()=> lessons.value.length || 0);
            

            const checkUnlock = (number)=>{
                return unlockLessons.value.includes(Number(number))
            }

            onMounted(()=>{
                // nếu lần đầu có lesons và các lần đổi id ra các slide khác
                if(lessons.value.length && unlockLessons.value.length){
                    const activeID = store.getters['lessons/getLatestUnlockID'];
                    router.push({name: 'Slide', params:{id: activeID}});
                }
            });

            return {lessons,unlockLessons,count,checkUnlock}
        }
    }
</script>

<style lang="scss" scoped>
    .labo{
        position: relative;
        width: 100%;
        height: 100%;
    }
    .lesson-list{
        position: absolute;
        z-index: 1;
        top: 50%;
        right: 0;
        transform: translate(0,-50%);
        height: 68%;
        width: 14rem;
        background-color: $color-primary;
        @include card-shadow;
        border-radius: 4rem 0 0 4rem;

        display: flex;
        // padding: 2rem;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        
    }
    .lesson-container{
        display: flex;
        justify-content: center;
        font-size: 1.3rem;
        padding: 0.4rem 0 0.4rem 0;
    }
    .lesson-link{
        & p{
            color: white;
            padding: 0.2rem 0.8rem 0.2rem 0.8rem;
        }
        a.router-link-active{
            display: inline-block;
            @include transition;
            background: white;
            font-size: 1.6rem;
            border-radius: 0.4rem;
            & p{
                color: $color-primary;
            }

        }
    }

    .lesson-lock{
        display: flex;
        justify-content: center;
        color: white;
        opacity: 0.3;
        cursor: not-allowed;
        & p{
            margin-right: 0.5rem;
        }

    }

</style>