<template>
  <div class="container">
    <h1 class="text-center text-dark w-100 mb-3">Add Product</h1>
    <form action>
      <div class="form-row px-5">
        <div class="form-group col-12">
          <input
            type="text"
            class="form-control"
            v-model="name"
            id="inputName"
            placeholder="Name (Ex: Biotech)"
            maxlength="32"
            required
          >
        </div>
      </div>
      <div class="form-row px-5">
        <div class="custom-file">
          <input
            type="file"
            @change="onFileSelected"
            class="custom-file-input"
            accept="image/jpg"
            id="validatedCustomFile"
          >
          <label
            class="custom-file-label text-left text-truncate"
            for="validatedCustomFile"
          >{{imgFileName}}</label>
          <div class="invalid-feedback">Example invalid custom file feedback</div>
        </div>
      </div>
      <div class="form-row p-3 justify-content-center">
        <div class="form-check mx-2">
          <input
            class="form-check-input"
            type="radio"
            v-model="product.type"
            value="packet"
            name="options"
            id="exampleRadios1"
            checked
          >
          <label class="form-check-label" for="exampleRadios1">Packet</label>
        </div>
        <div class="form-check mx-2">
          <input
            class="form-check-input"
            type="radio"
            v-model="product.type"
            value="bottle"
            name="options"
            id="exampleRadios2"
          >
          <label class="form-check-label" for="exampleRadios2">Bottle</label>
        </div>
      </div>
      <h3 class="text-center w-100 my-3">Product pack sizes</h3>
      <ul class="list-group mb-3" :key="ckey">
        <li class="list-group-item d-flex" :key="packs[key]" v-for="(value, key, index) in packs()">
          <span class="col-1">{{index + 1}}.</span>
          <span class="col-6 text-left">{{key}}</span>
          <span class="col-4">{{value}}tk</span>
          <span
            class="col-1 btn btn-outline-danger btn-sm py-1"
            style="font-size:16px;"
            @click="deletePack(key)"
          >&times;</span>
        </li>
      </ul>
      <div class="form-row px-2 justify-content-center">
        <div class="form-group col-6">
          <input
            type="text"
            maxlength="12"
            class="form-control"
            v-model="size"
            placeholder="Pack size"
          >
        </div>
        <div class="form-group col-4">
          <input
            type="number"
            maxlength="5"
            class="form-control"
            v-model="price"
            placeholder="Price(tk)"
          >
        </div>
        <div class="row w-100 justify-content-center">
          <p id="productSizeWarning" class="w-100 text-danger text-center">{{warning}}</p>
          <div @click="addToPacks(size, price)" class="col-4 btn btn-info mb-5">Add Pack</div>
        </div>
      </div>
      <Loading v-if="loading"/>
      <div
        v-if="(this.packages > 0) && name"
        @click="validateAndSubmit"
        class="btn w-100 position-fixed text-center text-white"
      >Submit</div>
    </form>
  </div>
</template>

<script>
import firebase from "firebase";
import Loading from "./../components/Loader.vue";
import db from "./../components/firebaseInit.js";
export default {
  components: {
    Loading
  },
  data() {
    return {
      imgFileName: "product Image",
      imgFile: null,
      loading: false,
      name: null,
      product: {
        type: "packet",
        pack: {}
      },
      size: null,
      price: 0,
      warning: null,
      ckey: 0,
      packages: 0,
      productId: null
    };
  },
  methods: {
    addToPacks(size, price) {
      if (size && price) {
        if (!this.product.pack[size]) {
          this.product.pack[size] = Number(price);
          this.price = this.size = this.warning = null;
          console.log(this.product.pack);
          this.ckey++;
          this.packages++;
        } else {
          this.warning = "pack size and price already exists!";
        }
      } else {
        this.warning = "Enter pack size and price please";
      }
    },
    deletePack(key) {
      delete this.product.pack[key];
      this.ckey++;
      this.packages--;
    },
    packs() {
      return this.product.pack;
    },
    onFileSelected(e) {
      this.imgFile = e.target.files[0];
      this.imgFileName = this.imgFile.name;
    },

    submitProduct() {
      db.collection("products")
        .doc()
        .set({
          name: this.name,
          type: this.product.type,
          pack: this.product.pack,
          ULed_by: this.$store.getters.userInfo.id,
          time: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          if (this.imgFile) {
            db.collection("products")
              .where("name", "==", this.name)
              .where("ULed_by", "==", this.$store.getters.userInfo.id)
              .limit(1)
              .get()
              .then(querySnapshot => {
                const pId = querySnapshot.docs[0].id;
                firebase
                  .storage()
                  .ref("products/" + pId + ".jpg")
                  .put(this.imgFile)
                  .then(Response => {
                    Response.ref.getDownloadURL().then(downloadURL => {
                      db.collection("products")
                        .doc(pId)
                        .update({ imageUrl: downloadURL })
                        .then(() => {
                          this.$store.dispatch("getUserInfo");
                          this.loading = false;
                          this.$router.push("/");
                        });
                    });
                  });
              });
          } else {
            this.loading = false;
            this.$store.dispatch("getUserInfo");
            this.$router.push("/");
          }
        });
    },
    validateAndSubmit() {
      this.loading = true;
      db.collection("products")
        .where("name", "==", this.name)
        .where("ULed_by", "==", this.$store.getters.userInfo.id)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.size) {
            this.warning = "product already exists";
            this.loading = false;
          } else {
            this.submitProduct();
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
$primary: #01796f;
div.container {
  margin-top: 100px;
  div.addSize {
    height: 40px;
  }
  div.position-fixed {
    height: 40px;
    bottom: 0px;
    right: 0px;
    font-size: 20px;
    background: $primary;
    z-index: 99;
  }
}
.btn-sm {
  height: 25px;
  padding: 0px !important;
}
</style>
