<template>
    <div class="student-section">
        
        <StudentNav :activeClassID="activeClassID" :activeCourseID="activeCourseID" :studentCount="studentCount" :submitCount="submitCount"
                    @reload="reload"/>
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
        props: ['activeClassID','activeCourseID'],
        components:{
            StudentNav,StudentList
        },
        setup(props) {
            const isLoading = ref(false);
            const studentCount = ref(0);
            const {dataArray :students, error, load} = getCollectionFilter()

            const reload = async()=> {
                    isLoading.value = true;
                    students.value = [];
    
                    await load("students","classID",props.activeClassID);
                    studentCount.value = students.value.length;
                    
                    isLoading.value = false;
            }

            //ban đầu khi render component này thì props.activeClass đang là null => vì nó cập nhật nên ra load lại
            watchEffect(async()=>{
                if(props.activeClassID){
                    //reset các trường
                    const trigger = studentCount.value;
                    const trigger2 = props.activeClassID;

                    await reload();
                }
            })
            

            //reload from createStudnentModal signal
            const updateCount = (value)=>{
                studentCount.value += value;
            }
            //fetch submitCount
            const submitCount = ref(0);
            return {studentCount,students, submitCount,updateCount, isLoading,reload};
        }
    }
</script>

<style lang="scss" scoped>

</style>