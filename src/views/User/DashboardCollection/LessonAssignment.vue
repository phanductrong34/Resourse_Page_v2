<template>
    <div class="lesson-assignment">
        <div class="works-container top">
            <a :href="homeworkURL" class="works-description" target="_blank">
                <div class="works-card">
                    Assignment Description
                    <img class="works-doc" src="@/assets/png/lesson-doc.svg" alt="">
                </div>
            </a>
            <form class="works-form" @submit.prevent="handleSubmit">
                <button class="works-button">Upload Homework {{lesson.number}}</button>
            </form>
            <div class="error-message center works-error" v-if="error"> {{error}}</div>
            <img class="works-bg" src="@/assets/png/assigment.svg" alt="">
        </div>
        <div class="works-container bottom">
            <div class="submit-container" v-if="currentWorks.length">
                <h4 class="submit-title">Your Submission</h4>
                <div @click="toggleEdit" :class="[{active : isEditting},'submit-btn']">Edit</div>
            </div>
            <div class="works-overflow"  v-if="currentWorks.length">
                <div class="works-list">
                    <div v-for="(work,index) in currentWorks" :key="index" :class="[{active : isEditting},'overlay']">
                        <WorkCard :work="work"/>
                        <div v-if="isEditting" class="overlay-icon" @click="deleteWork(work)"><i class="material-icons icon">delete_forever</i></div>
                    </div>
                </div>
                
            </div>
            <NoData v-if="!currentWorks.length" :data="'works'"/>
        </div>
    </div>
</template>

<script>
    import {ref,computed,watchEffect,watch} from 'vue'
    import Timecode from 'timecode-boss'
    import {useStore} from 'vuex'
    import {Cloudinary} from 'cloudinary-core'
    import qs from 'qs'
    import NoData from '@/components/Base/NoData.vue'
    import WorkCard from '@/components/Work/WorkCard.vue'
    import { useToast } from "vue-toastification";
    export default {
        props:['lesson','hasWork'],
        components: {NoData,WorkCard},
        setup(props,context) {
            const toast = useToast();
            const link = ref("");
            const store = useStore();
            const homeworkURL = computed(()=> props.lesson.homeworkURL);

            const cl = new Cloudinary({cloud_name: "umaster", secure: true});
            const uploadResult = ref(null);
            const currentWorks = ref([]);

            //work cửa bài hiện tại, reset mỗi lần chuyển lesson
            watchEffect(()=>{
                currentWorks.value = [];
                const lessonNumber = props.lesson.number;
                const loadWorks = store.getters['works/getWorks'](lessonNumber);
                if(loadWorks){
                    currentWorks.value = [...loadWorks];
                    console.log(currentWorks.value);
                }
            })
            
            //widget config
            //const  showUploadWidget = ()=> { cloudinary.openUploadWidget({    cloudName: "umaster",    uploadPreset: "preset_1",    sources: [        "local",        "url",        "google_drive"    ],    googleApiKey: "<image_search_google_api_key>",    showAdvancedOptions: true,    cropping: false,    multiple: true,    defaultSource: "local",    styles: {        palette: {            window: "#FFFFFF",            windowBorder: "#CC4C58",            tabIcon: "#AA0F1E",            menuIcons: "#5A616A",            textDark: "#000000",            textLight: "#FFFFFF",            link: "#AA0F1E",            action: "#FF620C",            inactiveTabIcon: "#0E2F5A",            error: "#AA0F1E",            inProgress: "#55C0EC",            complete: "#64CE70",            sourceBg: "#FFF6F7"        },        fonts: {            default: null,            "'Poppins', sans-serif": {                url: "https://fonts.googleapis.com/css?family=Poppins",                active: true            }        }    }}, (err, info) => {   if (!err) {         console.log("Upload Widget event - ", info);   }  }); }

            var myWidget = cloudinary.createUploadWidget({
                cloudName: 'umaster', 
                uploadPreset: 'preset_1'}, (error, result) => { 
                    uploadResult.value = null;
                    if (!error && result && result.event === "success") { 
                    console.log('Done! Here is the image info: ', result.info); 
                    uploadResult.value = result.info;
                    }
                }
            )

            // Mở widget
            const handleSubmit = async()=>{
                myWidget.open()
            }

            //Upload
            const styleDuration = (frameRate, frames)=>{
                let tc = new Timecode('00:00:00:00', frameRate);
                tc.setFrames(frames);
                return tc.toString().slice(3,8);
            }

            // nếu có result 1 cái auto upload lên firestore (vuex sẽ vừa thêm vào workslist offline luôn)
            watch(uploadResult, async()=>{
                if(uploadResult.value != null){
                    //gọi vuex upload
                    const newWork = await store.dispatch('works/uploadWork', {
                        videoUrl: uploadResult.value.secure_url,
                        thumbnailUrl: uploadResult.value.secure_url.slice(0,-3) + 'jpg',
                        workSize: uploadResult.value.bytes,
                        workName: uploadResult.value.original_filename,
                        publicId: uploadResult.value.public_id,
                        number: props.lesson.number,
                        workDuration: styleDuration(uploadResult.value.frame_rate,uploadResult.value.nb_frames),
                        downloadUrl:`https://res.cloudinary.com/umaster/video/upload/fl_attachment/${uploadResult.value.path}`
                    })
                    context.emit('toggleHasWork',true);
                }
            })

            

            //Bật tắt chế độ edit
            const isEditting = ref(false);
            const toggleEdit = ()=>{
                isEditting.value = !isEditting.value
            }
            //xóa work (tất nhiên ko xóa đc trên cloudinary);
            // khi xóa class, xóa course, xóa student cũng phải xóa cái này
            const deleteWork = async(work) =>{
                const check = confirm(`Do you want to delete homework ${work.workName}`);
                if(check){
                    await store.dispatch('works/deleteWork',{workID: work.id,studentID: work.studentID});

                }else{
                    toast.info('Delete homework cancel');
                }
            }
            return{handleSubmit,link,homeworkURL,currentWorks,toggleEdit,isEditting,deleteWork}
        }
    }
