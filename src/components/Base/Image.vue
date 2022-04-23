<template>
    <img :src="imageTag" alt="" v-if="url">
    <Loading v-else/>
</template>

<script>
    import {ref,computed,watchEffect} from 'vue'
    import getPhoto from '@/composable/getPhoto'
    import Loading from '@/components/Loading'
    import {useStore} from 'vuex'
    export default {
        props:['refUrl'],
        components:{
            Loading
        },
        setup(props){
            // resolve từ ref về https chuârn
            const imageTag = ref(null);
            const store = useStore();
            const url = ref(null);
            const storeUrl = store.getters['images/getImage'](props.refUrl);
            watchEffect(()=>{
                if(storeUrl){ // nếu có
                    imageTag.value = storeUrl;
                    url.value = storeUrl;
                }else{
                    const {error,photoURL, loadPhotoURL} = getPhoto()
                    loadPhotoURL(props.refUrl).then(() => {
                        imageTag.value = photoURL.value;
                        url.value =  photoURL.value;
                        // set vào store để sau dùng
                        store.dispatch('images/addImage', {refUrl:props.refUrl, photoURL: photoURL.value});
                    })
                }
            })


            return {imageTag,url}
        }

    }
</script>

<style lang="scss" scoped>

</style>