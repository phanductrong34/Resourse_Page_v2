import {projectAuth} from '@/firebase/config'
import {ref} from 'vue'

const user = ref(projectAuth.currentUser)
const isAdmin = ref(false);
const isTeacher = ref(false);
projectAuth.onAuthStateChanged(_user => {
    //console.log('User state change-- note from getUSer');
    user.value = _user;
    
    // lấy id token và check admin
    if(_user){
        _user.getIdTokenResult()
            .then((idTokenResult)=>{
                if(idTokenResult.claims.admin) isAdmin.value = true;
                else isAdmin.value = false
                if(idTokenResult.claims.teacher) isTeacher.value = true;
                else isTeacher.value = false
            })
    }else{
        isAdmin.value = false
        isTeacher.value = false
    }

})

const getUser = ()=> {
    return {user,isAdmin,isTeacher};
}

export default getUser