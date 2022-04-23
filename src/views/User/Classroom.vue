<template>
    <div class="classroom page">
        <div class="class-header">
            <h3 class="class-title">My Class.</h3>
            <div v-if="classID" class="class-id">{{classID}}</div>
        </div>
        <div class="ava" v-if="activeStudent">
            <Image class="ava-image" :refUrl="activeStudent.avaRef"/>
        </div>
        <div class="class-list overflowList" v-if="studentList">
            <UserStudentList 
                :students="studentList"
                :activeStudentID="activeStudentID" 
                @showWorks="showWorks"/>
            <div class="info-box">
                <StudentInfoCard :student="activeStudent" />
            </div>
        </div>
        <div class="class-works">
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

                    <div class="works-overflow"  v-if="currentWorksList" @wheel.prevent="scrollHori2($event)" ref="scrollContainer2">
                        <div class="works-list">
                            <div v-for="(work,index) in currentWorksList" :key="index">
                                <WorkCard :work="work"/>
                            </div>
                        </div>
                    </div>

                    <div class="works-wrapper" v-if="!currentWorksList && !noData">
                        <Loading/>
                    </div>
                    <div class="works-wrapper" v-if="noData">
                        <NoData :data="'works'"/>
                    </div>
            </div>
            <!-- all -->
            <div class="result-filter" v-else>
                    
                    <div class="works-overflow"  v-if="allWorkList" @wheel.prevent="scrollHori($event)" ref="scrollContainer">
                        <div class="works-list">
                            <div v-for="(work,index) in allWorkList" :key="index">
                                <WorkCard :work="work"/>
                            </div>
                        </div>
                    </div>

                    <div class="works-wrapper" v-if="!allWorkList && !noDataAll">
                        <Loading/>
                    </div>
                    <div class="works-wrapper" v-if="noDataAll">
                        <NoData :data="'works'"/>
                    </div>         
            </div>
        </div>
    </div>
</template>

<script>
    import UserStudentList from '@/views/User/ClassroomCollection/UserStudentList.vue'
    import WorkCard from '@/components/Work/WorkCard.vue'
    import {useStore} from 'vuex'
    import {ref,computed,onMounted, watchEffect,watch} from 'vue'
    import _ from 'lodash'
    import StudentInfoCard from '../../components/Classes/StudentInfoCard.vue'
    export default {
        components: {UserStudentList,WorkCard,StudentInfoCard},
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
                    allWorkList.value = _.orderBy(allWorks,['lessonNumber'],['desc']);
                    
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


            ////HORIZONTAL SCROLL cho all
            const cardWidth = 316
            const scrollContainer = ref(null);
            const  scrollAmount = ref(0);
            const scrollHori = (event)=>{
                if(event.deltaY >0 && scrollAmount.value <= scrollContainer.value.offsetWidth ){ //lăn xuống ==> đi tiến
                    scrollContainer.value.scrollTo({
                            top: 0,
                            left: Math.max(scrollAmount.value += cardWidth ),
                            behavior: 'smooth'
                    });
                }else if(event.deltaY < 0 && scrollAmount.value > 0){  // đi lùi
                    scrollContainer.value.scrollTo({
                            top: 0,
                            left: Math.max(scrollAmount.value -= cardWidth ),
                            behavior: 'smooth'
                    });

                }
            }

            ////HORIZONTAL SCROLL cho each
            const scrollContainer2 = ref(null);
            const  scrollAmount2 = ref(0);
            const scrollHori2 = (event)=>{
                if(event.deltaY >0 && scrollAmount2.value <= scrollContainer2.value.offsetWidth ){ //lăn xuống ==> đi tiến
                    scrollContainer2.value.scrollTo({
                            top: 0,
                            left: Math.max(scrollAmount2.value += cardWidth ),
                            behavior: 'smooth'
                    });
                }else if(event.deltaY < 0 && scrollAmount2.value > 0){  // đi lùi
                    scrollContainer2.value.scrollTo({
                            top: 0,
                            left: Math.max(scrollAmount2.value -= cardWidth ),
                            behavior: 'smooth'
                    });

                }
            }

            return{classID,lessonCount,studentList,activeStudentID,noData,currentWorksList,activeStudent,showWorks,
                    isEach,noDataAll,allWorkList,scrollContainer,scrollHori,scrollContainer2,scrollHori2,scrollAmount}
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
            padding-left:3rem;
            height:  54vh;
            width: 100%;
            // background-color: blue;
        }
    }
    .result-filter{
        position: relative;
        width: 100%;
        height: 100%;
        margin-top: -1.5rem;
    }
    .works{
        &-header{
            display: flex;
            align-items: center;
        }
        &-overflow{
            position: absolute;
            width: 104%;
            height: 90%;
            overflow-x: auto;
            overflow-y: hidden;
            top: 0;
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
            flex-wrap: nowrap;
            margin-top: 2.5rem;
            & > * {
                margin-right: 1rem;
                
                &:not(:last-child){
                    
                }
            }
        }
    }
    .toggle-filter{
        padding: 0.5rem 0.6rem 0.5rem 0.6rem;
        cursor: pointer;
        @include transition;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $color-gray-dark;
        &.active{
            background-color: $color-orange;
            border-radius: 10rem;
            color: white;
        }
    }

    .info-box{
        position: absolute;
        top: 2.5rem;
        right: 12%;
        z-index: 98;
    }
    .ava{
        position: absolute;
        z-index: 99;
        top: 2rem;
        right: -5.5rem;
        width: 16rem;
        transform: rotate(-50deg);
        &-image{
            width: 100%;
        }
    }


</style>