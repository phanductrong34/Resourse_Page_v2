<template>
    <div class="student-section">
        <StudentNav :activeClassID="activeClassID" :studentCount="studentCount" :submitCount="submitCount"
                    @updateCount="updateCount"/>
        <StudentList :students="students" 
                     @updateCount="updateCount"/>
        <div>
        </div>
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
            const studentCount = ref(0);
            const {dataArray :students, error, load} = getCollectionFilter()
            
            //ban đầu khi render component này thì props.activeClass đang là null => vì nó cập nhật nên ra load lại
            onUpdated(async()=>{
                 await load("students","classID",props.activeClassID);
                 studentCount.value = students.value.length;
            })

            //reload from createStudnentModal signal
            const updateCount = (value)=>{
                studentCount.value += value;
            }
            //fetch submitCount
            const submitCount = ref(0);
            return {studentCount,students, submitCount,updateCount};
        }
    }
</script>

<style lang="scss" scoped>

</style>