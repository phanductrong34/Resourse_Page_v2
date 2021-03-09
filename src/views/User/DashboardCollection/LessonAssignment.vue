<template>
    <div class="lesson-assignment">
        <div class="works-container">
            <a :href="homeworkURL" class="works-description" _target="blank">
                <div class="works-card">
                    Assignment Description
                    <img class="works-doc" src="@/assets/png/lesson-doc.svg" alt="">
                </div>
            </a>
            <form class="works-form" @submit.prevent="handleSubmit">
                <input class="works-input" type="text" placeholder="Paste your Google Drive link here" v-model="link">
                <button v-if="hasWork"
                        class="works-button"
                        @click.prevent="updateWork">
                            Update
                </button>
                <button v-else class="works-button">Submit</button>
                <a v-if="hasWork" class="works-visit" :href="driveURL" target="_blank">
                    <i class="material-icons">video_library</i>
                </a>
            </form>
            <div class="error-message center works-error" v-if="error"> {{error}}</div>
            <img class="works-bg" src="@/assets/png/assigment.svg" alt="">
        </div>
        <div class="comments-container">
            <h5>Incoming feature....</h5>
        </div>
    </div>
</template>

<script>
    import {ref,computed,watchEffect} from 'vue'
    import {useStore} from 'vuex'
    export default {
        props:['lesson','hasWork','currentWork'],
        setup(props,context) {
            const link = ref("");
            const error = ref(null);
            const store = useStore();

            const homeworkURL = computed(()=> props.lesson.homeworkURL);
            const driveURL = ref(null);
            watchEffect(()=>{
                if(props.currentWork){
                    driveURL.value = props.currentWork.workURL;
                }else{
                    driveURL.value = null
                }
            })

            //add new work
            const handleSubmit = async()=>{
                error.value = null;
                if(link.value.length){
                    await store.dispatch('works/uploadWork',{
                        inputURL: link.value,
                        number: props.lesson.number,
                    })
                    link.value = ""
                    context.emit('toggleHasWork',true);
                    alert(`Submit homework for lesson ${props.lesson.number} succeed`);
                }else{
                    error.value = "You must fill your link to submit"
                }
            }

            //update work
            const updateWork = async()=>{
                error.value = null;
                if(link.value.length){
                    await store.dispatch('works/updateWork',{
                        id: props.currentWork.id,
                        inputURL: link.value,
                        number:props.lesson.number
                    })
                    driveURL.value= link.value;
                    link.value ="";
                    context.emit('toggleHasWork',true);
                    alert(`Update homework for lesson ${props.lesson.number} succeed`);
                }else{
                    error.value = "You must fill your link to submit"
                }
            }

           
            return{handleSubmit,link,homeworkURL,error,
                   driveURL,updateWork }
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
            bottom: 5%;
            display: flex;
            width: 100%;
            display: flex;
            justify-content: center;

            &:hover .works-input{
                width: 50% !important;
                transform: translateX(10%) !important;
            }
        }
        &-button{
            width: 7rem;
            background: $color-primary;
            outline: none;
            border: none;
            border-radius: 0.6rem;
            color: white;
            font-size: 1.2rem;
            font-family: "Averta Bold";
            position: relative;
            z-index: 2;
            cursor: pointer;
            
            
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
    }
    .comments{
        &-container{
            width: 100%;
            height: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>