<template>
    <div class="files-wrapper container">
        <div class="header">
            <h3 class="center">Update {{folder}}</h3>
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
                    <select v-model="folder" id="res-folder">
                        <option value="" disabled selected>Choose folder</option>
                        <option v-for="folder in folderList" :key="folder" :value="folder">{{folder}}</option>
                    </select>
                    <label for="res-folder">Move to different folder</label>
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
                    <input id="res-des" type="text" class="validate" v-model="description" maxlength="75">
                    <label class="active"  for="res-des">Description</label>
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
            <div class="row" v-if="isAdmin">
                <div class="col s6">
                    <button class="button-file waves-effect waves-light btn grey lighten-1" @click.prevent="deleteFile"><i class="material-icons left">delete</i>Delete File</button>
                </div>
                <div class="col s6">
                    <button class="button-file waves-effect waves-light btn red darken-4"><i class="material-icons left">add</i>Update file</button>
                </div>
            </div>
            <div class="row" v-if="isTeacher">
                <div class="col s12">
                    <button class="button-file waves-effect waves-light btn red darken-4"><i class="material-icons left">add</i>Update file</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {ref,onMounted, watchEffect,computed} from 'vue'
    import {timestamp, projectAuth} from '@/firebase/config'
    import getDoc from '@/composable/getDoc'
    import {useRouter} from 'vue-router'
    import {useStore} from 'vuex'
    export default {
        components: {},
        props: ['id'],
        setup(props) {

            const {data : doc, error : errGet, load} = getDoc("files")
            const store = useStore();
            const isAdmin = computed(()=>store.getters['user/getIsAdmin']);
            const isTeacher = computed(()=> store.getters['user/getIsTeacher']);

            const router = useRouter();

            //refs
            const name = ref("");
            const folder = ref("");
            const link = ref("")
            const description = ref("")
            const type = ref("")
            const ava = ref("");
            const folderList = ref(['channel','stock','sfx','other','playlist','plugin','font'])


            //fetch lấy data cho vào các field
            load(props.id).then(()=>{
                name.value = doc.value.name;
                folder.value = doc.value.folder;
                link.value = doc.value.link;
                description.value = doc.value.description;
                type.value = doc.value.type;
                ava.value = doc.value.ava;

                const index = folderList.value.findIndex(fol => fol == folder.value);
                folderList.value.splice(index,1)

                $(document).ready(function(){
                    $('select').formSelect();
                });
            })

            const clearField = ()=>{
                name.value = "";
                folder.value = "";  
                link.value = "";
                description.value = ""
                ava.value = doc.value.ava;
            }

            const closeModal = ()=>{
                router.back();
            }

            
            //delete file khỏi collection (check password admin thì mới được xóa)
            const deleteFile = async() => {
                if(!isAdmin.value) return false;
                const res  = await store.dispatch('admin/deleteFile',{
                    fileID: props.id,
                    folder: folder.value
                })
                if(res){
                    router.push({name : "Folders", params: {name : folder.value}});
                }
            }

            // Handle submit để update
            const handleSubmit = async() => {
                const updatedFile = {
                    name: name.value,
                    link: link.value,
                    description: description.value || "",
                    createdAt : timestamp(),
                    folder: folder.value
                }
                if(type.value == 'channel' || type.value == 'page'){
                    updatedFile.ava = ava.value;
                }
                const res = await store.dispatch('admin/updateFile',{
                    fileID: props.id,
                    updatedFile: updatedFile,
                    folder: folder.value
                })
                if(res){
                    router.push({name : "Folders", params: {name : folder.value}});
                }
            }

            return {name,link,doc, description,type,ava,folderList,folder,
                    clearField,handleSubmit,closeModal,deleteFile,isAdmin,isTeacher}
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
</style>