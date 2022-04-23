<template>
    <div class="student-section">
        
        <StudentNav :activeClassID="activeClassID" 
                    :activeCourseID="activeCourseID" 
                    :studentCount="studentCount"
                    :workCount="totalWorksCount"/>
        <Loading v-if="isLoading" />
        <StudentList v-else :students="currentStudentList" 
                     :activeStudentID="activeStudentID"/>
        <!-- <NoData v-if="!currentStudentList || currentStudentList.length" :data="'students'"/> -->
    </div>
</template>

<script>
    import {ref,watchEffect,onUpdated,computed} from 'vue'
    import {useStore} from 'vuex'
    import StudentNav from '@/components/Students/StudentNav.vue'
    import StudentList from '@/components/Students/StudentList.vue'
    import NoData from '@/components/Base/NoData.vue'
    import _ from 'lodash'


    export default {
        props: ['activeClassID','activeCourseID'],
        components:{
            NoData,
            StudentNav,StudentList
        },
        setup(props) {
            const isLoading = ref(false);
            // const {dataArray :students, error, load} = getCollectionFilter()

            const store = useStore();
            const currentStudentList = ref(null);

            // Những thằng thay đổi theo curentStudentList khi đc load lại
            const studentCount = computed(()=>{
                if(!currentStudentList.value) return 0;
                else return currentStudentList.value.length;
            });
            const totalWorksCount = computed(()=>_.get(store.getters['admin/getClassWorks'](props.activeClassID),'length')  || 0);
            const activeStudentID = computed(()=> store.getters['admin/getActiveStudentID']);
            
            

            // reload lại currentStudentList mõi activeClassID chuyển
            watchEffect(async()=>{

                    isLoading.value = true;
                    currentStudentList.value = null;
                    const students = store.getters['admin/getStudentsFromClass'](props.activeClassID);
                    // student có thể nhận null, [], hoặc [student1, student2]
                    if(students == null){ // chưa đc load
                        const res = await store.dispatch('admin/loadStudentsClass',{classID: props.activeClassID});
                        if(res !== 0){
                            currentStudentList.value = res;
                            store.commit('admin/setActiveStudentID',currentStudentList.value[0].id);
                        }
                    }else if(students.length > 0){
                        currentStudentList.value = students
                        store.commit('admin/setActiveStudentID',currentStudentList.value[0].id);
                    }
                    isLoading.value = false
            })

            return {studentCount,currentStudentList, isLoading,totalWorksCount,activeStudentID};
        }
    }
</script>

<style lang="scss" scoped>

</style>