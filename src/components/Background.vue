<template>
  <teleport to="#back">
    <div class="background">
        <img src="@/assets/png/resource-page.png" alt="">
    </div>
  </teleport>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.background{
    width: 100%;
    height: 100%;
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
}
.background img{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: auto;
    transform: scale(1.01) translateX(40px);
}
</style>

/*
DOC cho file BackGround
- Khi xóa nhớ xóa
    - index.html thẻ #back
    - App.vue: thẻ trong template, component trong script
    - sau đó mới xóa background.vue
*/