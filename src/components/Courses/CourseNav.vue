<template>
    <div class="course-nav">
        <div class="course-title">
            <h3 class="title center">Courses</h3>
            <router-link :to="{name: 'CreateCourse'}">
                <button class="button-create btn waves-effect waves-light red darken-4">add course</button>
            </router-link>

        </div>

        <div class="course-list">
            <div v-for="(course,index) in courses" :key="course.id"
                @click="activateCourse(index)"
                :class="[{active : index === activeIndex},'course-card']">
                    <router-link :to="{name: 'Lessons', params: {id:course.id}}">
                        <router-link :to="{name: 'UpdateCourse',params: {id:course.id}}">
                            <div class="course-edit"><i class="material-icons">edit</i></div>
                        </router-link>

                        <div class="course-name">{{course.name}}</div>
                        <div class="course-id">{{course.id}}</div>
                        <img class="course-bg" :src="loadPhoto(course.type)">
                        <!-- <Image class="course-bg" :refUrl="course.thumbnail"/> -->
                    </router-link>
            </div>
        </div>
        <div class="course-total center">{{computedLength}}</div>
    </div>
</template>

<script>
    import {ref,computed} from 'vue'
    import {projectStorage} from '@/firebase/config'
    export default {
        
        props: ['courses',],
        setup(props,context) {
            //Handle active
            const activeIndex = ref(0)
            const activateCourse = (index)=> {
                activeIndex.value = index;
                context.emit('activateIndex',index);
            }

            //Handle sô ít sô nhiều
            const computedLength = computed(()=>{
                let rear = "";
                props.courses.length < 2 
                    ? rear = 'course'
                    : rear = 'courses'
                return `Total ${props.courses.length} ${rear}`;
            })

            const loadPhoto = (type)=>{
                return `/assets/png/courseThumb-${type}.png`
                // return `card/courseThumb-${type}.png`
            }
            return {computedLength,loadPhoto,activateCourse,activeIndex}
        }
    }
</script>

<style lang="scss" scoped>
    .course-nav{
        width: 25%;
        min-width: 250px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow-y: auto;
        &::-webkit-scrollbar-track{
            border-radius: 10px;
            background-color: #F5F5F5;
        }
        &::-webkit-scrollbar{
            width: 12px;
            background-color: #F5F5F5;
        }
        &::-webkit-scrollbar-thumb{
            border-radius: 10px;
            background-color: $color-gray-light-2;
        }
    }
    .course-title{
        display: flex;
        flex-direction: column;
        align-items: center;
        & > *{
            margin-bottom: 1.5rem;
        }
    }
    .course-list{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        padding: 0 1rem 0rem 1rem;

    }
    .course{
        &-card{
            width: 95%;
            position: relative;
            @include card-shadow-1;
            overflow: hidden;
            border-radius: 7%;
            margin-bottom: 1.5rem;
            @include transition;
            cursor: pointer;
            &:hover{
                transform: scale(1.02);
            }
            &.active{
                transform: scale(1.06);
                @include card-shadow;
            }
            
        }
        &-name{
            position: absolute;
            top: 15%;
            left: 8%;
            text-transform: lowercase;
            color: white;
            line-height: 1.8rem;
            font-size: 1.5rem;
            width: 50%;
            z-index: 1;
        }
        &-id{
            position: absolute;
            bottom: 7%;
            right: 11%;
            color: white;
            opacity: 0.5;
            font-size: 1.3rem;
            z-index: 1;
        }
        &-edit{
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2.5rem;
            height: 2.5rem;
            color: white;
            border-radius: 25%;
            position: absolute;
            top: 7%;
            right: 4%;
            z-index: 1;
            @include transition;

            &:hover{
                color: $color-gray-dark;
                
                background-color: $color-gray-light-2;
            }
        }
        &-bg{
            width: 100%;
            z-index: -1;
            min-width: 258px;
            min-height: 155px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
    .course-total{
        font-size: 1.2rem;
        color: $color-gray-dark;
    }
    .button-create{
        border-radius: 10rem;
        text-transform: lowercase;
        font-family: "Averta Semi Bold";
        font-size: 15px;
        width: 10rem;
    }

</style>
/*
- Nhận courses (realtime) từ phía Courses.vue, ta sẽ cycle throught qua và hiển thị thông tin lên card 
- Để tránh bất đồng bộ, ta dùng v-if ở bên ngoài cho compoenent này để nó đc mount lên chỉ khi có courses truyền vào
- Ta bật tắt active ở chính component này, tuy nhiên có ném ra bên ngoài 1 hàm thay đổi activeIndex (và do ở ngoài đã fetch danh sách)
- bản thân các card là các routerlink đẩy trang tới lesson/courseID
 */