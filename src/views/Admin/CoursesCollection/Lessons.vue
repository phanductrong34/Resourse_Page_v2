<template>
    <div class="lesson">
        <div class="lesson-title">
            <h3 class="title center">Lessons from {{id}}</h3>
            <router-link :to="{name: 'CreateLesson', params:{id : id}}">
                <button class="button-create btn waves-effect waves-light red darken-4">add lesson</button>
            </router-link>
        </div>
        <div class="lesson-list">
            <div class="loading" v-if="isLoading"><Loading/></div>

            <ul class="collapsible" v-else>
                <li v-for="lesson in sortLessons" :key="lesson.id">
                    <div class="collapsible-header lesson-header">
                        <div class="lesson-number">
                            <h4>{{lesson.number}}</h4>
                        </div>
                        <div class="lesson-info">
                                <div class="lesson-name">
                                    <h5>{{lesson.name}}</h5>
                                </div>
                                <div class="lesson-tags">
                                    <span v-for="tag in lesson.tags" :key="tag" class="lesson-tag">{{tag}}</span>
                                </div>
                        </div>
                        <div class="lesson-img">
                            <Image :refUrl="lesson.thumbnailRef" class="lesson-thumb"/>
                        </div>
                    </div>
                    <div class="collapsible-body lesson-body">
                        <div class="lesson-description">
                            <h6>Description</h6>
                            <p>{{lesson.description}}</p>
                        </div>
                        <div class="lesson-link">
                            <h6>Homework URL:</h6>
                            <a :href="lesson.homeworkURL" target="_blank">Click me</a>
                        </div>
                        <div class="lesson-link">
                            <h6>Playlist Youtube URL:</h6>
                            <a :href="lesson.playlistURL" target="_blank">Click me</a>
                        </div>
                        <div class="lesson-link">
                            <h6>Slide URL:</h6>
                            <a :href="lesson.slideURL" target="_blank">Click me</a>
                        </div>
                        <div class="lesson-edit">
                            <router-link :to="{name: 'UpdateLesson', params:{id : lesson.id, courseID: id}}">
                                <button class="button-create waves-effect waves-light btn red darken-4">
                                    <i class="material-icons left">edit</i>Edit Lesson
                                </button>
                            </router-link>
                        </div>
                    </div>
                </li>
            </ul>  

            <NoData :data="'lesson'" v-if="noData"/>
        </div>
    </div>
</template>

<script>
    import getCollectionFilter from '@/composable/getCollectionFilter'
    import {ref, onMounted, computed, watch, watchEffect} from 'vue'
    import _ from 'lodash'
    export default {
        props: ['id'],
        components:{
        },
        setup(props) {
            const loadCollapsible = ()=>{
                $(document).ready(function(){
                    $('.collapsible').collapsible();
                });
            }
            onMounted(()=>{
                loadCollapsible();
            })

            //Load lần đầu
            const {dataArray :lessons, error :errLesson, load : loadLesson} = getCollectionFilter();
            // loadLesson("lessons",'courseID',props.id);

            //ref
            const tags = ref(['mograph','mindset']);


            // reload content base on props id
            const isLoading = ref(false);
            const noData = ref(false);
            watchEffect(async()=>{
                //đưa về trạng thái chờ (có loading, ko có báo noData)
                isLoading.value = true;
                noData.value = false;
                lessons.value = [];
                //loading lại data mới
                await loadLesson("lessons",'courseID',props.id);
                isLoading.value = false
                loadCollapsible();
                if(lessons.value.length == 0){
                    noData.value = true;
                }
            })
            
            
            const sortLessons = computed(()=>{
                if(!lessons.value) return null;
                else{
                    return _.orderBy(lessons.value, ['number'],['asc']);
                }
            })

            return {lessons, errLesson,tags,sortLessons,isLoading,noData}
        }
    }
</script>

<style lang="scss" scoped>
    .lesson{
        width: 75%;
        display: flex;
        flex-direction: column;
        overflow-y:auto;
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
    .lesson-title{
        display: flex;
        flex-direction: column;
        align-items: center;
        & > *{
            margin-bottom: 1.5rem;
        }
    }
    .lesson-list{
        padding: 0 8% 0 8%;
    }

    ////// LESSON /////
    .lesson{
        &-header{
            display: flex;
            padding: 1.2rem 1rem 1.2rem 0rem;
        }
        &-number{
            width: 10%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        &-info{

        }
        &-name{
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
        }
        &-tags{

        }
        &-tag{
            padding: 0.2rem 1rem 0.2rem 1rem;
            background-color: $color-gray-light-1;
            color:white;
            border-radius: 5rem;
            margin-right: 0.5rem;
        }
        &-img{
            margin-left: auto;
            width: 13%;
            position: relative;
        }
        &-thumb{
            position: absolute;
            transform: translate(-50%,-50%);
            top: 31%;
            right: -56%;
            width: 100%;
        }
        //body
        &-body{
                background-color: white;
            & > *{
                margin-bottom: 1.5rem;
            }
        }
        &-description{
            & h6 {
                margin-bottom:1rem;
            }
        }
        &-link{
            display: flex;
            & a{
                margin-left: 1rem;
            }
        }



    }

    .button-create{
        border-radius: 10rem;
        text-transform: lowercase;
        font-family: "Averta Semi Bold";
        font-size: 15px;
        width: 10rem;
    }
</style>