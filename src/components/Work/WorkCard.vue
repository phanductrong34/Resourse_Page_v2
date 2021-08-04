<template>
    <div class="workCard">
        <div class="top">
            <div class="buttonContainer">
                <div class="but ava"><Image class="ava-img" :refUrl="userData.avaRef" /></div>
                <div class="but link" @click="copyPath"><i class="material-icons icon">insert_link</i></div>
                <a :href="work.downloadUrl" target="_blank" class="but down" @click="download"><i class="material-icons icon">file_download</i></a>
            </div>
            <div class="thumbContainer" :style="thumbStyle(work.thumbnailUrl)" @click="toggleModal(true)">
                <i class="material-icons play">play_circle_outline</i>
            </div>
        </div>
        <div class="bottom">
            <div class="lesson">{{work.lessonNumber}}</div>
            <div class="info">
                <div class="info-name">{{userData.fullname}}</div>
                <div class="info-time">{{dateStyle}}</div>
            </div>
            <div class="size">{{work.workDuration}}</div>
        </div>

    </div>
    <VideoPlayer @closeModal="toggleModal" :showModal="showModal" :work="work" />
</template>

<script>
    import Image from '@/components/Base/Image.vue'
    import {timestamp} from '@/firebase/config'
    import { useToast } from "vue-toastification";
    import _ from 'lodash'
    import { computed,ref } from 'vue'
    import {formatDistanceToNow} from 'date-fns'
    import {useStore} from 'vuex'
    import VideoPlayer from '@/components/Work/VideoPlayer.vue'
    export default {
        props:['work'],
        components:{Image,VideoPlayer},
        setup(props) {
            //Lấy data của học viên
            const store = useStore();
            const toast = useToast();
            const userData = computed(()=>store.getters['user/getUserData']);
            
            const thumbStyle = (thumbnailUrl)=>{
                return `background-image: url(${thumbnailUrl})`;
            }
            const dateStyle = computed(()=>{
                var time = props.work.createdAt;
                if(time != 'Just now'){
                    time = (formatDistanceToNow(time.toDate()));
                }
                return time
            })

            //handle event
            const copyPath = ()=>{
                const str = props.work.videoUrl;
                const el = document.createElement('textarea');
                el.value = str;
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.top = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                toast.info("Copy video URL to clipboard!")
            }

            //Handle modal player
            const showModal = ref(false);
            const toggleModal = (state)=>{
                showModal.value = state;
                console.log(showModal.value);
            }

            return {userData,thumbStyle,userData,dateStyle,copyPath,toggleModal,showModal}
        }
    }
</script>

<style lang="scss" scoped>
.workCard{
    background-color: white;
    @include card-shadow-1;
    border-radius: 1rem;
    padding: 0.6rem;
    padding-bottom: 0;

}
.top{
    display: flex;
    transform: translateY(-2rem);
}
.buttonContainer{
    display: flex;
    flex-direction: column;
    margin-right: 0.5rem;
    transform: translateY(0.5rem);
}
.but{
    background-color: $color-gray-light-2;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 0.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: 0.2rem;
    &:hover{
        & .icon{
            color: $color-gray-dark;
        }
    }
    & > *{
        padding: 0;
        margin: 0;
        color: white;
        @include transition
    }
    &.ava{
        position: relative;
        background-color: $color-primary;
        & .ava-img{
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 140%;
            
        }
    }
    &.link{

    }
    &.down{

    }
}
.thumbContainer{
    position: relative;
    width: 16rem;
    height: 9rem;
    border-radius: 0.7rem;
    background-size: 100%;
    background-position: center;
    overflow: hidden;
    @include transition;
    cursor: pointer;
    &:hover{
        transform: scale(1.02);
        background-size: 105%;
    }
    // &::after{
    //     content: "";
    //     position: absolute;
    //     width: 100%;
    //     height: 100%;
    //     top: 0;
    //     left: 0;
    //     border-radius: 1rem;
    //     backdrop-filter: blur(0.5px);
    //     overflow: hidden;
    //     z-index: 1;
    // }

    & .play{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        z-index: 2;
        font-size: 5rem;
        color: white;
        opacity: 0.8;
        transform-origin: center center;
        @include transition;
    }
}

.bottom{
    display: flex;
    transform: translateY(-0.9rem);
    margin-top: -0.8rem;
}
.lesson{
    font-size: 1rem;
    padding: 0 1.5rem 0 1.5rem;
    transform: translateY(2rem) scale(2.5);
    color: $color-orange;
}
.info{
    &-name{
        font-size: 1.4rem;
        font-family: 'Averta Bold';
    }
    &-time{
        color: $color-gray-dark;
        font-size: 0.8rem;
        transform: translateY(-0.3rem);
    }
}
.size{
    margin-left: auto;
    display: flex;
    color: $color-gray-dark;
    padding:0.5rem 0.5rem 0 0; 
}
</style>