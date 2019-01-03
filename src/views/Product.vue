<template>
  <div>
    <div class="container mb-5">
      <div class="row justify-content-center">
        <h3>{{name}}</h3>
      </div>
      <div class="row justify-content-center mt-3">
        <img class="img-thumbnail" :src="image" :alt="name">
      </div>
      <div class="row justify-content-center">
        <p>
          type:
          <b>{{type}}</b>
        </p>
      </div>
      <div class="row justify-content-center">
        <ul class="list-group col-8">
          <li class="list-group-item row text-center active">
            <p class="lead">pack size with price</p>
          </li>
          <li
            v-for="(value, key) in packs"
            :key="packs[key]"
            class="list-group-item row justify-content-between text-center"
          >
            <div class="row">
              <div class="col-5 text-center">
                <b>{{key}}</b>
              </div>
              <div class="col-2 text-center">:</div>
              <div class="col-5 text-center">{{value}}tk</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <router-link
      :to="'/product/'+this.$route.params.id+'/edit'"
      tag="button"
      class="btn btn-info w-100 position-fixed text-center text-white"
    >Edit</router-link>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import db from "./../components/firebaseInit.js";
export default {
  data() {
    return {
      name: "",
      packs: {},
      type: "",
      image: null
    };
  },
  computed: {
    ...mapGetters(["productsInfo"])
  },
  created() {
    let id = this.$route.params.id;
    db.collection("products")
      .doc(id)
      .get()
      .then(doc => {
        doc.data();
        this.name = doc.data().name;
        this.packs = doc.data().pack;
        this.type = doc.data().type;
        this.image = doc.data().imageUrl;
      });
  }
};
</script>
<style lang="scss" scoped>
div.container {
  margin-top: 80px;
  img {
    width: 180px;
    height: 200px;
  }
  li {
    max-height: 50px;
  }
}
button {
  height: 50px;
  left: 0;
  bottom: 0;
  background: #01796f;
}
</style>
