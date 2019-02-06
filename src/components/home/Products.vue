<template>
  <div class="row" id="productsContainer">
    <div
      v-for="(product,index) in productsInfo.slice(0, this.showProduct)"
      class="col-md-3 col-4"
      :key="index"
    >
      <router-link :to="'product/'+ product.id" :id="'product'+index" tag="div" class="wrapper">
        <div
          ref="productThumb"
          :style="'background-image:' + 'url('+product.imgUrl+');'"
          class="img-thumbnail"
        ></div>
        <p class="text-truncate mb-0">{{product.name}}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showProduct: 3
    }
  },
  computed: {
    ...mapGetters(["productsInfo"]),
  },
  methods: {
    getPosition(){
      let height = window.scrollY
      let pageHeight = document.documentElement.scrollHeight
      let viewHeight = document.documentElement.clientHeight
      let viewWidth = document.documentElement.clientWidth
      let bottomOfPage = (height+viewHeight) >= pageHeight
      console.log(height+viewHeight)
      console.log(pageHeight)
      
      if(bottomOfPage && this.productsInfo.length>this.showProduct)  this.showProduct += 3
     }
  },
  created () {
    this.getPosition()
    window.addEventListener('scroll', this.getPosition);
  },
  destroyed () {
    window.removeEventListener('scroll', this.getPosition);
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
