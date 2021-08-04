<template>
    <div class="comment-user">
        <div class="comment-nav">
            <h3>Works</h3>
            <span :class="{active: activeNav == 'all'}" @click="activeNav = 'all'">all</span>
            <span :class="{active: activeNav == 'each'}" @click="activeNav = 'each'">each</span>
        </div>

        <div class="comment-works overflowList" v-if="activeNav =='all'">
            <Loading v-if="isLoadingAll"/>
            <div :class="[{active: work.id == activeWork.id},'work-card']" v-for="work in formatedAllWorks" :key="work.id" v-if="activeWork">
                <div :class="[{graded : work.score},'work-img']">
                    <span>{{work.lessonNumber}}</span>
                    <!-- <Image :refUrl="activeStudent.avaRef"/> -->
                </div>
                <div class="work-content">
                    <div class="work-owner">{{work.studentNickname}}</div>
                    <div class="work-created">{{work.createdAt}}</div>
                </div>
                <a :href="work.workURL" target="_blank">
                    <div class="work-link">
                        <i class="material-icons">chevron_right</i>
                    </div>
                </a>
            </div>
            <NoData :data="'works'" v-if="noDataAll"/>
        </div>

        <div class="comment-works overflowList" v-if="activeNav =='each'">
            <Loading v-if="isLoadingEach"/>
            <div :class="[{active: work.id == activeWork.id},'work-card']" v-for="work in formatedEachWorks" :key="work.id" v-if="activeWork">
                <div class="work-img">
                    <span>{{work.lessonNumber}}</span>
                    <!-- <Image :refUrl="activeStudent.avaRef"/> -->
                </div>
                <div class="work-content">
                    <div class="work-owner">{{work.studentNickname}}</div>
                    <div class="work-created">{{work.createdAt}}</div>
                </div>
                <a :href="work.workURL" target="_blank">
                    <div class="work-link">
                        <i class="material-icons">chevron_right</i>
                    </div>
                </a>
            </div>
            <NoData :data="'works'" v-if="noDataEach"/>
        </div>

        <!-- <div class="comment-form">
            <div class="active-score row">
                <div class="col s10">
                    <star-rating v-model:rating="rating" :increment="0.5" :star-size="32"/>
                </div>
                <button class="active-btn col s2 waves-effect waves-light btn btn-small red darken-4" @click="submitScore">rate</button>
            </div>
            <div class="active-comment">
                <div class="active-chatlist">

                </div>
                <form @submit.prevent="sendComment" class="active-form row">
                    <input class="col s10" type="text">
                    <button class="active-btn col s2 waves-effect waves-light btn btn-small red darken-4">send</button>
                </form>
            </div>
        </div> -->
    </div>
</template>

<script>
    import {computed, ref,watchEffect} from 'vue'
    import {formatDistanceToNow} from 'date-fns'
    import getCollectionFilter from '@/composable/getCollectionFilter'
    import getDoc from '@/composable/getDoc'
    import StarRating from 'vue-star-rating'
    import _ from 'lodash'
    export default {
        components:{
            StarRating
        },
        props:['activeStudentID','activeClassID'],
        setup(props) {
            const activeNav = ref('each');
            const {dataArray : allWorks, error : errAll, load: loadAllWorks} = getCollectionFilter();
            const {dataArray : eachWorks, error : errEach, load: loadActiveWork} = getCollectionFilter();
            const noDataAll = ref(false);
            const isLoadingAll = ref(false);
            const noDataEach = ref(false);
            const isLoadingEach = ref(false);
            
            const activeStudent = computed(()=>{
                const {data , error, load} = getDoc("students");
                load(props.activeStudentID);
                return data.value || null;
            })

            //star
            const activeWork = ref(null);
            const rating = ref(0);
            
            // watch activeNav đổi mode, watch activeStudent đổi
            watchEffect(async()=>{
                if(activeNav.value == 'all'){
                    allWorks.value = [];
                    eachWorks.value = null;
                    activeWork.value = null;
                    rating.value = 0;
                    noDataAll.value = false;
                    isLoadingAll.value = true;
                    
                    await loadAllWorks("works","classID",props.activeClassID);
                    isLoadingAll.value = false;
                    if(!allWorks.value.length){ //nếu load về array rỗng
                        noDataAll.value = true;
                    }else{
                        noDataAll.value = false;
                        activeWork.value = allWorks.value[0];
                        rating.value = activeWork.value.score;
                    }
                }else if(activeNav.value == 'each'){
                    eachWorks.value = [];
                    noDataEach.value = false;
                    activeWork.value = null;
                    rating.value = 0;
                    isLoadingEach.value = true;

                    await loadActiveWork("works","studentID",props.activeStudentID);
                    isLoadingEach.value = false;
                    if(!eachWorks.value.length){
                        noDataEach.value = true;
                    }else{ 
                        noDataEach.value = false;
                        activeWork.value = eachWorks.value[0];
                        rating.value = activeWork.value.score;
                    }
                }    
                
            })
            const formatedAllWorks = computed(()=>{
                return allWorks.value.map(work => {
                    let time = formatDistanceToNow(work.createdAt.toDate());
                    return {...work, createdAt: time};
                })
            })
            const formatedEachWorks = computed(()=>{
                return eachWorks.value.map(work => {
                    let time = formatDistanceToNow(work.createdAt.toDate());
                    return {...work, createdAt: time};
                })
            })

            //submit score
            const submitScore = (()=>{
                console.log(rating.value)
            })



            return {activeNav,formatedAllWorks,formatedEachWorks,noDataAll,noDataEach,activeStudent,isLoadingAll,isLoadingEach,
                    rating,activeWork,submitScore};
        }
    }
