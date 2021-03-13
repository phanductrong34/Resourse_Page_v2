<template>
    <div id="admin">
        <Sidenav />

        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
            <component :is="Component" />
            </transition>
        </router-view>

        
    </div>

</template>

<script>
import Sidenav from '@/components/Sidenav'
export default {
  components:{
    Sidenav,
  },
  data(){
    return{

    }
  }
}
</script>
<style lang="scss" scoped>
#admin{
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
  