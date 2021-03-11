<template>
    <div class="files-wrapper container">
        <form @submit.prevent="handleSubmit">
            <span class="close" @click="closeModal">
                <i class="material-icons">clear</i>
            </span>
            <div class="row">
                <h3 class="center">Update File</h3>
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
            <div class="row" v-if="errGet">
                <div class="center error-message">{{errGet}}</div>
            </div>
            <div class="row" v-if="errUpdate">
                <div class="center error-message">{{errUpdate}}</div>
            </div>
            <div class="row" v-if="errRemove">
                <div class="center error-message">{{errRemove}}</div>
            </div>
            <div class="row">
                <div class="col s4">
                    <button class="button-file waves-effect waves-light btn grey lighten-1" @click.prevent="deleteFile"><i class="material-icons left">delete</i>Delete File</button>
                </div>
                <div class="col s4">
                    <button class="button-file waves-effect waves-light btn grey lighten-1" @click.prevent="clearField"><i class="material-icons left">cancel</i>Clear</button>
                </div>
                <div class="col s4">
                    <button class="button-file waves-effect waves-light btn red darken-4"><i class="material-icons left">add</i>Update file</button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
    import {ref,onMounted} from 'vue'
    import {timestamp, projectAuth} from '@/firebase/config'
    import getDoc from '@/composable/getDoc'
    import updateDoc from '@/composable/updateDoc'
    import removeDoc from '@/composable/removeDoc'
    import {useRouter} from 'vue-router'
    export default {
        components: {},
        props: ['id'],
        setup(props) {
            //SET UP FOR DROPDOWN INPUT
            onMounted(() => {
                $(document).ready(function(){
                    $('select').formSelect();
                });
            })
            //getAdmin password for further check
            const password = ref("")
            const {data : admin, error : errAdmin, load: loadAdmin} = getDoc("admins");
            if(!errAdmin.value && projectAuth.currentUser){
                loadAdmin(projectAuth.currentUser.uid)
                .then(()=>{
                    password.value = admin.value.password;
                })
            }


            const {data : doc, error : errGet, load} = getDoc("files")
            const {error : errRemove, remove} = removeDoc("files");
            const {error : errUpdate, update} = updateDoc("files")
            const router = useRouter();

            //refs
            const name = ref("");
            const from = ref("");
            const type = ref("");
            const folder = ref("");
            const link = ref("")

            //fetch lấy data cho vào các field
            load(props.id).then(()=>{
                name.value = doc.value.name;
                from.value = doc.value.from;
                type.value = doc.value.type;
                folder.value = doc.value.folder;
                link.value = doc.value.link;
            })

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

            
            //delete file khỏi collection (check password admin thì mới được xóa)
            const deleteFile = async() => {
                //console.log("user pass",projectAuth.currentUser.password)
                const check = prompt("Type your admin password to delete");
                if(check != null && check == password.value){
                    await remove(props.id);
                    if(!errRemove.value){
                        alert("Delete File succeed!")
                        router.back();
                    }
                }else{
                    alert ("Password Incorrect. Failed to delete File")
                }
            }

            // Handle submit để update
            const handleSubmit = async() => {
                const file = {
                    name: name.value,
                    link: link.value,
                    from : from.value,
                    type : type.value,
                    folder : folder.value,
                    createdAt : timestamp(),
                }
                await update(props.id,file);
                if(!errUpdate.value){
                    alert(`Update File succeed!`);
                    router.back();
                }
            }
            return {name, from,type,folder,link,doc, 
                    clearField,handleSubmit,closeModal,deleteFile,
                    errUpdate,errGet,errRemove}
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