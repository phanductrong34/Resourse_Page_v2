<template>
    <div>
        <LessonNav :lessonCount="lessonCount" :unlockCount="unlockCount"/>
        <Loading v-if="isLoading"/>
        <LessonList v-else :lessons="lessons" :unlockLessons="unlockLessons"/>
        <NoData :data="'lessons'" v-if="noData"/>
    </div>
</template>

<script>
    import LessonNav from '@/components/Lessons/LessonNav.vue'
    import LessonList from '@/components/Lessons/LessonList.vue'
    import getCollectionFilter from '@/composable/getCollectionFilter'
    import getDoc from '@/composable/getDoc'
    import {computed, ref,watchEffect} from 'vue'

    export default {
        props: ['activeClassID', 'activeCourseID'],
        components: {
            LessonNav,LessonList
        },
        setup(props) {
             ///////// LOAD ALL LESSON + UNLOCKLESSONS FROM ACTIVE CLASS ID /////////////
            const unlockLessons = ref([]);
            const isLoading = ref(null)
            const noData = ref(null)

            const {data : activeClass, error : errClass, load: loadClass} = getDoc("classes")
            const {dataArray:lessons , error :errLesson, load: loadLesson} = getCollectionFilter();
            watchEffect(async()=>{ //vì là mỗi lần đổi class là cả hai props kia cùng thay đổi ==> phải load lại cả hai
                if(props.activeClassID != null && props.activeCourseID!= null){
                    //reset biến điều khiển
                    noData.value = false;
                    isLoading.value = true
                    lessons.value = [];
                    unlockLessons.value =[];

                    await loadClass(props.activeClassID);
                    unlockLessons.value = activeClass.value.unlockLessons
    
                    await loadLesson("lessons", "courseID",props.activeCourseID);
                    
                    isLoading.value = false;
                    if(lessons.value.length ==  0){
                        noData.value = true;
                    }
                }
            });

            const lessonCount = computed(()=>{
                return lessons.value.length;
            })
            const unlockCount = computed(()=>{
                return unlockLessons.value.length;
            })

            return{lessons,unlockLessons,noData,isLoading,
                    lessonCount,unlockCount}
        }
    }
</script>

<style lang="scss" scoped>

</style>