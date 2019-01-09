<template>
  <div>
    <navigator-app v-once/>
    <router-view :key="ckey"></router-view>
    <router-link
      v-if="routeName == 'bill' && isApproved"
      to="/addtransaction"
      tag="div"
      class="addtrans"
    >
      <i class="fas fa-plus"></i>
    </router-link>
    <div v-else-if="isApproved" data-toggle="modal" data-target="#exampleModal" class="addtrans">
      <i class="fas fa-plus"></i>
    </div>
    <Modal :confirmation="add" title="Add Payment" @confirm="pay()">
      <p class="w-100 text-center text-danger">{{warning2}}</p>
      <div class="input-group mb-3">
        <select v-model="payerClient" class="form-control">
          <option value disabled selected>Select {{clientType}}</option>
          <option v-for="client in clients" :key="client" :value="client">{{client.name}}</option>
        </select>
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="inputGroup-sizing-default">Amount</span>
        </div>
        <input
          type="text"
          v-model="paidAmount"
          maxlength="5"
          class="form-control"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        >
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="inputGroup-sizing-default">Date</span>
        </div>
        <input
          type="date"
          v-model="date"
          class="form-control"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        >
      </div>
      <div class="input-group mb-3">
        <div class="input-group-prepend">
          <span class="input-group-text" id="inputGroup-sizing-default">Receipt No.</span>
        </div>
        <input
          type="number"
          v-model="receipt"
          maxlength="5"
          class="form-control"
          aria-label="Sizing example input"
          aria-describedby="inputGroup-sizing-default"
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import NavigatorApp from "@/components/transactions/Navigator";
import Modal from "@/components/Modal.vue";
import db from "@/components/firebaseInit.js";
import firebase from "firebase";
import { mapGetters } from "vuex";
export default {
  components: {
    NavigatorApp,
    Modal
  },
  data() {
    return {
      payerClient: "",
      paidAmount: 0,
      clients: [],
      warning2: null,
      ckey: 0,
      date: null,
      receipt: null
    };
  },
  methods: {
    pay() {
      if (this.payerClient && this.paidAmount) {
        db.collection("payments")
          .doc()
          .set({
            clientId: this.payerClient.id,
            clientName: this.payerClient.name,
            refId: this.userInfo.id,
            receipt: this.receipt,
            amount: Number(this.paidAmount),
            time: new Date(this.date)
          })
          .then(() => {
            this.ckey++;
          });
      } else {
        this.waring2 = "select dealer and enter amount";
      }
    }
  },
  computed: {
    ...mapGetters(["userInfo", "clientType", "isApproved"]),
    routeName() {
      return this.$route.name;
    },
    add() {
      return this.payerClient && this.paidAmount && this.receipt && this.date
        ? "Add"
        : null;
    }
  },
  created() {
    console.log(this.isApproved);
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
  }
};
</script>

<style lang="scss" scoped>
$primary: #01796f;
.addtrans {
  width: 70px;
  height: 70px;
  padding: 15px;
  cursor: pointer;
  position: fixed;
  background: $primary;
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
