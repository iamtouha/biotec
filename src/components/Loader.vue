<template>
  <div class="row justify-content-center loader">
    <Spinner name="circle" noFadeIn="0" color="#01796f"/>
  </div>
</template>
<script>
import Spinner from "vue-spinkit";
export default {
  components: {
    Spinner
  }
};
</script>
<style lang="scss" scoped>
.loader {
  z-index: 1001;
  position: fixed;
  top: 48%;
  left: 48%;
  width: 50px !important;
  height: 50px !important;
  padding: 5px;
  border-radius: 5px;
  background-color: #ddd;
}
</style>
