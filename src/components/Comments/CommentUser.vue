<template>
    <div class="comment-user">
        <div class="comment-nav">
            <h3 @click="toggleEdit" v-if="isEditting">Edit</h3>
            <h3  @click="toggleEdit" v-else>Works</h3>
            <span :class="{active: !isEach}" @click="toggleEach(false)">all</span>
            <span :class="{active: isEach}" @click="toggleEach(true)">each</span>
        </div>

        <div class="comment-works overflowList" v-if="!isEach">
            <Loading v-if="isLoading"/>
            <div class="card-container" v-if="activeClassWorks">
                <div v-for="(work,index) in activeClassWorks" :key="index" :class="[{active : isEditting},'overlay']">
                    <WorkCard :work="work"/>
                    <div v-if="isEditting && isAdmin" class="overlay-icon" @click="deleteWork(work)"><i class="material-icons icon">delete_forever</i></div>
                </div>
            </div>
            <NoData :data="'works'" v-if="!isLoading && activeClassWorks == 0"/>
        </div>

        <div class="comment-works overflowList" v-else>
            <Loading v-if="isLoading"/>
            <div class="card-container" v-if="activeStudentWorks">
                    <div v-for="(work,index) in activeStudentWorks" :key="index" :class="[{active : isEditting},'overlay']">
                        <WorkCard :work="work"/>
                        <div v-if="isEditting && isAdmin" class="overlay-icon" @click="deleteWork(work)"><i class="material-icons icon">delete_forever</i></div>
                    </div>
            </div>
            <NoData :data="'works'" v-if="!isLoading && activeStudentWorks == 0"/>
        </div>
    </div>
</template>

<script>
    import {computed, ref,watchEffect} from 'vue'
    import {useStore} from 'vuex'
    import StarRating from 'vue-star-rating'
    import _ from 'lodash'
    import WorkCard from '@/components/Work/WorkCard.vue'
    export default {
        components:{
            StarRating,
            WorkCard
        },
        props:['activeClassID'],
        setup(props) {
            const store = useStore();
            const isAdmin = computed(()=>store.getters['user/getIsAdmin']);
            const isTeacher = computed(()=> store.getters['user/getIsTeacher']);

            
            const isEach = ref(false);
            const isLoading = ref(false);
            const activeStudentID = computed(()=> store.getters['admin/getActiveStudentID']);

            const activeClassWorks = ref(null); // là array
            const activeStudentWorks = computed(()=>{  //react theo activeClassWorks
                if(activeClassWorks.value == null) return null;
                else if(activeClassWorks.value == 0) return 0;
                else return activeClassWorks.value.filter(work => work.studentID == activeStudentID.value);
            })
            

            // watch effect load laji activeClassWorks mỗi khi activeClassID đổi
            watchEffect(async()=>{
                //reset biến
                activeClassWorks.value = null;
                isLoading.value = true;

                const classWorks = store.getters['admin/getClassWorks'](props.activeClassID);
                if(classWorks == null){ // không lấy đc ở kho offline
                    const res = await store.dispatch('admin/loadClassWorks',{classID: props.activeClassID});
                    if(!res){ // không nhảy vào th fetch lỗi = null hoặc =0 do rỗng
                        activeClassWorks.value = res;
                    }
                    isLoading.value = false;
                }else if(classWorks == 0){ // lấy đc nhưng rỗng
                    isLoading.value = false;
                    activeClassWorks.value = null;
                }else{   // lấy được và không rỗng 

                    isLoading.value = false;
                    activeClassWorks.value = classWorks;
                }
            })

            // thay đổi mode each all 
            const toggleEach = (mode) =>{
                isEach.value = mode;
            }



            /////////////////toggle mode edit work
            const isEditting = ref(false);
            const toggleEdit = ()=>{
                if(!isAdmin.value) return false;
                isEditting.value = !isEditting.value
            }
            //xóa works
            // khi xóa class, xóa course, xóa student cũng phải xóa cái này
            const deleteWork = async(work) =>{
                const check = confirm(`Do you want to delete homework ${work.workName}`);
                if(check){
                    await store.dispatch('admin/deleteWork',{workID: work.id,studentID: work.studentID, classID: work.classID});

                }else{
                    toast.info('Delete homework cancel');
                }
            }


            return {isEach,isLoading,isEditting,toggleEdit,isAdmin,isTeacher,
                    activeClassWorks,activeStudentWorks,toggleEach,deleteWork};
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
    padding: 2rem 3rem 0rem 0rem;
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
        margin-bottom: 2rem;
        & > h3{
            margin-right: 1.5rem;
            cursor: pointer;
            @include transition;
            &:hover{
                transform: scale(1.05);
            }
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
        height: 100%;
        padding: 2rem 2rem 0rem 2rem;
        overflow-y: auto;
        border-radius: 2.5rem;
    }
}

.card-container{
    display: flex;
    flex-direction: column;
    padding: 0;
    align-items: flex-start;
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
        bottom: 3.3rem;
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