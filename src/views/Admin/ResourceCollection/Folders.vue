<template>
    <div class="files-wrapper">
        <Loading v-if="isLoading"/>
        <div class="files-list" v-else>
            <div v-for="file in files" :key="file.id" class="file-card" @mouseenter="showTooltip(file)" @mouseleave="hideTooltip()">
                <router-link :to="{name: 'UpdateFile',params: {id: file.id}}" v-if="isAdmin || isTeacher">
                    <span class="file-update"><i class="material-icons">edit</i></span>
                </router-link>
                <FileCard :file="file"/>

            </div>

        </div>
        <NoData :data="'files'" v-if="noData"/>
        <div class="bottom">
            <div :class="[{active : haveTooltip},'tooltip']">
                <p>{{tooltip}}</p>
            </div>
            <div class="button-create" v-if="isAdmin">
                <button class="btn-create btn waves-effect waves-light red darken-4">
                    <router-link :to="{name: 'CreateFile', params: {folder:name}}"><i class="material-icons left">add</i>Create File</router-link>
                </button>
            </div> 
        </div>
    </div>
</template>

<script>
    import FileCard from '@/components/Resource/FileCard.vue'
    import {projectAuth} from '@/firebase/config'
    import getCollectionFilter from '@/composable/getCollectionFilter'
    import getDoc from '@/composable/getDoc'
    import { computed, ref, watch, watchEffect, onMounted} from 'vue';
    import {useStore} from 'vuex'
    import { onBeforeRouteLeave } from 'vue-router'
    export default {
        props: ['name'],
        components: {FileCard},
        setup(props) {

            //////////check admin, nếu uid ko có trong firestore thì admin giữ nguyên null
            const store = useStore()
            const isAdmin = computed(()=>store.getters['user/getIsAdmin']);
            const isTeacher = computed(()=> store.getters['user/getIsTeacher']);


            //chỉ lấy những resource có folder trùng với props.name truyền vào thôi

            const {dataArray :files, error, load} = getCollectionFilter();
            
            //Mồi lần đổi route là phải bắt sự thay đổi của props truyền vào (ở đây là name) để fetch lại data
            const isLoading = ref(false);
            const noData = ref(false)
            watchEffect(async()=>{
                isLoading.value = true;  // bật loading
                noData.value = false;    // tắt noData
                await load("files","folder",props.name);  //load xong
                isLoading.value = false;  // tắt loading
                if(files.value.length == 0){
                    noData.value = true  //nếu ko có data thì hiện 
                }
                 
            })



            //Show tooltip
            const haveTooltip = ref(false);
            const tooltip = ref(null)
            const showTooltip = (file)=>{
                if(!file.description){ // nếu rỗng
                    tooltip.value = file.name
                    haveTooltip.value = true;
                }else{
                    tooltip.value = file.description;
                    haveTooltip.value = true;
                }
            }
            const hideTooltip = ()=>{
                haveTooltip.value = false;
            }

//////////// PREVENT BACK TO RESOURCE
            onBeforeRouteLeave((to, from, next) => {
                if (to.name == "Resource") {
                    next(false)
                } else {
                    next();
                }
            })

            return {files,error,showTooltip,tooltip,hideTooltip,haveTooltip,
                     isLoading,noData,isAdmin,isTeacher}
        }
    }
</script>

<style lang="scss" scoped>
    .files-wrapper{
        width: 100%;
        height: 100%;
        background-color: white;
        @include card-shadow-3;
        border-radius: 3rem 0 0 3rem;
        padding: 4rem 6rem 6rem 4rem;
        padding-right: 4rem;


    }
    .files-list{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: flex-start;
    }
    .file-card{
        display: flex;
        align-self: flex-start;
        position: relative;
        flex-direction: column;
        align-items: center;
        margin-right: 2rem;
        margin-bottom: 1.5rem;
        transition: all 0.2s ease;
        cursor: pointer;
        &:hover{
            transform: scale(1.02);
        }
    }
    .file-update{
        background-color: $color-gray-light-2;
        padding: 5px;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 34px;
        right: -11px;
        z-index: 1;
        color: $color-gray-dark;
        transition: all 0.2s ease;
        & :hover{
            transform: scale(1.1);
            color: $color-primary;
        }
    }

    .button-create{
        & button{
            border-radius: 10rem;
            text-transform: lowercase;
            font-family: "Averta Semi Bold";
            font-size: 15px;
            & a{
                color: white;
            }
        }
    }
    .bottom{
        position:absolute;
        bottom: 2.5rem;
        right: 5rem;
        display: flex; 
        justify-content: space-between;
        width: 86%;
    }
    .tooltip{
        @include transition;
        opacity: 0;
        display: flex;
        align-items: center;
        color: $color-gray-dark;
        font-size: 1.2rem;
        padding: 0 0.5rem;
        max-width: 80%;
        &.active{
            opacity: 1;
        }
    }
</style>