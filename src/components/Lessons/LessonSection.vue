<template>
    <div>
        <LessonNav :lessonCount="lessonCount" :unlockCount="unlockCount"/>
        <Loading v-if="isLoading"/>
        <LessonList v-else :lessons="lessons" :unlockLessons="unlockLessons" @toggleLesson="toggleLesson"/>
        <NoData :data="'lessons'" v-if="noData"/>
    </div>
</template>

<script>
    import LessonNav from '@/components/Lessons/LessonNav.vue'
    import LessonList from '@/components/Lessons/LessonList.vue'
    import getCollectionFilter from '@/composable/getCollectionFilter'
    import getDoc from '@/composable/getDoc'
    import updateDoc from '@/composable/updateDoc'
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
            ///////////////////// computed số ít sô nhiều

            const lessonCount = computed(()=>{
                return lessons.value.length;
            })
            const unlockCount = computed(()=>{
                return unlockLessons.value.length;
            })

            /////////////////// event unlock - hàm này ko hề đánh động watchEffect, thay dổi dồng thời cả off lẫn on nên ko phải laod lại
            const {error: errUpdate, update : updateClass} = updateDoc("classes")
            const toggleLesson = async(number) => {
                const index = unlockLessons.value.indexOf(Number(number));
                if(index > -1){   // nếu mà có trong unlock => xóa đi
                    unlockLessons.value.splice(index,1)
                    await updateClass(props.activeClassID,{
                        unlockLessons : unlockLessons.value
                    })
                }else{
                    unlockLessons.value.push(Number(number))
                    await updateClass(props.activeClassID,{
                        unlockLessons : unlockLessons.value
                    })
                }
            }

            return{lessons,unlockLessons,noData,isLoading,
                    lessonCount,unlockCount,toggleLesson}
        }
    }
</script>

<style lang="scss" scoped>

</style>