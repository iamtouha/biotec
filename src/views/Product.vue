<template>
  <div>
    <div class="container mb-5">
      <modal title="DELETE PRODUCT" @confirm="dltProduct" confirmation="confirm">
        <p>
          Do you want to delete product:
          <b>{{name}}</b>?
        </p>
      </modal>
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
              <div class="col-6 text-center text-truncate">
                <b>{{key}}</b>
              </div>
              <div class="col-1 text-center">:</div>
              <div class="col-4 text-center">{{value}}tk</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <Loader v-if="loading"/>
    <router-link
      :to="'/product/'+this.$route.params.id+'/edit'"
      tag="button"
      class="btn btn-info text-center text-white"
    >Edit</router-link>
    <button
      data-toggle="modal"
      data-target="#exampleModal"
      @click.prevent
      class="btn btn-danger"
    >Delete</button>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import firebase from "firebase";
import db from "@/components/firebaseInit.js";
import modal from "@/components/Modal.vue";
import Loader from "@/components/Loader.vue";
export default {
  components: {
    modal,
    Loader
  },
  data() {
    return {
      id: null,
      name: "",
      packs: {},
      type: "",
      image: null,
      hasImage: null
    };
  },
  computed: {
    ...mapGetters(["productsInfo", "loading"]),
    Pid() {
      return this.$route.params.id;
    }
  },
  methods: {
    ...mapActions(["loadOn", "loadOff", "getUserInfo"]),
    dltProduct() {
      db.collection("products")
        .doc(this.Pid)
        .delete()
        .then(() => {
          if (this.hasImage === true) {
            firebase
              .storage()
              .ref()
              .child("products/" + this.Pid + ".jpg")
              .delete()
              .then(() => {
                this.getUserInfo("/");
              })
              .catch(err => alert(err));
          } else {
            this.getUserInfo("/");
          }
        })
        .catch(err => alert(err));
    }
  },
  created() {
    this.loadOn();
    let id = this.Pid;
    db.collection("products")
      .doc(id)
      .get()
      .then(doc => {
        this.name = doc.data().name;
        this.packs = doc.data().pack;
        this.type = doc.data().type;
        this.image = doc.data().imageUrl
          ? doc.data().imageUrl
          : require("./../assets/img/" + doc.data().type + ".svg");
        this.hasImage = doc.data().imageUrl ? true : false;
        this.loadOff();
      })
      .catch(err => {
        this.loadOff();
        alert(err);
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
  bottom: 0;
  width: 50%;
  position: fixed;
}
button.btn-info {
  left: 0;
  background: #01796f !important;
}
button.btn-danger {
  right: 0;
}
</style>
