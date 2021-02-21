import {projectFirestore} from "@/firebase/config"
import { ref } from 'vue'

const updateDoc = (collection) => {
    const error = ref(null);

    const update = async(id,data) => {
        try {
            // dùng set thì ta sẽ quyết định được id
            const res = await projectFirestore.collection(collection).doc(id).update(data);
            error.value = null;
        } catch (err) {
            error.value = err.message;
            console.log('Update error log: '+ err.message);   
        }
    }


    return {error, update}
}

export default updateDoc