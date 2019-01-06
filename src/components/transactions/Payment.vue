<template>
  <div class="container mt-4">
    <table class="table">
      <thead class="thead-light" id="myTable">
        <tr>
          <th scope="col">#</th>
          <th scope="col">{{clientType}}</th>
          <th scope="col">Date</th>
          <th scope="col">tk</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(element, index) in transactions.slice(from, show)" :key="transactions[index]">
          <th scope="row">{{from+index+1}}</th>
          <td class="text-truncate">{{element.name}}</td>
          <td class="text-truncate">{{element.date}}</td>
          <td>{{element.bill}}</td>
        </tr>
      </tbody>
    </table>
    <ul class="pagination">
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
import { mapGetters, mapActions } from "vuex";
export default {
  components: { Loading },
  data() {
    return {
      transactions: [],
      items: 0,
      from: 0,
      show: 5,
      pages: 0
    };
  },
  computed: {
    ...mapGetters(["userInfo", "loading", "clientType"])
  },
  methods: {
    ...mapActions(["loadOn", "loadOff", "userInfo"]),
    loadClients() {
      this.loadOn();
      db.collection("payments")
        .where("refId", "==", this.userInfo.id)
        .orderBy("time", "desc")
        .get()
        .then(querySnap => {
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
              name: entry.clientName,
              date: String(date) + "-" + month + "-" + String(year),
              bill: entry.amount
            });
            this.loadOff();
          });
        })
        .catch(err => {
          alert(err);
          this.loadOff();
        });
    },
    paginate(n) {
      this.from = 5 * n - 5;
      this.show = 5 * n;
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

<style lang="scss" scoped>
</style>
