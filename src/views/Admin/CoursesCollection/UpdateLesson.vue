<template>
    <div class="create-course">
        <div class="back-button" @click="closeModal"><i class="small material-icons">arrow_back</i></div>
        <h3 class="title center">Update Lesson {{number}}</h3>
        <div class="create-container">
            <form @submit.prevent="handleSubmit" class="container form-container">

                <div class="row">
                    <div class="input-field col s12">
                        <input id="lesson-name" type="text" class="validate" v-model="name" required>
                        <label class="active"  for="lesson-name">Lesson name</label>
                    </div>
                </div>

                <div class="row">
                    <div class="input-field col s10">
                        <input id="lesson-thumbnail" type="text" class="validate" v-model="thumbnailRef" required>
                        <label class="active"  for="lesson-thumbnail">Lesson Thumbnail Ref</label>
                    </div>
                    <div class="col s2 check-container">
                        <button class="btn-check waves-effect waves-light btn" @click.prevent="checkPhoto">Load</button>
                        <div class="result-img" ref="resultImg"></div>
                    </div>
                </div>

                <div class="row">
                    <div class="input-field col s12">
                        <input id="lesson-tags" type="text" class="validate" v-model="selectedTag" @keydown.tab.prevent="addTag">
                        <label class="active"  for="lesson-tags">Lesson Tags (hit tab to add)</label>
                    </div>
                    <div class="col s12 tag-list" v-if="tags.length">
                        <span class="tag" v-for="tag in tags" :key="tag">
                            <p>{{tag}}</p>
                            <i class="material-icons" @click.prevent ="deleteTag(tag)">close</i>
                        </span>
                    </div>
                </div>

                <div class="row">
                    <div class="input-field col s12">
                        <textarea id="textarea" class="materialize-textarea" data-length="200" required v-model="description"></textarea>
                        <label class="active" for="textarea">Description</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s4">
                        <input id="lesson-homework" type="text" class="validate" v-model="homeworkURL" required>
                        <label class="active"  for="lesson-homework">Homework URL</label>
                    </div>
                    <div class="input-field col s4">
                        <input id="lesson-playlist" type="text" class="validate" v-model="playlistURL" required>
                        <label class="active"  for="lesson-playlist">Youtube URL</label>
                    </div>
                    <div class="input-field col s4">
                        <input id="lesson-slide" type="text" class="validate" v-model="slideURL" required>
                        <label class="active"  for="lesson-slide">Slide URL</label>
                    </div>
                </div>                
                            

                <div class="row" v-if="error">
                    <div class="error-message center">{{error}}</div>
                </div>
                <div class="row" v-if="errRemove">
                    <div class="error-message center">{{errRemove}}</div>
                </div>
                <div class="row" v-if="errUpdate">
                    <div class="error-message center">{{errUpdate}}</div>
                </div>
                <div class="row" v-if="errLesson">
                    <div class="error-message center">{{errLesson}}</div>
                </div>
                <div class="row">
                    <div class="col s4">
                        <button class="button-course waves-effect waves-light btn grey lighten-1" @click.prevent="deleteLesson"><i class="material-icons left">delete</i>Delete Lesson</button>
                    </div>
                    <div class="col s4">
                        <button class="button-course waves-effect waves-light btn grey lighten-1" @click.prevent="clearField"><i class="material-icons left">cancel</i>Clear</button>
                    </div>
                    <div class="col s4">
                        <button class="button-course waves-effect waves-light btn red darken-4"><i class="material-icons left">add</i>Update Lesson</button>
                    </div>
                </div>

            </form>

        </div>
    </div>
</template>

