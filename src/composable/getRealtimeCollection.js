import {projectFirestore} from "@/firebase/config"
import { ref } from 'vue'

const getRealtimeCollection = (collection,orderby,order) => {
    const dataArray = ref([]);
    const error = ref("");


        try {
            projectFirestore.collection(collection)
            .orderBy(orderby,order)
            .onSnapshot((snap) => {
                dataArray.value = snap.docs.map(doc => {
                    return {...doc.data(), id: doc.id};
                })
            })
            console.log("Get collection:",collection,dataArray.value)
        } catch (err) {
            error.value = err.message;
            console.log('Get error log: '+ err.value);   
        }


    
    return {dataArray , error}
}

export default getRealtimeCollection