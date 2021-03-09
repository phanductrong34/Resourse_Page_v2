<template>
    <div class="class-manage page">

        <div class="left-section">
            <div class="classes-section">
                <ClassNav @activateCourse="activateCourse" :activeCourse="activeCourse"/>
                <SliderCard2 :cardWidth="209" :cardHeight="128" :cardSpace="18" :cardCount="3" 
                                :activeCourse="activeCourse" :activeClass="activeClass" :activeClassID="activeClassID"
                                @activateClass="activeClass = $event"  @activateClassID="activeClassID = $event"/>
            </div>

            <StudentSection :activeClassID="activeClassID" :activeCourseID="activeCourseID"/>
            <LessonSection :activeCourseID="activeCourseID" :activeClassID="activeClassID"/>

        </div>
        <div class="right-section">

        </div>
    </div>


</template>

<script>
import { computed, ref, watchEffect} from "vue";
import ClassNav from "@/components/Classes/ClassNav.vue"
import SliderCard2 from "@/components/Classes/SliderCard2"
import StudentSection from "@/components/Students/StudentSection.vue"
import LessonSection from "@/components/Lessons/LessonSection.vue"
import _ from 'lodash'

import getCollectionRT from "@/composable/getCollectionRT"


export default {
    components: {
        ClassNav, SliderCard2,
        StudentSection,LessonSection,
    },

    setup() {
        //FUNCTION ACTIVE CLASSES
        const activeCourse = ref("animation");
        const activeCourseID = ref(null)
        const activeClass = ref(0);
        const activeClassID = ref(null)
        const lessons = ref(null)

        const activateCourse =(type)=> {
            activeCourse.value = type;
            activeClass.value =0;
        }

        // từ activeClass index ==> xử lý ra activeClassID và truyền xuống
        //lấy toàn bộ class realtime về, filter ra animation,illustrtion, từ computed filter đó và index suy ra ID của class tive và course active
        // NOTE: ta define biến rồi dùng watchEffect có điều kiện chứ ko dùng computed để deal với bất đòng bộ từ realtime

    //////////////////////1. LOAD REALTIME ALL CLASSES //////////////////////// 
        const {documents:allClasses,error: errClasses} = getCollectionRT("classes");


    ///////////////////// 2.   FILTER CLASSES    //////////////////////////////
        const filterClasses = ref([])
        watchEffect(()=> {
            if(allClasses.value != null){
                filterClasses.value = allClasses.value.filter((classi)=> {
                    if(classi.type == activeCourse.value) return classi;
                })
            }
        })
    //////////////////// 3.   ACTIVE CLASS ID  + ACTIVE COURSE ID //////////////
        watchEffect(()=> {
            if(filterClasses.value.length !==0){
                activeClassID.value = _.get((filterClasses.value)[activeClass.value], 'classID');
                activeCourseID.value = _.get((filterClasses.value)[activeClass.value],'courseID');
            }
        })

        return {
            activeCourse,activateCourse,activeClass,
            filterClasses,activeClassID,activeCourseID,
        }

    }
};
</script>

<style lang="scss" scoped>
.class-manage{
    width: 100%;
    display: flex;
    
}
//////// LEFT_SECTION
.left-section{
    width: 68%;
    max-width: 820px;
    display: flex;
    flex-direction: column;
    height: 100%;
    & > *{
        margin-bottom: 0rem;
    }
}
.classes-section{
    & > *{
        margin-bottom: 1rem;
    }
}

.right-section{
    width: 32%;
}

</style>
