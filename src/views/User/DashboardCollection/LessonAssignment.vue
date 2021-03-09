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
                <button class="works-button">Submit</button>
            </form>
            <img class="works-bg" src="@/assets/png/assigment.svg" alt="">
        </div>
        <div class="comments-container">
            <h5>Incoming feature....</h5>
        </div>
    </div>
</template>

<script>
    import {ref,computed} from 'vue'
    export default {
        props:['lesson'],
        setup(props) {
            const link = ref("");
            const homeworkURL = computed(()=> props.lesson.homeworkURL);
            const handleSubmit = ()=>{
                link.value = ""
                console.log(link.value);
            }
            return{handleSubmit,link,homeworkURL}
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