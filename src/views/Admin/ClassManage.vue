<template>
    <div class="class-manage page">
        <ClassNav @activateCourse="activateCourse" :activeCourse="activeCourse"/>
        <SliderCard2 :cardWidth="209" :cardHeight="128" :cardSpace="18" :cardCount="3" :activeCourse="activeCourse" :activeClass="activeClass" @activateClass="activeClass = $event" />
    </div>
</template>

<script>
import { ref } from "vue";
import ClassNav from "@/components/Classes/ClassNav.vue"
import SliderCard2 from "@/components/Card/SliderCard2"

export default {
    components: {
        ClassNav, SliderCard2
    },

    setup() {
        //FUNCTION ACTIVE CLASSES
        const activeCourse = ref("animation"); //khởi tạo
        const activeClass = ref(0);

        const activateCourse =(type)=> {
            //truyền từ classNav lên thay đổi + reset index của activeClass về 0
            activeCourse.value = type;
            activeClass.value =0;
        }

    
        return {
            activeCourse,activateCourse,
            activeClass
        }

    }
};
</script>

<style lang="scss" scoped>
.class-manage > *{
    margin-bottom: 25px;
}
</style>
