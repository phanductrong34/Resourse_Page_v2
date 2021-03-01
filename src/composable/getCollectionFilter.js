import {projectFirestore} from "@/firebase/config"
import { ref } from 'vue'

const getCollection = () => {
    const dataArray = ref([]);
    const error = ref("");

    const load = async(collection,key,value) => {
        try {
            const res = await projectFirestore.collection(collection)
            .where(key,'==',value).orderBy('createdAt','desc').get();
            dataArray.value = res.docs.map(doc => {
                return {...doc.data(), id: doc.id}
            })  
            return res;     
        } catch (err) {
            error.value = err.message;
            console.log('Get error log: '+ error.value);   
        }
    }

    
    return {dataArray , error, load}
}

export default getCollection