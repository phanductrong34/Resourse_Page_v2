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
.overflowList{
    &::-webkit-scrollbar-track{
        border-radius: 10px;
        background-color: #ffffff00;
    }
    &::-webkit-scrollbar{
        width: 12px;
        background-color:#ffffff00;
    }
    &::-webkit-scrollbar-thumb{
        border-radius: 10px;
        background-color: #ffffff00;
    }
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


.error-message{
  color: $color-primary;
}

// 1 cái div có thẻ p ở trong

</style>
  