<template>
    <div class="classroom page">
        <div class="class-header">
            <h3 class="class-title">My Class.</h3>
            <div v-if="classID" class="class-id">{{classID}}</div>
        </div>
        <div class="class-list overflowList" v-if="studentList">
            <UserStudentList 
                :students="studentList"
                :activeStudentID="activeStudentID" 
                @showWorks="showWorks"/>
        </div>
        <div class="class-works overflowList">
            <div class="works-header row" v-if="lessonCount">
                <div class="col s8">
                    <h5 class="works-title" v-if="isEach">Sumitted Works from {{activeStudent.nickname}}</h5> 
                    <h5 class="works-title" v-else>Sumitted Works from all</h5> 
                </div>

                <div class="input-field offset-s2 col s2">
                    <div :class="[{active: !isEach},'toggle-filter']" @click="isEach = !isEach">
                        <span>all works</span>   
                    </div>
                </div>

            </div>
            <!-- each -->
            <div class="result-filter" v-if="isEach">
                    <div class="works-list" v-if="currentWorksList">
                        <div class="works-card" v-for="work in currentWorksList" :key="work.id">
                            <a :href="work.workURL" target="_blank">
                                <span class="works-student">{{activeStudent.nickname}}.</span>
                                <span class="works-number">{{work.lessonNumber}}</span>
                                <img class="works-img" src="@/assets/png/work-folder.svg" alt="">
                            </a>
                        </div>
                    </div>
                    <div class="works-list" v-if="!currentWorksList && !noData">
                        <Loading/>
                    </div>
                    <div class="work-list" v-if="noData">
                        <NoData :data="'works'"/>
                    </div>
            </div>
            <!-- all -->
            <div class="result-filter" v-else>
                    
                    <div class="works-list" v-if="allWorkList">
                        <div class="works-card" v-for="work in allWorkList" :key="work.id">
                            <a :href="work.workURL" target="_blank">
                                <span class="works-student">{{work.studentNickname}}.</span>
                                <span class="works-number">{{work.lessonNumber}}</span>
                                <img class="works-img" src="@/assets/png/work-folder.svg" alt="">
                            </a>
                        </div>
                    </div>
                    <div class="works-list" v-if="!allWorkList && !noDataAll">
                        <Loading/>
                    </div>
                    <div class="work-list" v-if="noDataAll">
                        <NoData :data="'works'"/>
                    </div>         
            </div>
        </div>
    </div>
</template>

<script>
    import UserStudentList from '@/views/User/ClassroomCollection/UserStudentList.vue'
    import {useStore} from 'vuex'
    import {ref,computed,onMounted, watchEffect,watch} from 'vue'
    import _ from 'lodash'
    export default {
        components: {UserStudentList},
        setup(props) {
            const initSelect = ()=>{
                $(document).ready(function(){
                    $('select').formSelect();
                });
            }

            onMounted(() => {
                initSelect();
            });

            //refs
            const store = useStore();
            const activeStudentID = ref(null);
            const activeStudent = ref(null);


            const userData = computed(()=> {
                const user =  store.getters['user/getUserData']
                if(user){
                    activeStudentID.value = user.id;
                    activeStudent.value = user;
                    return user
                }else return null
            });

            const classID = computed(()=>{
                if(userData.value){
                    return store.getters['user/getClassID']
                }else return null;
            });

    //CHẠY 1 LẦN KHI VÀO TRANG
            const studentList = ref(null);
            watchEffect(async()=> {
                if(classID.value){
                    const list = await store.dispatch('studentWorks/getStudentList');
                    studentList.value = list;
                }else{
                    studentList.value = null;
                }
            });
    // ĐẺ V_FOR CHO SELECT OPTION
            const lessonCount = computed(()=> {
                const count = store.getters['lessons/getCount'];
                if(count){
                    initSelect();
                    return count;
                }else{
                    return 0;
                }
            });

    // CHỨC NĂNG LỌC KẾT QUẢ BÀI TẬP
        const currentWorksList = ref(null);  // nơi lưu kết quả nếu là each
        const noData = ref(false);

        const allWorkList = ref(null); //  nơi lưu kết quả nếu có all
        const noDataAll = ref(false);
        const isEach = ref(true);   // mặc định là list each hiện


        watchEffect(async ()=>{
            if(isEach.value == false){  // tức bật all
                noDataAll.value = false;
                const allWorks = await store.dispatch('studentWorks/getAllWorks');
                if(allWorks){
                    allWorkList.value = _.orderBy(allWorks,['lessonNumber'],['asc']);
                    
                }else{
                    allWorkList.value = null;
                    noDataAll.value = true;
                }
            }
        })



    // CHẠY LẠI MỖI LẦN KHI ACTIVESTUDENTID THAY ĐỔI

            watchEffect(async()=>{
                if(activeStudentID.value){
                    currentWorksList.value = null;
                    noData.value = false;

                    const works = await store.dispatch('studentWorks/getWorks',{studentID: activeStudentID.value});

                    if(works){ // fetch về và có data
                        currentWorksList.value = works;
                    
                    }else{  //fetch về mà ko có data
                        currentWorksList.value = null;
                        noData.value = true;
                    }
                }
            })
        // 
            const showWorks = (student)=>{
                    activeStudentID.value = student.id;
                    activeStudent.value = student;
            }


            return{classID,lessonCount,studentList,activeStudentID,noData,currentWorksList,activeStudent,showWorks,
                    isEach,noDataAll,allWorkList}
        }
    }
</script>

<style lang="scss" scoped>
    .classroom{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .class{
        &-header{
            display: flex;
            padding: 2rem 0 2rem 10rem;
            align-items: flex-end;
        }
        &-title{
            font-size: 3.4rem;
            font-family: "Averta Bold";
            margin-right: 2rem;
        }
        &-id{
            padding: 0.5rem 2rem 0.5rem 2rem;
            font-size: 1.5rem;
            font-family: "Averta Bold";
            color: white;
            background-color: $color-orange;
            border-radius: 10rem;
            cursor: pointer;
            @include transition;
            &:hover{
                transform: scale(1.05);
            }
        }
        &-list{
  -webkit-backface-visibility: hidden; /* add to fix webkit bug jitter */
  -webkit-transform: perspective(1000px); /* add to fix webkit bug jitter */
            height: 52vh;
            transform: scale(1.1) translateX(8%);
            padding: 0.5rem;
            // background-color: blue;
            overflow: auto;
        }
        &-works{
            padding-left:10rem;
            height:  54vh;
            width: 76%;
            overflow-y: auto;
            // background-color: blue;
        }
    }
    .works{
        &-header{
            display: flex;
            align-items: center;
        }
        &-list{
            display: flex;
            padding-left: 1.2rem;
            width: 100%;
            flex-wrap: wrap;
        }
        &-card{
            position: relative;
            width: 13%;
            margin-right: 1.2rem;
            @include transition;
            &:hover{
                cursor: pointer;
                transform: scale(1.1);
            }
        }
        &-img{
            width: 100%;
        }
        &-student{
            position: absolute;
            bottom:14%;
            left: 14%;
            color: $color-primary;
        }
        &-number{
            position: absolute;
            top: 0%;
            right: 10%;
            color: white;
            font-size: 2.1rem;
            font-family: "Averta Bold";
        }
    }
    .toggle-filter{
        padding: 0.5rem 1rem 0.5rem 1rem;
        cursor: pointer;
        @include transition;
        display: flex;
        justify-content: center;
        align-items: center;
        &.active{
            background-color: $color-primary;
            border-radius: 10rem;
            color: white;
        }
    }


</style>