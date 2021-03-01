import {projectFirestore} from "@/firebase/config"
import { ref } from 'vue'

const removeDocsFilter = () => {
    const error = ref(null);

    const remove = (collection,key,value) => {
        // First perform the query
        projectFirestore.collection(collection).where(key,'==',value).get()
        .then(function(querySnapshot) {
                // Once we get the results, begin a batch
                var batch = projectFirestore.batch();

                querySnapshot.forEach(function(doc) {
                    // For each doc, add a delete operation to the batch
                    batch.delete(doc.ref);
                });

                // Commit the batch
                return batch.commit();
        }).then(function() {
            console.log(`Delete ${collection} has ${key} = ${value} completed`)
        }).catch(err => {
            error.value = err.message;
            console.log("🚀 ~ file: removeDocsFilter.js ~ line 26 ~ error.value", error.value)
        })
    }


    return {error, remove}
}

export default removeDocsFilter