<script>
    import {ref,onMounted} from 'vue'
    import {useRouter} from 'vue-router'
    import {timestamp,projectFirestore} from '@/firebase/config'
    import getDoc from '@/composable/getDoc'
    import updateDoc from '@/composable/updateDoc'
    import removeDoc from '@/composable/removeDoc'
    import getPhoto from '@/composable/getPhoto'
    export default {
        props: ['id','courseID'],
        setup(props) {
            //SET UP FOR DROPDOWN INPUT
            onMounted(() => {
                $(document).ready(function(){
                    $('select').formSelect();
                    $('#textarea').characterCounter();
                });
            })

            const router = useRouter();
            const {error :errPhoto,photoURL, loadPhotoURL} = getPhoto();
            const {error: errUpdate, update} = updateDoc("lessons");
            const {data : lesson, error : errLesson, load: loadLesson} = getDoc("lessons");
            const {error: errRemove, remove} = removeDoc("lessons");

            //ref//
            const error = ref(null);
            const number = ref("");
            const name = ref("");
            const thumbnailRef = ref("");
            const selectedTag = ref("");
            const tags = ref([]);
            const description = ref("");
            const homeworkURL = ref("");
            const playlistURL = ref("");
            const slideURL = ref("");

            //load data 
            loadLesson(props.id).then(()=>{
                number.value = lesson.value.number
                name.value = lesson.value.name
                thumbnailRef.value = lesson.value.thumbnailRef
                selectedTag.value = lesson.value.selectedTag
                tags.value = lesson.value.tags
                description.value = lesson.value.description
                homeworkURL.value = lesson.value.homeworkURL
                playlistURL.value = lesson.value.playlistURL
                slideURL.value = lesson.value.slideURL
            })

            const closeModal = ()=>{
                router.back();
            }

            const clearField = ()=>{
                error.value = null;
                name.value = "";
                thumbnailRef.value = "";
                tags.value = [];
                description.value = "";
                homeworkURL.value = "";
                playlistURL.value = "";
                slideURL.value = "";
            }
            const deleteLesson = async()=>{
                await remove(props.id);
                if(!errRemove.value){
                    alert("Delete lesson succeed");
                    router.push({name: "Lessons", params: {id: props.courseID}})
                }
            }

            const resultImg = ref(null);
            const checkPhoto = async()=>{
                //getPhotoUrl xem có ra không
                errPhoto.value = null;
                resultImg.value.style = "";

                await loadPhotoURL(thumbnailRef.value);
                if(!errPhoto.value){  //nếu không có lỗi và fetch đc ảnh
                    resultImg.value.style = `background-image: url(${photoURL.value})`;
                }else{ // nếu có lỗi
                     resultImg.value.style = `background-color: red; border-radius: 50%;`;
                }

            }

            const addTag = ()=>{
                //check nếu selectedTag không rỗng và không tồn tại trong array tags
                if(selectedTag.value.length !== 0 && !tags.value.includes(selectedTag.value)){
                    tags.value.push(selectedTag.value);
                    selectedTag.value = "";
                }
            }
            const deleteTag = (tagRemove)=> {
                tags.value = tags.value.filter((tag)=>{
                    return tag != tagRemove;
                })
            };

            const handleSubmit = async()=>{
                error.value = null;

                if(tags.value.length == 0){
                    error.value = "You must have at least 1 tag"
                }else{

                    const updatedLesson = {
                        courseID: props.courseID,
                        name: name.value,
                        thumbnailRef : thumbnailRef.value,
                        tags: tags.value,
                        description : description.value,
                        homeworkURL : homeworkURL.value,
                        playlistURL : playlistURL.value,
                        slideURL : slideURL.value,
                        createdAt : timestamp()
                    }
                    await update(props.id,updatedLesson);
                    if(!errUpdate.value){
                        alert(`Update lesson ${number.value} succeed!`);
                        router.push({name: "Lessons", params: {id: props.courseID}})
                    }

                }

            }




            return {error, number, name, thumbnailRef,tags,selectedTag, description, homeworkURL, playlistURL, slideURL,
                    closeModal,clearField,handleSubmit,checkPhoto,addTag,deleteTag,resultImg, deleteLesson,
                    errRemove, errUpdate, errLesson}
        }
    }
</script>

<style lang="scss" scoped>
.back-button{
    position: absolute;
    top: 0.5rem;
    left: 2rem; 
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
    @include transition;
    &:hover{
        background-color: $color-gray-dark;
        color: white;
    }
}
.title{

}
.create-course{
    width: 75%;
    position: relative;
    
}
.create-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: -3%;
}
.btn-check{
    transform: translateY(1rem);
}
.button-course{
    width: 100%;
    font-family: "Averta Semi Bold";
}

.check-container{
    position: relative;
}
.result-img{
    width: 2rem;
    height: 2rem;
    position: absolute;
    transform: translate(-50%,-50%);
    top: 100%;
    right: 110%;
    z-index: 5;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top;
   
}
.tag-list{
    display: flex;
}
.tag{
    padding: 0.3rem 1.9rem 0.5rem 0.8rem;
    border-radius: 10rem;
    background-color: $color-gray-light-1;
    color: white;
    margin-right: 0.5rem;
    position: relative;
    & p{

    }
    & i{
        position: absolute;
        top: 50%;
        right: -4%;
        transform: translate(-50%,-50%);
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
    }
}
</style>
/*

Trong bài học đầu tiên, chúng ta sẽ được giới thiệu về ngành animation, quy trình để sản xuất một video animation chuyên nghiệp và bước đầu làm quen với công cụ làm animation mạnh mẽ nhất: After Effect
 */