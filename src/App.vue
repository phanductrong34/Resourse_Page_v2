<template>
  <div>
    <router-view></router-view>
  </div>

</template>

<script>
export default {
  name: "App",
  components:{

  },
  data(){
    return{

    }
  }
}
</script>
<style lang="scss">
body{
  overflow: hidden;
}
#app{
  font-family: 'Averta Semi Bold';
  color: $color-black;  
  display: flex;
  width: 100vw;
  height: 100vh;
  clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  position: relative;
  overflow: hidden;

}
</style>
  