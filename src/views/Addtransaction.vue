<template>
  <div class="container py-md-5">
    <h4 class="text-center text-dark w-100 mb-2">New Transaction</h4>
    <form action>
      <div class="form-row justify-content-center">
        <div class="form-group col-md-6">
          <select class="custom-select" v-model="selectedClient">
            <option :value="null" selected>Select {{clientType}}</option>
            <option v-for="client in clients" :key="client" :value="client">{{client.name}}</option>
          </select>
          <p v-if="warning2" class="w-100 text-danger text-center">{{warning2}}</p>
        </div>
      </div>
      <div class="form-row mb-2 justify-content-center">
        <div class="input-group col-md-6">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon3">Invoice No.</span>
          </div>
          <input
            type="number"
            class="form-control"
            placeholder="Enter Invoice No."
            v-model="invoice"
            aria-describedby="basic-addon3"
          >
        </div>
      </div>
      <div class="form-row mb-2 justify-content-center">
        <div class="input-group col-md-6">
          <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon4">Date</span>
          </div>
          <input type="date" class="form-control" v-model="date" aria-describedby="basic-addon4">
        </div>
      </div>
      <div class="tblContainer">
        <table class="table">
          <thead class="thead-light" id="myTable">
            <tr>
              <th scope="col">name</th>
              <th scope="col">pack</th>
              <th scope="col">price</th>
              <th scope="col">units</th>
              <th scope="col">delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in selectedProduct" :key="product">
              <th class="text-truncate" scope="row">{{product.name}}</th>
              <td>{{product.size}}</td>
              <td>{{product.price}}tk</td>
              <td>{{product.unit}}</td>
              <td>
                <span
                  class="btn btn-outline-danger btn-sm"
                  style="font-size:16px;"
                  @click="deletePack(index)"
                >&times;</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="form-row px-2 justify-content-center">
        <vue-single-select
          v-model="productName"
          option-label="title"
          :options="products"
          placeholder="pick a product"
          a-post-has-an-id="good for search and display"
          the-post-has-a-title="make sure to show these"
        ></vue-single-select>
      </div>
      <div v-if="productName" class="form-row px-0 justify-content-center">
        <select v-model="pack_size" class="custom-select col-4 mr-1">
          <option :value="null" selected>pack size</option>
          <option v-for="(price, size) in sizes" :key="size" :value="size">{{size}}</option>
        </select>
        <input
          type="number"
          v-model="perUnitPrice"
          placeholder=" Unit price"
          class="form-control col-4 ml-1"
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
      <Loading v-if="loading"/>
      <h2 class="w-100 text-center mb-5">
        {{netPrice}}
        <span style="font-size: 18px m-0 p-0">tk</span>
      </h2>

      <input
        v-if="netPrice && selectedClient && date && invoice"
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
import Loading from "./../components/Loader.vue";
import { mapGetters, mapActions } from "vuex";
import db from "./../components/firebaseInit.js";
import firebase from "firebase";
export default {
  components: {
    VueSingleSelect,
    Loading
  },
  computed: {
    ...mapGetters([
      "userInfo",
      "productsInfo",
      "loading",
      "clientType",
      "isApproved"
    ])
  },
  data() {
    return {
      products: [],
      productSize: {},
      productName: null,
      selectedClient: null,
      selectedProduct: [],
      pack_size: null,
      sizes: {},
      date: "",
      perUnitPrice: null,
      netPrice: 0,
      invoice: null,
      unit: null,
      warning: null,
      warning2: null,
      clients: []
    };
  },
  methods: {
    ...mapActions(["loadOn", "loadOff"]),

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
      if (this.isApproved) {
        const timestamp = new Date(this.date);
        this.loadOn();
        db.collection("transactions")
          .doc()
          .set({
            products: this.selectedProduct,
            clientId: this.selectedClient.id,
            refId: this.userInfo.id,
            clientName: this.selectedClient.name,
            netPrice: this.netPrice,
            invoice: Number(this.invoice),
            time: timestamp
          })
          .then(() => {
            this.loadOff();
            this.$router.push("/transactions");
          })
          .catch(err => alert(err));
        this.loadOff();
      } else {
        alert("Please get approval first");
      }
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
      .orderBy('name', 'asc')
      .get().then(querySnap => {
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

    this.productsInfo.forEach(product => {
      this.products.push({
        id: product.id,
        title: product.name
      });
    });
    this.loadOff();
  }
};
</script>

<style lang="scss" scoped>
$primary: #01796f;
div.container {
  margin-top: 60px;
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
div.tblContainer {
  width: 100%;
  overflow-x: scroll;
  table {
    th:first-child {
      min-width: 120px;
    }
    font-size: 14px;
    span {
      height: 25px;
      width: 50px;
      text-align: center;
      padding: 0px !important;
    }
  }
}
</style>
