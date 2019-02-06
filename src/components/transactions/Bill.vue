<template>
  <div class="container mt-4 px-md-5">
    <Modal cancel = "Delete" @onCancel="deleteId(transId)" modalId="exampleModal2" :confirmation="null" title="Product List">
      <table class="table">
        <thead class="thead-light" id="myTable">
          <tr>
            <th scope="col">Product</th>
            <th scope="col">pack</th>
            <th scope="col">price</th>
            <th scope="col">units</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="index" v-for="(element, index) in showMemo">
            <th scope="row">{{element.name}}</th>
            <td>{{element.size}}</td>
            <td>{{element.price}}tk</td>
            <td>{{element.unit}}</td>
          </tr>
        </tbody>
      </table>
    </Modal>
    <table class="table table-1" :key="key">
      <thead class="thead-light" id="myTable">
        <tr>
          <th scope="col">#</th>
          <th scope="col">{{clientType}}</th>
          <th scope="col">I.No.</th>
          <th scope="col">Date</th>
          <th scope="col">tk</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(element, index) in transactions.slice(from, show)"
          :key="index"
          @click="showList(element.id)"
          data-toggle="modal"
          data-target="#exampleModal2"
        >
          <th scope="row">{{from+index+1}}</th>
          <td class="text-truncate">{{element.name}}</td>
          <th scope="row">{{element.invoice}}</th>
          <td class="text-truncate">{{element.date}}</td>
          <td>{{element.bill}}</td>
        </tr>
      </tbody>
    </table>
    <ul v-if="pages>1" class="pagination">
      <li class="page-item">
        <a class="page-link">Goto Page:</a>
      </li>
      <li v-for="n in pages" :key="n" class="page-item">
        <a class="page-link" @click="paginate(n)">{{n}}</a>
      </li>
    </ul>
    <Loading v-if="loading"/>
  </div>
</template>

<script>
import db from "@/components/firebaseInit.js";
import Loading from "@/components/Loader.vue";
import Modal from "@/components/Modal2.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { Loading, Modal },
  data() {
    return {
      transId: null,
      transactions: [],
      items: 0,
      from: 0,
      show: 5,
      key: 0,
      pages: 0,
      showMemo: null
    };
  },
  computed: {
    ...mapGetters(["userInfo", "loading", "clientType"])
  },
  methods: {
    ...mapActions(["loadOn", "loadOff"]),
    deleteId(index) {
      db.collection('transactions').doc(index).delete().then(()=>{
        this.loadClients()
        this.key++
      }).catch(err => alert(err))
    },
    loadClients() {
      this.loadOn();
      db.collection("transactions")
        .where("refId", "==", this.userInfo.id)
        .orderBy("time", "desc")
        .get()
        .then(querySnap => {
          this.transactions = []
          if (querySnap.size) {
            const monthNames = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "June",
              "July",
              "Aug",
              "Sept",
              "Oct",
              "Nov",
              "Dec"
            ];
            querySnap.forEach(doc => {
              const entry = doc.data();
              const timeToDate = entry.time.toDate();
              let date = timeToDate.getDate();
              let month = monthNames[timeToDate.getMonth()];
              let year = timeToDate.getFullYear();

              this.transactions.push({
                id: doc.id,
                name: entry.clientName,
                invoice: entry.invoice,
                date: String(date) + "-" + month + "-" + String(year),
                products: entry.products,
                bill: entry.netPrice
              });
              this.loadOff();
            });
          } else {
            this.loadOff();
          }
        })
        .catch(err => {
          alert(err);
          this.loadOff();
        });
    },
    paginate(n) {
      this.from = 5 * n - 5;
      this.show = 5 * n;
    },
    showList(id) {
      for (let i in this.transactions) {
        if (this.transactions[i].id == id) {
          this.showMemo = this.transactions[i].products
          this.transId = this.transactions[i].id
          break;
        }
      }
    }
  },
  created() {
    this.loadClients();
  },
  watch: {
    transactions() {
      let i,
        c = 0;
      for (i in this.transactions) c++;
      this.items = c;
    },
    items() {
      this.pages = Math.ceil(this.items / 5);
    }
  }
};
</script>
