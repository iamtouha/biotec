<template>
  <div class="home">
    <coverContainer/>
    <h1 class="display-4 text-center w-100 mt-3">Products</h1>
    <div class="container">
      <productApp/>
    </div>
    <router-link to="/addproduct" v-if="isApproved" tag="div" class="addproduct">
      <i class="fas fa-plus"></i>
    </router-link>
    <Loader v-if="loading"/>
  </div>
</template>

<script>
import firebase from "firebase";
import productApp from "@/components/home/Products.vue";
import coverContainer from "@/components/home/Cover.vue";
import Loader from "@/components/Loader.vue";
import { mapGetters } from "vuex";

export default {
  name: "home",
  components: {
    coverContainer,
    productApp,
    Loader
  },
  computed: {
    ...mapGetters(["userInfo", "loading", "isApproved"])
  }
};
</script>
<style lang="scss" scoped>
$txt: #222;
$primary: #01796f;

h1.display-4 {
  color: $txt;
  font-size: 40px;
  @media screen and (max-width: 400px) {
    font-size: 35px;
  }
}
.addproduct {
  width: 70px;
  height: 70px;
  padding: 15px;
  position: fixed;
  background: $primary;
  cursor: pointer;
  border-radius: 50%;
  bottom: 20px;
  right: 20px;
  box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.6);
  @media screen and (min-width: 500px) {
    bottom: 20px;
    right: 17%;
  }
  i {
    font-size: 40px;
    text-align: center;
    color: #fff;
  }
}
</style>
