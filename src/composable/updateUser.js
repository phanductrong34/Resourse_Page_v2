import {projectAuth} from '../firebase/config'
import {ref} from 'vue'

//update email
//update password

const error = ref(null)

//truyền vào object user lấy từ projectAuth.currentUser
const updateEmailPassword = async(user,email,password)=>{
    try {
        await user.updateEmail(email);
        await user.updatePassword(password);
        //("Update email password from auth succeed!")
        error.value = null;
    } catch (err) {
        error.value = err.message;
        console.log(error.value);
    }
}

const updateUser = () => {
    return {error, updateEmailPassword}
}

export default updateUser