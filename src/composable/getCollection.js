import {projectFirestore} from "@/firebase/config"
import { ref } from 'vue'

const getCollection = () => {
    const dataArray = ref([]);
    const error = ref("");

    const load = async(collection,orderby,order) => {
        try {
            const res = await projectFirestore.collection(collection)
            .orderBy(orderby,order).get();
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