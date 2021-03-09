<template>
    <div class="courses page">
        <CourseNav v-if="courses" :courses="courses" @activateIndex="activeIndex = $event"/>
        <div class="course-nav-loading" v-else ><Loading /></div>
        
        <router-view></router-view>
    </div>
</template>


<script>
import {ref, watchEffect,watch} from 'vue'
import {useRouter} from 'vue-router'
import CourseNav from '@/components/Courses/CourseNav.vue'
import getColectionRT from '@/composable/getCollectionRT'
import _ from 'lodash'

export default {
    components: {
        CourseNav
    },
    setup() {
        const {documents : courses,error} = getColectionRT("courses");

        //ref
        const activeIndex = ref(0);
        const activeCourseID = ref(null);
        
        //watch and change activeCourse base on activeIndex change
        const router = useRouter();
        watchEffect(()=>{
            if(courses.value != null){
                activeCourseID.value = (courses.value)[activeIndex.value].id;
            }
        });
        watch(courses, (oldCourses, newCourses)=>{
            if(_.get(courses, 'value') && !_.isEqual(oldCourses,newCourses)){
                // console.log("id herre",activeCourseID.value)
                router.replace({name: 'Lessons', params: {id: activeCourseID.value}})
            }
        })



        return{courses, error,activeIndex,activeCourseID}
    }
}
</script>

<style lang="scss" scoped>
    .courses{
        display: flex;
        width: 100%;
    }
    .course-nav-loading{
        width: 25%;
        min-width: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

/*
- Ta sẽ fetch lấy toàn bộ doc trong course, sau đó truyền toàn bộ courses vào CourseNav để nó hiện các course  
- watchEffect là để thay đổi lấy activeCourse dựa trên activeIndex (activeIndex đc thay đổi khi click active vào card ở CourseNav)
và watchEffect chạy lần đàu kiểu gì cũng bất đồng bộ do courses chưa được load, ==> ta có điều kiện
- ngay sau khi resolve đc array Courses cùng với activeID rồi thì đẩy trang tới lessons/courseId
 */