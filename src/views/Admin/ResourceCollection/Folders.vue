<template>
    <div class="files-wrapper">
        <Loading v-if="isLoading"/>
        <div class="files-list" v-else>
            <div v-for="file in files" :key="file.id" class="file-card">
                <router-link :to="{name: 'UpdateFile',params: {id: file.id}}" v-if="admin">
                    <span class="file-update"><i class="material-icons">edit</i></span>
                </router-link>

                <a :href="file.link" target="_blank">
                    <img class="file-img" :src="'../../../assets/png/file-'+file.from+'-'+file.type+'.png'">
                    <p class="file-name">{{computedName(file.name)}}</p>
                </a>
            </div>

        </div>
        <NoData :data="'files'" v-if="noData"/>

        <div class="button-create" v-if="admin">
            <button class="btn-create btn waves-effect waves-light red darken-4">
                <router-link :to="{name: 'CreateFile', params: {folder:name}}"><i class="material-icons left">add</i>Create File</router-link>
            </button>
        </div> 
    </div>
</template>

<script>
    import {projectAuth} from '@/firebase/config'
    import Loading from '@/components/Loading'
    import getCollectionFilter from '@/composable/getCollectionFilter'
    import getDoc from '@/composable/getDoc'
    import { computed, ref, watch, watchEffect } from 'vue';
    import {useStore} from 'vuex'
    export default {
        props: ['name'],
        components: {Loading},
        setup(props) {
            //////////check admin, nếu uid ko có trong firestore thì admin giữ nguyên null
            const store = useStore()
            const admin = computed(()=> store.getters['user/getIsAdmin']);


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

            const computedName = (name) => {
                return name.toLowerCase() + '.'
            }

            return {files,error,admin,
                    computedName, isLoading,noData}
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
    .file-img{
        width: 9rem;
    }
    .file-name{
        transform: translateX(-0.5rem);
        text-align: center;
        color: $color-primary;
    }
    .button-create{
        position:absolute;
        bottom: 2.5rem;
        right: 5rem;
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
</style>