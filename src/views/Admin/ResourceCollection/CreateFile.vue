<template>
    <div class="files-wrapper container">
        <form @submit.prevent="">
            <div class="row">
                <h3 class="center">Create File</h3>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <input id="res-name" type="text" class="validate" v-model="name" required>
                    <label class="active"  for="res-name">Name</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <input id="res-link" type="text" class="validate" v-model="link" required>
                    <label class="active"  for="res-link">Link</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <select v-model="from" id="res-from" required>
                        <option value="" disabled selected>Choose your option</option>
                        <option value="web">Web</option>
                        <option value="youtube">Youtube</option>
                    </select>
                    <label for="res-from">From</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <select v-model="type" id="res-type" required>
                        <option value="" disabled selected>Choose your option</option>
                        <option value="media">Media</option>
                        <option value="doc">Document</option>
                        <option value="tool">Tool</option>
                    </select>
                    <label for="res-type">Type</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <input id="res-folder" type="text" class="validate" v-model="folder" required>
                    <label class="active"  for="res-folder">Folder</label>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {ref,onMounted} from 'vue'
    export default {
        components: {},
        setup() {
            //SET UP FOR DROPDOWN INPUT
            onMounted(() => {
                $(document).ready(function(){
                    $('select').formSelect();
                });
            })

            //refs
            const name = ref("");
            const from = ref("");
            const type = ref("");
            const folder = ref("");

            return {name, from,type,folder}
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
        padding: 4rem;
        padding-right: 6rem;
    }
</style>