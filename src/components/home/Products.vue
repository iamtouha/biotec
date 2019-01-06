<template>
  <div class="row">
    <div v-for="(product,key) in productsInfo" class="col-4" :key="productsInfo[key]">
      <router-link :to="'product/'+ product.id" tag="div" class="wrapper">
        <div
          ref="productThumb"
          :style="'background-image:' + 'url('+product.imgUrl+');'"
          class="img-thumbnail"
        ></div>
        <p class="text-truncate mb-0">{{product.name}}</p>
      </router-link>
    </div>
    <Loading v-if="loading"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["productsInfo", "loading"])
  }
};
</script>

<style lang="scss" scoped>
$txt: #111;
div {
  padding: 5px;
  .wrapper {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    padding: 0px;
    padding-bottom: 0px;
    overflow: hidden;
    border-radius: 5px;
    p {
      text-align: center;
      font-size: 15px;
      color: $txt;
      width: 100%;
    }
  }
}
div.img-thumbnail {
  width: 100%;
  opacity: 1;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 50%;
  background-position: (50%, 50%);
  overflow: hidden;
}
</style>
