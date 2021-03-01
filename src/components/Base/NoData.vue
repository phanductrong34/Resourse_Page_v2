<template>
    <div class="nodata">
        <p>No {{data}} found</p>
    </div>
</template>

<script>
    export default {
        props:['data'],
    }
</script>

<style lang="scss" scoped>
.nodata{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: $color-gray-light-1;
}
</style>