import {projectStorage} from '@/firebase/config'
import {ref} from 'vue'

const getPhoto = () => {

    const error = ref(null);
    const photoURL = ref(null);
    const loadPhotoURL = async(storageRef)=>{
      try {
          const res = await projectStorage.ref().child(storageRef).getDownloadURL(); 
            photoURL.value = res;
        } catch (err) {
            switch (err.code) {
                case 'storage/object-not-found':
                  error.value = 'File dont exist'
                  break;
                case 'storage/unauthorized':
                  error.value = "User dont have permission to access the object"
                  break;
                case 'storage/canceled':
                  error.value = "User canceled the upload"
                  break;
       
                case 'storage/unknown':
                  error.value = "Unknown error occurred, inspect the server response"
                  break;
              }  
        }

    }

    return {error,photoURL, loadPhotoURL}
}

export default getPhoto