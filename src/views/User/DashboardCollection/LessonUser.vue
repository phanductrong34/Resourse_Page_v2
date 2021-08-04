<template>
    <div class="lesson-user">
        <LessonNav 
            :hasWork="hasWork" 
            @activateTab="activeTab = $event" 
            :activeTab="activeTab"/>
        <LessonDetail 
            v-if="activeTab == 'detail'" 
            :lesson="lesson"/>
        <LessonAssignment 
            :hasWork="hasWork" 
            v-if="activeTab == 'assignment'" 
            :lesson="lesson"
            @toggleHasWork="hasWork = $event"/>
        <LessonResource 
            v-if="activeTab == 'resource'" 
            :lesson="lesson"/>
    </div>
</template>

<script>
    import {ref,computed,watchEffect} from 'vue'
    import {useStore} from 'vuex'
    import LessonNav from '@/views/User/DashboardCollection/LessonNav.vue'
    import LessonDetail from '@/views/User/DashboardCollection/LessonDetail.vue'
    import LessonResource from '@/views/User/DashboardCollection/LessonResource.vue'
    import LessonAssignment from '@/views/User/DashboardCollection/LessonAssignment.vue'
    import { onBeforeRouteLeave } from 'vue-router'
    
    export default {
        props:['number'],
        components: {LessonNav,LessonDetail,LessonResource,LessonAssignment},
        setup(props) {
            const store = useStore();
            const activeTab = ref('detail');
            const list=  computed(()=>store.getters['lessons/getFilterList'] || []);
            const lesson = computed(()=>{
                return list.value.find(lesson => lesson.number == props.number);
            })

            //biến điều khiển trạng thái đã nộp bài và chưa nộp
            const hasWork = ref(false);
            //watch lesson change to load again
            const currentWorks = ref(null);

            watchEffect(()=> {
                const works = store.getters['works/getWorks'](props.number); //work nhận null hoặc array
                if(works){
                    hasWork.value = true
                }else{
                    hasWork.value = false;
                }
                currentWorks.value = works;
            });


            onBeforeRouteLeave((to, from, next) => {
                if (to.name == 'Dashboard') {
                    next(false)
                } else {
                    next();
                }
            })
            return {activeTab, lesson,hasWork,currentWorks};
        }
        
    }
</script>

<style lang="scss" scoped>
.lesson-user{
    width: 100%;
    height: 100%;
}
</style>