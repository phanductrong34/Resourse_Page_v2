import {ref} from 'vue'


const error = ref(null)

//truyền vào object user lấy từ projectAuth.currentUser
const deleteUser = async(user)=>{
    try {
        await user.delete();

        //console.log("User deleted from auth succeed!")
        error.value = null;
    } catch (err) {
        error.value = err.message;
        console.log(error.value);
    }
}

const removeUser = () => {
    return {error, deleteUser}
}

export default removeUser