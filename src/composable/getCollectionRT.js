import {projectFirestore} from '@/firebase/config'
import {ref,watchEffect} from 'vue'

const getCollection = (collection) => {
    const error = ref(null)
    const documents = ref(null)

    let collectionRef = projectFirestore.collection(collection)
        .orderBy('createdAt','desc')
    
    const unsub = collectionRef.onSnapshot((snap) => {
        let results = [];
        snap.docs.forEach(doc => {
            doc.data().createdAt && results.push( {...doc.data(), id: doc.id})
        })
        documents.value = results;
        //Lấy đc thành công data rồi thì sẽ clear error
        error.value = null
    }, (err) => {
        console.log(err.message,collection);
        documents.value = null;
        error.value = 'could not fetch data'
    })

    watchEffect(onInvalidate => {
        onInvalidate(()=> unsub());
    })

    return {documents,error};
}

export default getCollection;