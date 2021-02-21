<template>
    <div class="files-wrapper">
        <div class="button-create">
            <button class="btn-create btn waves-effect waves-light red darken-4">
                <router-link :to="{name: 'CreateFile'}"><i class="material-icons left">add</i>Create File</router-link>
            </button>
        </div> 
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
    .files-wrapper{
        width: 100%;
        height: 100%;
        background-color: white;
        @include card-shadow-3;
        border-radius: 3rem 0 0 3rem;
        padding: 4rem;
        padding-right: 6rem;
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