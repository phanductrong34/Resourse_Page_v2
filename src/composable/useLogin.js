import {projectAuth} from '../firebase/config'
import {ref} from 'vue'

const error = ref(null)

const login = async (email,password) =>{
    // khi chạy hàm này thì clear error đã
    error.value = null;
    
    try {
        //request lên server
        const res = await projectAuth.signInWithEmailAndPassword(email,password);
        // sign in thành công ko ném lỗi thì clear error
        error.value = null
        console.log(res);
        return res
        
    } catch (err) {
        console.log(err.message);
        // ở đây ta không output ra message viif nó sẽ để lộ ra các lỗi mà hacker có thể test để thử truy cập vào
        error.value = 'Incorrect login credential'
    }
}

const useLogin = () => {
    return {error, login}
}

export default useLogin