</script>

<style lang="scss" scoped>
.comment-user{
    width: 110%;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(19%,-50%);
    padding: 2rem 3rem 2rem 0rem;
    background-color: white;
    @include card-shadow;
    height: 100%;
    border-radius: 2rem;
    display:flex;
    flex-direction: column;
}
.comment{
    &-nav{
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: flex-end;
        font-size: 1.5rem;
        & > h3{
            margin-right: 1.5rem;
        }
        & span{ 
                transform: translateY(-0.2rem);
                color: $color-gray-light-1;
                margin-right: 0.8rem;
                cursor: pointer;
                position: relative;
                transition: all 0.15s ease-in-out;
                &::before{
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: -1px;
                    width: 0%;
                    height: 3px;
                    background-color: $color-primary;
                    transition: all 0.15s ease-in-out
                }

                &:hover{
                    color: $color-gray-dark;
                }
                &.active:hover{
                    color: darken($color-primary, 10);
                }
                &.active{
                    color: $color-primary;
                    position: relative;
                    &::before{
                        width: 100%;
                    }

                }
        }
    }
    &-works{
        display: flex;
        flex-direction: column;
        height: 60%;
        padding: 2rem 2rem 0rem 2rem;
        overflow-y: auto;
    }
    &-form{
        height: 40%;
        padding: 0 2rem 1rem 2rem;
        margin-top: auto;
    }
}

.work{
    &-card{
        display: flex;
        width: 100%;
        padding: 0.8rem 1rem 0.8rem 1rem;
        background-color: white;
        @include card-shadow;
        border-radius: 0.8rem;
        align-items: center;
        margin-bottom: 1rem;
        position: relative;
        cursor: pointer;
        @include transition;
        &:hover{
            transform: scale(1.05);
        }
        z-index: 1;
        &.active{
            &::after{
                content: "";
                position: absolute;
                width: 101%;
                height: 103%;
                top: -2px;
                left: -2px;
                z-index: -2;
                border-radius: 0.8rem;
                border: 3px solid $color-primary;
            }
        }
    }
    &-img{
        width: 2.8rem;
        height: 2.8rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        color: white;
        margin-right: 1rem;
        font-size: 1.5rem;
        background-color: $color-gray-light-1;
        &.graded{
            background-color: $color-primary;
        }
    }
    &-content{

    }
    &-owner{
        font-size: 1.3rem;
    }
    &-created{

    }
    &-link{
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.5rem;
        border-radius: 0 0.8rem 0.8rem 0;
        color: black;
        @include transition;
        &:hover{
            cursor: pointer;
            background-color: $color-gray-light-2;
        }
    }
}
.active{
    &-score{
        display: flex;
    }
    &-star{

    }
    &-submit{

    }
    &-comment{

    }
    &-chatlist{

    }
    &-form{
        & input{

        }
    }
    &-btn{
        font-family: "Averta Semi Bold";
        border-radius: 5rem;
        text-transform: lowercase;
        font-size: 1rem;
    }
}


</style>