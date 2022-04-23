<template>
    <div class="lesson-detail">
        <div class="lesson-card">
            <div class="lesson-video">
               <video
                  class="lesson-recordThumb"
                  autoplay="autoplay"
                  loop
                  muted
                  :key="lesson.loopURL"
                >
                    <source v-if="lesson.loopURL"
                      :src="lesson.loopURL"
                      type="video/mp4"
                    >
                    <source v-else src="https://res.cloudinary.com/umaster/video/upload/v1630686044/LoopURL/in_t%C3%B4_gakfhb.mp4">
                </video>
            </div>
            <div class="lesson-description">
                <p>{{computedDescription}}</p>
            </div>
            <div class="lesson-button">
                <router-link :to="{name: 'Slide', params:{id: lesson.id}}">
                    <img class="lesson-btn-img" src="@/assets/png/button-bunny.svg" alt="">
                    <div class="lesson-btn-label">View Slide Lesson {{lesson.number}}</div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import {ref,computed} from 'vue'
    export default {
        props:['lesson'],
        setup(props) {
            const computedDescription = computed(()=>{
                return props.lesson.description.substr(0,200)+ '...'
            })

            return{computedDescription};
        }
    }
</script>

<style lang="scss" scoped>
.lesson-detail{
    width: 100%;
    height: 100%;
}
.lesson{
    &-card{
        width: 100%;
        height: 120%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 2rem;
        background-color: white;
        @include card-shadow;
        border-radius: 2rem;
        position: relative;
    }
    &-video{
        border-radius: 2rem;
        overflow: hidden;
        position: relative;
        margin-bottom: 1rem;
    }
    &-recordThumb{
        width: 100%;
        transform: scale(1.04);
        pointer-events: none;

    }
    &-noti{
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        padding: 0.2rem 1rem 0.2rem 1rem;
        background-color: white;
        border-radius: 10rem;
        z-index: 2;
    }
    &-icon{
        position: absolute;
        transform: translate(-50%,-50%);
        top: 50%;
        left: 50%;
        font-size: 5rem;
        color: white;
        cursor: pointer;
    }
    &-description{
        padding: 0 1rem 0 1rem;
        font-size: 1.2rem;
    }
    &-button{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        width: 100%;
        height: 20%;
        left: 0;
        bottom: 23%;
        @include transition;
        &:hover{
            transform: scale(1.02);
        }
    }
    &-btn{
        &-img{
            width: 16rem;
        }
        &-label{
            position: absolute;
            transform: translate(-50%,-50%);
            top: 68%;
            left: 50%;
            color: white;
            font-size: 1.3rem;
        }
    }
}
</style>