import {projectFirestore} from "@/firebase/config"
import { ref } from 'vue'

const getCollection = (collection) => {
    const dataArray = ref([]);
    const error = ref("");

    const load = async() => {
        try {
            const res = await projectFirestore.collection(collection)
            .orderBy('createdAt','desc').get();
            dataArray.value = res.docs.map(doc => {
                return {...doc.data(), id: doc.id}
            })       

            console.log("Get collection:",collection,dataArray.value)
        } catch (err) {
            error.value = err.message;
            console.log('Get error log: '+ err.value);   
        }
    }

    
    return {dataArray , error, load}
}

export default getCollection