<template>
  <div class="container">
    <h1 class="text-center text-dark w-100 mb-3">New Transaction</h1>
    <form action>
      <div class="form-row px-5">
        <div class="form-group col-12">
          <select class="custom-select" v-model="selectedClient">
            <option :value="null" selected>Select {{clientType}}</option>
            <option v-for="client in clients" :key="clients[client]" :value="client">{{client.name}}</option>
          </select>
          <p class="w-100 text-danger text-center">{{warning2}}</p>
        </div>
      </div>
      <ul class="list-group py-3 px-0">
        <li class="list-group-item row memo justify-content-between">
          <span class="col-4 text-center text-truncate">name</span>
          <span class="col-2 text-center text-truncate">pack</span>
          <span class="col-2 text-center">Unit price</span>
          <span class="col-2 text-center">units</span>
          <span class="col-1 text-center">Dlt</span>
        </li>
        <li
          v-for="(product, index) in selectedProduct"
          :key="products[index]"
          class="list-group-item row memo justify-content-between"
        >
          <span class="col-4 text-center text-truncate">{{product.name}}</span>
          <span class="col-2 text-center text-truncate">{{product.size}}</span>
          <span class="col-2 text-center">{{product.price}}</span>
          <span class="col-2 text-center">{{product.unit}}</span>
          <span
            class="col-1 btn btn-outline-danger btn-sm py-1 m-0 float-right"
            style="font-size:16px;"
            @click="deletePack(index)"
          >&times;</span>
        </li>
      </ul>
      <div class="form-row px-2 justify-content-center">
        <vue-single-select
          v-model="productName"
          option-label="title"
          :options="products"
          placeholder="pick a product"
          :max-results="5"
          a-post-has-an-id="good for search and display"
          the-post-has-a-title="make sure to show these"
        ></vue-single-select>
      </div>
      <div v-if="productName" class="form-row px-0 justify-content-center">
        <select v-model="pack_size" class="custom-select col-5 mr-1">
          <option :value="null" selected>pack size</option>
          <option v-for="(price, size) in sizes" :key="sizes[size]" :value="size">{{size}}</option>
        </select>
        <input
          type="number"
          v-model="perUnitPrice"
          placeholder="price per Unit"
          class="form-control col-3 ml-1"
        >
        <input type="number" v-model="unit" placeholder="Units" class="form-control col-3 ml-1">
      </div>
      <div class="row w-100 justify-content-center mx-0">
        <p id="productSizeWarning" class="w-100 text-center">{{warning}}</p>
        <div
          @click="addProduct(productName, pack_size, unit, perUnitPrice)"
          class="col-4 btn btn-info mb-5 mx-0"
        >Add Pack</div>
      </div>
      <h2 class="w-100 text-center">
        {{netPrice}}
        <span style="font-size: 18px m-0 p-0">tk</span>
      </h2>

      <input
        v-if="netPrice && selectedClient"
        type="submit"
        @click.prevent="submitProduct"
        name="submit"
        class="btn w-100 position-fixed text-center text-white"
      >
    </form>
  </div>
</template>

<script>
import VueSingleSelect from "vue-single-select";
import { mapGetters } from "vuex";
import db from "./../components/firebaseInit.js";
import firebase from "firebase";
export default {
  components: {
    VueSingleSelect
  },
  computed: {
    ...mapGetters(["userInfo", "productsInfo"]),
    clientType() {
      return this.userInfo.post == "Area Manager" ? "Dealer" : "Retailer";
    }
  },
  data() {
    return {
      products: [],
      productSize: {},
      productName: {},
      selectedClient: null,
      selectedProduct: [],
      pack_size: null,
      sizes: {},
      perUnitPrice: 0,
      netPrice: 0,
      unit: null,
      warning: null,
      warning2: null,
      clients: []
    };
  },
  methods: {
    addProduct(product, size, unit, perUnitPrice) {
      if (size && unit && perUnitPrice) {
        this.selectedProduct.push({
          name: product.title,
          id: product.id,
          size: size,
          price: Number(perUnitPrice),
          unit: Number(unit)
        });
        this.netPrice += perUnitPrice * unit;
        this.pack_size = this.unit = this.warning = this.perUnitPrice = null;
      } else {
        this.warning = "Enter pack size & units";
      }
    },
    deletePack(i) {
      this.selectedProduct.splice(i, 1);
    },
    submitProduct() {
      db.collection("transactions")
        .doc()
        .set({
          products: this.selectedProduct,
          clientId: this.selectedClient.id,
          refId: this.userInfo.id,
          clientName: this.selectedClient.name,
          netPrice: this.netPrice,
          time: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          this.$router.push("/transactions");
          console.log("done transaction");
        })
        .catch(err => alert(err));
    }
  },
  watch: {
    productName() {
      this.productsInfo.forEach(product => {
        if (product.id) {
          if (product.id == this.productName.id) {
            this.sizes = product.pack;
          }
        }
      });
    },
    pack_size() {
      for (let key in this.sizes) {
        if (key == this.pack_size) {
          this.perUnitPrice = this.sizes[key];
        }
      }
    }
  },
  created() {
    db.collection(this.clientType)
      .where("ref", "==", this.userInfo.id)
      .get()
      .then(querySnap => {
        if (!querySnap.size) {
          this.waring2 == "please add a client first";
        } else {
          querySnap.forEach(doc => {
            this.clients.push({
              name: doc.data().name,
              id: doc.id
            });
          });
        }
      })
      .catch(err => alert(err));
    console.log(this.clients);

    this.productsInfo.forEach(product => {
      this.products.push({
        id: product.id,
        title: product.name
      });
    });
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
  input.position-fixed {
    display: block;
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
li.memo {
  align-content: space-between;
  span {
    margin: 0px 10px;
    display: inline;
    padding: 0px;
  }
  &:first-child {
    align-content: space-between;
    background: #ddd;
    span {
      padding: 0px;
      margin: 0px 10px;
    }
  }
}
</style>
