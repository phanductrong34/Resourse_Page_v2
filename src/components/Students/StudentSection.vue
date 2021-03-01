<template>
    <div class="student-section">
        <StudentNav :activeClassID="activeClassID" :studentCount="studentCount" :submitCount="submitCount"
                    @updateCount="updateCount"/>
        <Loading v-if="isLoading" />
        <StudentList v-else :students="students" 
                     @updateCount="updateCount"/>
    </div>
</template>

<script>
    import {ref,watchEffect,onUpdated} from 'vue'
    import StudentNav from '@/components/Students/StudentNav.vue'
    import StudentList from '@/components/Students/StudentList.vue'

    import getCollectionFilter from '@/composable/getCollectionFilter'
    export default {
        props: ['activeClassID'],
        components:{
            StudentNav,StudentList
        },
        setup(props) {
            const isLoading = ref(false);
            const studentCount = ref(0);
            const {dataArray :students, error, load} = getCollectionFilter()
            
            //ban đầu khi render component này thì props.activeClass đang là null => vì nó cập nhật nên ra load lại
            watchEffect(async()=>{
                //reset các trường
                const trigger = studentCount.value;
                isLoading.value = true;
                students.value = [];

                 await load("students","classID",props.activeClassID);
                 studentCount.value = students.value.length;
                
                isLoading.value = false;
            })

            //reload from createStudnentModal signal
            const updateCount = (value)=>{
                studentCount.value += value;
            }
            //fetch submitCount
            const submitCount = ref(0);
            return {studentCount,students, submitCount,updateCount, isLoading};
        }
    }
</script>

<style lang="scss" scoped>

</style>