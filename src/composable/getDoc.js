import {projectFirestore} from "@/firebase/config"
import { ref } from 'vue'

const getDoc = (collection) => {
    const data = ref({});
    const error = ref("");

    const load = async(id) => {
        try {
            const res = await projectFirestore.collection(collection).doc(id).get();
            data.value = {...res.data(),id: res.id}
        } catch (err) {
            error.value = err.message;
            console.log('Get error log: '+ err.value);   
        }
    }


    return {data , error, load}
}

export default getDoc