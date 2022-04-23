<template>
    <div class="files-wrapper container">
        <div class="header">
            <h3 class="center">Create {{folder}}</h3>
        </div>
        <form @submit.prevent="handleSubmit" class="form-container">
            <span class="close" @click="closeModal">
                <i class="material-icons">clear</i>
            </span>
            <div class="row">
                <div class="input-field col s6">
                    <input id="res-name" type="text" class="validate" v-model="name" required>
                    <label class="active"  for="res-name">Name</label>
                </div>
                <div class="input-field col s6">
                    <input id="res-link" type="text" class="validate" v-model="link" required>
                    <label class="active"  for="res-link">Link</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <input id="res-des" type="text" class="validate" v-model="description"  maxlength="75">
                    <label class="active"  for="res-des">Description</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s6">
                    <select v-model="from" id="res-from">
                        <option value="" disabled selected>Choose your option</option>
                        <option value="web">Web</option>
                        <option value="youtube">Youtube</option>
                    </select>
                    <label for="res-from">From</label>
                </div>
                <div :class="[{disable : !from.length},'type-wrapper','input-field','col','s6']">
                    <div v-if="from !== 'youtube'">
                        <select v-model="type" id="res-type">
                            <option value="" disabled selected>Choose your option</option>
                            <option value="media">Media</option>
                            <option value="doc">Document</option>
                            <option value="tool">Tool</option>
                            <option value="asset">Asset</option>
                            <option value="page">Page</option>
                            <option value="channel">Channel</option>
                        </select>
                        <label for="res-type">Type</label>  
                    </div>
                    <div v-else>
                        <select v-model="type" id="res-type">
                            <option value="" disabled selected>Choose your option</option>
                            <option value="media">Media</option>
                            <option value="channel">Channel</option>
                        </select>
                        <label for="res-type">Type</label>  
                    </div>
                </div>
            </div>
            <div class="row" v-if="type == 'page' || type == 'channel'">
                <div class="input-field col s11">
                    <input id="res-ava" type="text" class="validate" v-model="ava" required>
                    <label class="active"  for="res-ava">Profile Picture</label>
                </div>
                <div class="col s1 thumb-wrapper">
                    <img v-if="ava" class="thumb-img" :src="ava" alt="">
                </div>
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
    import {ref,onMounted, watch, watchEffect} from 'vue'
    import {timestamp} from '@/firebase/config'
    import {useRouter} from 'vue-router'
    import {useStore} from 'vuex'
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


            const store = useStore();
            const router = useRouter();

            //refs
            const name = ref("");
            const from = ref("");
            const type = ref("");
            const link = ref("")
            const ava = ref("");;
            const description = ref("");

            const clearField = ()=>{
                name.value = "";
                link.value = "";
                ava.value = "";
                description.value = "";
            }

            const closeModal = ()=>{
                router.back();
            }

            //init lại select option của type khi chọn from
            watchEffect(()=>{
                const trigger = from.value;
                $(document).ready(function(){
                    $('select').formSelect();
                });
            })


            // Handle submit

            const handleSubmit = async() => {

                const newFile = {
                    name: name.value,
                    link: link.value,
                    from : from.value,
                    type : type.value,
                    folder : props.folder,
                    createdAt : timestamp(),
                    description: description.value
                }
                if(type.value == 'page' || type.value == 'channel'){
                    newFile.ava = ava.value
                }
                const res = await store.dispatch('admin/createFile',{
                    newFile: newFile
                })
                if(res){
                    router.push({name : "Folders", params: {name : newFile.folder}});
                    console.log(newFile);
                }

            }
            return {name, from,type,link,ava,description,
                    clearField,handleSubmit,closeModal}
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
    }
    .header{
        position: absolute;
        top: 4rem;
        left: 50%;
        transform: translateX(-50%);

    }
    .form-container{
        width: 100%;
        margin-top: 4rem;

    }
    .button-file{
        width: 100%;
    }

    .close{
        position: absolute;
        top: 5rem;
        right: 8rem;
        color: $color-gray-dark;
        cursor: pointer;
    }
    .thumb{
        &-wrapper{
            margin-top: 1.2rem;
        }
        &-img{
            width: 100%;
            height: 100%;
            border-radius: 0.3rem;
        }
    }
    .type-wrapper{
        pointer-events: all;
        &.disable{
            pointer-events: none;
            opacity: 0.5;
        }
    }
</style>