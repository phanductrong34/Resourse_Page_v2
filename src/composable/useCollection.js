import {ref} from 'vue'
import {projectFirestore} from '../firebase/config'

const useCollection = (collection)=> {
    const error = ref(null);
    const addDoc = async (doc)=> {
        try{
            const res = await projectFirestore.collection(collection).add(doc);
            return res
        }catch(err){
            error.value = err.message;
            console.log("Add doc has an error")
        }
    } 
    return {error, addDoc}
}

export default useCollection