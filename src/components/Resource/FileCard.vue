<template>

        <a :href="file.link" target="_blank" v-if="file.type == 'channel'" class="file-wrapper">
            <img class="file-img channel" :src="'../../../assets/png/file-'+file.from+'-'+file.type+'.png'">
            <img v-if="file.ava" :src="file.ava" alt="" class="file-ava channel">
            <p class="file-name channel">{{computedName}}</p>
        </a>

        <a :href="file.link" target="_blank" v-else-if="file.type == 'page'" class="file-wrapper">
            <img class="file-img page" :src="'../../../assets/png/file-'+file.from+'-'+file.type+'.png'">
            <img v-if="file.ava" :src="file.ava" alt="" class="file-ava page">
            <p class="file-name">{{computedName}}</p>
        </a>


        <a :href="file.link" target="_blank" v-else class="file-wrapper">
            <img class="file-img" :src="'../../../assets/png/file-'+file.from+'-'+file.type+'.png'">
            <p class="file-name">{{computedName}}</p>
        </a>

</template>

<script>
    import {ref,computed} from 'vue'
    export default {
        props:['file'],
        setup(props){
            

            const fileSrc = computed(()=>{
                return `@/assets/png/file-${props.file.from}-${props.file.type}.png`
            })

            const computedName = computed(() => {
                return props.file.name.toLowerCase() + '.'
            })

            return{fileSrc,computedName}
        }
    }
</script>

<style lang="scss" scoped>
    .file-wrapper{
        position: relative;
    }
    .file-img{
        width: 9rem;
        z-index: 900;
        &.channel{
            width: 9rem;
            transform: scale(1.1) translateY(0.5rem);
        }
        &.page{

        }
    }
    .file-ava{
        position: absolute;
        z-index: 901;
        &.channel{
            top: 1.9rem;
            left: 1.7rem;
            width: 4.5rem;
            height: 4.5rem;
            border-radius: 50%;
        }
        &.page{
            top: 3.9rem;
            left: 2.8rem;
            width: 3.2rem;
            height: 3.2rem;
            border-radius: 0.2rem;
            transform: skewX(-9deg);
        }
    }

    .file-name{
        transform: translateX(-0.5rem);
        text-align: center;
        color: $color-primary;
        &.channel{
            margin-top: 0.7rem;
        }
    }
</style>