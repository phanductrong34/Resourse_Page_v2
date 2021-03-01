import {projectFirestore} from "@/firebase/config"
import { ref } from 'vue'

const getDoc = (collection) => {
    const data = ref(null);
    const error = ref(null);

    const load = async(id) => {
        try {
            const res = await projectFirestore.collection(collection).doc(id).get();
            if(res.exists){
                data.value = {...res.data(),id: res.id}
            }else throw Error("data not found");
        } catch (err) {
            error.value = err.message;
            console.log(`getDoc error from ${collection}`);   
        }
    }


    return {data , error, load}
}

export default getDoc