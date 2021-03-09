<template>
    <div class="resource page">
        <div class="folder-container" v-if="folders">
            <div v-for="folder in folders" :key="folder.id" class="folder-card">
                <router-link :to="{name: 'Folders',params: {name:folder.name}}">
                    <img class="folder-img" src="../../assets/png/folder.png">
                    <p class="folder-name">{{folder.name}}</p>
                </router-link>
            </div>
        </div>
        <div class="folder-container" v-else>
            <Loading/>
        </div>
        <div class="file-container">
            <router-view/>
            <!-- <div v-if="folders" class="lottie-treasure"></div> -->
        </div>
    </div>
</template>

<script>
import getCollectionRT from '@/composable/getCollectionRT'
import {ref, onMounted,watch} from 'vue'
import {useRouter} from 'vue-router'
import lottie from 'lottie-web'

export default {
    components: {
    },
    setup() {

    //SETUP lottieJs cho treasure
        // onMounted(()=>{
        //     lottie.loadAnimation({
        //         container: document.querySelector(".lottie-treasure"), // the dom element that will contain the animation
        //         renderer: 'svg',
        //         loop: true,
        //         autoplay: true,
        //         path: '../../assets/anim/resource-treasure.json' // the path to the animation json
        //     });

        // })
        const {documents: folders,error: errFolders} = getCollectionRT("folders");

        // ngay khi có folder, đẩy nó liền vào thằng đầu tiên 
        // const router = useRouter();

        const router = useRouter();
        watch(folders, ()=>{
            if(folders.value != null){
                const firstFolder = ((folders.value)[0]).name;
                router.push({name: 'Folders', params: {name: firstFolder}})
            }
        })
        return {folders,errFolders}
    }
}
</script>

<style lang="scss" scoped>
    .resource{
        display: flex;
        width: 100%;
        height: 100%;
    }
    //FOLDER
    .folder-container{
        width: 25%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 1rem;
        margin-top: 2rem;
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


    .folder-card{
        position: relative;
        display: flex;
        justify-content: center;
        margin-bottom: 3rem;
        transition: all 0.2s ease;
        cursor: pointer;
        &:hover{
            transform: scale(1.1);
        }
    }
    .folder-img{
        width: 9.2rem;
    }
    .folder-name{
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translate(-50%,-50%);
        font-size: 1.4rem;
        color: $color-black;
        transition: all 0.2s ease;
    }
    .router-link-exact-active .folder-name{
        color: $color-primary;
        font-size: 2rem;
    }
    //FILE
    .file-container{
        width: 100%;
        transform: translateX(5rem);

    }
    // .lottie-treasure{
    //     width: 40rem;
    //     position: absolute;
    //     top: 50%;
    //     right: 0%;
    //     transform: translate(-50%,-50%);
    //     z-index: -1;
    // }

</style>