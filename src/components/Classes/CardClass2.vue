<template>
    <div class="cards">
        <div class="cards-content">
            <ul>
                <li class="cards-content-name">
                    {{ classiName }}
                </li>
                <li class="cards-content-date">
                    {{ classiDate }}
                </li>
                <li class="cards-content-ID">
                    {{ classiTime }}
                </li>
            </ul>
            <span class="cards-content-icon">
                {{ classi.courseID }}
            </span>
        </div>
        <img class="cards-background" :src="classiPhoto"/>

        <div class="class-edit" @click="$emit('toggleModal')"><i class="material-icons">edit</i></div>
        

    </div>
</template>

<script>
import UpdateClassModal from '@/components/Classes/UpdateClassModal'
import { computed,ref } from 'vue';
export default {
    props: ['classi','type'],
    components: {
        UpdateClassModal
    },
    setup(props){
        
        // Convert raw data to show 
        const classiName = computed(()=>{
            if(!props.classi.id.includes(".")){
                return props.classi.id.substr(0,3) + "." + props.classi.id.substr(3);
            }else {
                return props.classi.id
            }

        })
        const classiDate = computed(()=>{
            let date = props.classi.createdAt.toDate();
            return date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
        })
        const classiTime = computed(()=>{
            return props.classi.timeOccur[0].date + "-" + props.classi.timeOccur[1].date;
        })
        const classiPhoto = computed(()=>{
            return `../assets/png/card-${props.type}.png`
        })

        return {classiName,classiDate,classiTime,classiPhoto}
    }
};
</script>

<style lang="scss" scoped>

.cards {
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    display: inline-block;
    width: 100%;
    height: 100%;
    // z-index: -1;
    

    &-content {
        position: absolute;
        padding: 1rem;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        font-family: "Averta Semi Bold";
        color: rgba($color-white, 0.3);
        line-height: 1.4rem;
        // z-index: 1;

        &-name {
            font-size: 1.2rem;
            color: $color-white;
            margin-bottom: 0.3rem;
            font-family: "Averta Bold";
        }

        &-icon {
            display: flex;
            position: absolute;
            bottom: 0.5rem;
            right: 3.5rem;
        }
    }

    &-background {
        width: 101%;
        height: 101%;
    }
}
.class-edit{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2rem;
    height: 2rem;
    color: white;
    border-radius: 25%;
    position: absolute;
    bottom: 7%;
    left: 4%;
    // z-index: 2;
    @include transition;

    &:hover{
        color: $color-gray-dark;
        
        background-color: $color-gray-light-2;
    }
}

</style>