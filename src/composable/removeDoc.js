import {projectFirestore} from "@/firebase/config"
import { ref } from 'vue'

const removeDoc = (collection) => {
    const error = ref(null);

    const remove = async(id) => {
        try {
            // dùng set thì ta sẽ quyết định được id
            const res = await projectFirestore.collection(collection).doc(id).delete();
            error.value = null;
        } catch (err) {
            error.value = err.message;
            console.log('Update error log: '+ err.message);   
        }
    }


    return {error, remove}
}

export default removeDoc