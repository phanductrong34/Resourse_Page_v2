<template>
    <div class="files-wrapper container">
        <form @submit.prevent="handleSubmit">
            <span class="close" @click="closeModal">
                <i class="material-icons">clear</i>
            </span>
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
                <div class="input-field col s6">
                    <select v-model="from" id="res-from" required>
                        <option value="" disabled selected>Choose your option</option>
                        <option value="web">Web</option>
                        <option value="youtube">Youtube</option>
                    </select>
                    <label for="res-from">From</label>
                </div>
                <div class="input-field col s6">
                    <select v-model="type" id="res-type" required>
                        <option value="" disabled selected>Choose your option</option>
                        <option value="media">Media</option>
                        <option value="doc">Document</option>
                        <option value="tool">Tool</option>
                        <option value="asset">Asset</option>
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
            <div class="row" v-if="errCreate">
                <div class="center error-message">{{errCreate}}</div>
            </div>
            <div class="row">
                <div class="col s6">
                    <button class="button-file waves-effect waves-light btn grey lighten-1" @click.prevent="clearField"><i class="material-icons left">cancel</i>Clear</button>
                </div>
                <div class="col s6">
                    <button class="button-file waves-effect waves-light btn red darken-4"><i class="material-icons left">add</i>Create file</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {ref,onMounted} from 'vue'
    import {timestamp, projectAuth} from '@/firebase/config'
    import useCollection from '@/composable/useCollection'
    import {useRouter} from 'vue-router'
    export default {
        components: {},
        props: ['folder'],
        setup(props) {
            //SET UP FOR DROPDOWN INPUT
            onMounted(() => {
                $(document).ready(function(){
                    $('select').formSelect();
                });
            })

            const {error : errCreate, addDoc} = useCollection("files")
            const router = useRouter();

            //refs
            const name = ref("");
            const from = ref("");
            const type = ref("");
            const folder = ref(props.folder);
            const link = ref("")

            const clearField = ()=>{
                name.value = "";
                from.value = "";
                type.value = "";
                folder.value = "";  
                link.value = ""
            }

            const closeModal = ()=>{
                router.back();
            }

            // Handle submit

            const handleSubmit = async() => {
                const file = {
                    name: name.value,
                    link: link.value,
                    from : from.value,
                    type : type.value,
                    folder : folder.value,
                    createdAt : timestamp(),
                }
                await addDoc(file);
                if(!errCreate.value){
                    alert(`Create new file to ${file.folder} succeed!`);
                    router.push({name : "Folders", params: {name : file.folder}});
                }
            }
            return {name, from,type,folder,link,
                    clearField,handleSubmit,errCreate,closeModal}
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
        padding: 4rem 8rem 4rem 6rem;

    }
    .button-file{
        width: 100%;
    }

    .close{
        position: absolute;
        top: 3rem;
        right: 8rem;
        color: $color-gray-dark;
        cursor: pointer;
    }
</style>