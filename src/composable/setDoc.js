import {projectFirestore} from "@/firebase/config"
import { ref } from 'vue'

const setDoc = (collection) => {
    const error = ref(null);

    const set = async(id,data) => {
        try {
            // dùng set thì ta sẽ quyết định được id
            const res = await projectFirestore.collection(collection).doc(id).set(data);
            error.value = null;
        } catch (err) {
            error.value = err.message;
            console.log('Add error log: '+ error.value);   
        }
    }


    return {error, set}
}

export default setDoc