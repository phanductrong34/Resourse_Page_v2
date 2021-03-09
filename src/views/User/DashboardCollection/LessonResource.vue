<template>
    <div class="lesson-resource">
        <div class="resource-container">
            <div class="resource-info">
                <h4>FILE RESOURCE</h4>
                <h5>Project files use in this lesson</h5>
                <a :href="lesson.homeworkURL" target="_blank">
                    <span>See the file</span> 
                    <i class="material-icons">arrow_forward</i>
                </a>
            </div>
            <div class="element">
                <img class="image" src="@/assets/png/lesson-folder.svg" alt="">
                <span class="red-circle"></span>
            </div>

        </div>
        <div class="resource-container">
            <div class="resource-info">
                <h4>VIDEO RESOURCE </h4>
                <h5>Playlist to improve you skill</h5>
                <a :href="lesson.playlistURL" target="_blank">
                    <span>See the playlist</span> 
                    <i class="material-icons">arrow_forward</i>
                </a>
            </div>
            <div class="element">
                <img class="image" src="@/assets/png/lesson-playlist.svg" alt="">
                <span class="red-circle"></span>
            </div>
        </div>
    </div>
</template>

<script>
    import {useStore} from 'vuex'
    export default {
        props:['lesson'],
        setup(props) {

        }
    }
</script>

<style lang="scss" scoped>
.lesson-resource{
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.resource-container{
    overflow: hidden;
    background-color: white;
    height: 43%;
    width: 150%;
    padding: 2rem 0 2rem 4rem;
    transform: translateX(-5%);
    @include card-shadow;
    border-radius: 2rem;
    display: flex;
    @include transition;
    cursor: pointer;

    //hover effect
    &:hover{
        transform: translateX(-6%) scale(1.01);
    }
    &:hover .image{
        transform: translate(-5%, 45%) scale(1.3);
    }
    &:hover .red-circle{
        right: -20%;
        top: -32%;
    }

}
.resource-info{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
    align-items: flex-start;
    & > * {
        &:not(:last-child){
            margin-bottom: 0.7rem;
        }
    }
    & h4{
        font-family: "Averta Bold";
    }
    & h5{
        color: $color-gray-dark;
    }
    & a{
        display: flex;
        align-items: center;
        font-size: 1.6rem;
        color: white;
        padding: 0.2rem 1rem 0.2rem 1rem;
        background-color: $color-orange;
        border-radius: 10rem;
        @include transition;
        & span{
            margin-right: 0.5rem;
            @include transition;
        }
        &:hover{
            transform: scale(1.05);
        }
        &:hover span{
            margin-right: 1.5rem;
        }
    }
}
.element{
    width: 50%;
    height: 100%;
    position: relative;
    & img{
        position: absolute;
        transform: translate(0, 50%) scale(1.2);
        bottom:53%;
        right: 10%;
        height: 100%;
        width: 70%;
        z-index: 1;
        transition: all 0.2s ease;
    }
    & .red-circle{
        position: absolute;
        display: block;
        top: -30%;
        right: -27%;
        width: 30rem;
        height: 30rem;
        border-radius: 50%;
        background-color: $color-primary;
        z-index: -1;
        transition: all 0.2s ease-out;
    }

}

</style>