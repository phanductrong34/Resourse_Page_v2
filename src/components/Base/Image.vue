<template>
    <img ref="imageTag" src="" alt="" v-if="photoURL">
    <Loading v-else/>
</template>

<script>
    import {ref} from 'vue'
    import getPhoto from '@/composable/getPhoto'
    import Loading from '@/components/Loading'
    export default {
        props:['refUrl'],
        components:{
            Loading
        },
        setup(props){
            // resolve từ ref về https chuârn
            const imageTag = ref(null);
            const {error,photoURL, loadPhotoURL} = getPhoto()
            loadPhotoURL(props.refUrl).then(() => {
                imageTag.value.src = photoURL.value;
            }).catch((err) => {
                
            });
            return {imageTag,photoURL}
        }

    }
</script>

<style lang="scss" scoped>

</style>