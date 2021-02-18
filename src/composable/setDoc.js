import {projectFirestore} from "@/firebase/config"
import { ref } from 'vue'

const setDoc = () => {
    const error = ref("");

    const set = async(collection,id,data) => {
        try {
            // dùng set thì ta sẽ quyết định được id
            const res = await projectFirestore.collection(collection).doc(id).set(data);
        } catch (err) {
            error.value = err.message;
            console.log('Add error log: '+ err.value);   
        }
    }


    return {error, set}
}

export default setDoc