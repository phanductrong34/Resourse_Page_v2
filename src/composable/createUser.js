import {projectAuth} from '../firebase/config'
import {ref} from 'vue'

const error = ref(null)

const create = async(email,password,displayName) => {
    //console.log("🚀 ~ file: createUser.js ~ line 7 ~ password", password)
    
    try {
        const res = await projectAuth.createUserWithEmailAndPassword(email,password);
        if(!res){
            throw new Error('Couldn not complete the createUser');
        }
        await res.user.updateProfile({displayName});
        //console.log(res.user);
        //sau khi createUser thành công và đổi tên thì phải clear field có thể vẫn còn ở lần trước
        error.value = null;
        return res;
    } catch (err) {
        console.log(err.message);
        error.value = err.message;
    }

}

const createUser = ()=>{
    return {error, create}
}

export default createUser


