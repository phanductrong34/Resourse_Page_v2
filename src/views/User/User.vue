<template>
    <div id="user">
        <Sidenav />

        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
            <component :is="Component" />
            </transition>
        </router-view>

        <Background/>
        
    </div>

</template>

<script>
import Sidenav from '@/components/Sidenav'
import Background from '@/components/Background'
import {useStore} from 'vuex'
import { computed, watchEffect } from 'vue'
export default {
  components:{
    Sidenav,
    Background,
  },
  setup(props) {
      //load lần đầu và setup listener để cập nhật vào store
      const store = useStore();
      // phải có user trước thì mới có tất cả các cái tiếp theo
      const userData = computed(()=> store.getters['user/getUserData']);

      watchEffect(()=>{
        if(userData.value !== null){
          //console.log("first load all data")
          store.dispatch('lessons/firstLoadLesson');
          store.dispatch('lessons/firstLoadUnlock');
          store.dispatch('course/firstLoadCourse');
          store.dispatch('class/firstLoadClass');
          store.dispatch('works/firstLoadWorks');
        //Listener
          // store.dispatch('lessons/setListenerLessons');

        }
      })


    return {}
      
      
  }

}
</script>
<style lang="scss" scoped>
#user{
    display: flex;
    width: 100vw;
    height: 100%;
}

.page{
  padding: 2.5rem;
}

.fade-enter, .fade-leave-to{
  opacity: 0;
  transform: translateY(2em);
}

.fade-enter-active, .fade-leave-active{
  transition: all 0.6s cubic-bezier(.66,-0.95,.34,1.76);
}
</style>
  