</script>

<style lang="scss" scoped>
    .lesson-assignment{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

    }
    .works{
        &-container{
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
            &.bottom{
                height: 52%;
                
            }
            &.top{
                height: 40%;
            }
        }
        &-description{
            position: absolute;
            transform: translate(-50%,-50%);
            left: 50%;
            top: 26%;
            display: flex;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            &:hover{
                & .works-doc{
                    transform: translate(0%,-50%) scale(1.1) rotate(-10deg);
                }
                & .works-card{
                    transform: scale(1.02);
                }
            }
        }
        &-card{
            position: relative;
            padding: 0.8rem 2rem 0.8rem 2rem;
            border-radius: 0.6rem;
            background-color: $color-primary;
            color: white;
            @include transition;
            font-size: 1.2rem;
        }
        &-doc{
            width: 5rem;
            position: absolute;
            transform: translate(0%,-50%);
            @include transition;
            top: 50%;
            right: -20%;
        }
        &-form{
            position: absolute;
            transform: translate(-50%,-50%);
            left: 50%;
            bottom: 11%;
            display: flex;
            width: 100%;
            display: flex;
            justify-content: center;
        }
        &-button{
            padding: 0.8rem 2rem;
            background: #4086F4;
            outline: none;
            border: none;
            border-radius: 0.6rem;
            color: white;
            font-size: 1.2rem;
            font-family: "Averta Bold";
            position: relative;
            z-index: 2;
            cursor: pointer;
            @include transition;
            &:hover{
                transform: scale(1.05);
            }
            
        }
        &-input{
            margin-top: 0.3rem !important;
            background-color: white !important;
            padding: 0.1rem 1rem 0.1rem 1rem !important;
            border-radius: 0.4rem !important;
            width: 0% !important;
            transform: translateX(3rem) !important;
            position: relative !important;
            z-index: 1 !important;
            transition: all 0.6s cubic-bezier(0,.81,.45,.99) !important;
        }
        &-visit{
            height: 100%;
            width: 4rem;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1.2rem;
            margin-left: -0.7rem;
            border-radius: 0.4rem;
            background-color:$color-gray-dark;
        }
        &-error{
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 53%;
        }
        &-bg{
            width: 100%;
        }

        //////bottomm

        &-overflow{
            position: absolute;
            width: 150%;
            height: 80%;
            overflow-x: auto;
            overflow-y: hidden;
            bottom: 0;
            left: 0;
            &::-webkit-scrollbar-track{
                border-radius: 10px;
                background-color: #00000028;
            }
            &::-webkit-scrollbar{
                width: 12px;
                background-color:#ffffff00;
            }
            &::-webkit-scrollbar-thumb{
                border-radius: 10px;
                background-color: #ffffff48;
            }
        }
        &-list{
            height: 100%;
            width: 100rem;
            display: flex;
            flex-wrap: wrap;
            margin-top: 2.8rem;
            & > * {
                margin-right: 1rem;
                
                &:not(:last-child){
                    
                }
            }
        }
    }
     // title Ô nộp bài   
    .submit{
        &-container{
            display: flex;
            justify-content: center;
            width: 100%;
            position: relative;
        }
        &-title{
            margin-top: 1.5rem;
        }
        &-btn{
            position: absolute;
            right: 15%;
            top: 8%;
            padding: 0.5rem 1rem;
            border-radius: 10rem;
            color: $color-gray-dark;
            background-color: white;
            @include transition;
            cursor: pointer;
            &.active{
                color: white;
                background-color: $color-orange;
            }
        }
    }

    // overlay xóa bài
    .overlay{
        position: relative;
        z-index: 5;
        filter: brightness(1);
        @include transition;
        display: flex;
        align-self: flex-start;
        &.active{
            filter: brightness(0.8) saturate(1.3);
            pointer-events: none;
        }
        &-icon{
            pointer-events:all;
            cursor: pointer;
            position: absolute;
            bottom: 0.8rem;
            right: 0.8rem;
            z-index: 100;
            @include transition;
            width: 3.1rem;
            height: 3.1rem;
            border-radius: 0.6rem;
            background-color: $color-primary;
            display: flex;
            justify-content: center;
            align-items: center;
            &:hover{
                transform: scale(1.05);
            }
            &>*{
                color: white;
                font-size: 2rem;
            }
        }
    }

</style>