<template>
  <div>
    <navigator-app v-once/>
    <router-view :key="ckey"></router-view>
    <router-link v-if="routeName == 'bill'" to="/addtransaction" tag="div" class="addtrans">
      <i class="fas fa-plus"></i>
    </router-link>
    <div v-else data-toggle="modal" data-target="#exampleModal" class="addtrans">
      <i class="fas fa-plus"></i>
    </div>
    <Modal confirmation="Add" title="Add Payment" @confirm="pay()">
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
      ckey: 0
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
            amount: Number(this.paidAmount),
            time: firebase.firestore.FieldValue.serverTimestamp()
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
    ...mapGetters(["userInfo", "clientType"]),
    routeName() {
      return this.$route.name;
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
  }
};
</script>

<style lang="scss" scoped>
$primary: #01796f;
.addtrans {
  width: 70px;
  height: 70px;
  padding: 15px;
  position: fixed;
  background: $primary;
  border-radius: 50%;
  bottom: 20px;
  right: 20px;
  box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.6);
  i {
    font-size: 40px;
    text-align: center;
    color: #fff;
  }
}
</style>
