<template>
  <div>
    <div class="row shadow-wrapper">
      <div class="shadow text-center">
        <p class="my-0">total:</p>
        <h1 class="my-1">
          {{total}}
          <span style="font-size:16px;">tk</span>
        </h1>
      </div>
    </div>
    <div class="container">
      <Loader v-if="loading"/>
      <table class="table mt-5">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Area</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr
            data-toggle="modal"
            data-target="#exampleModal2"
            v-for="(client,index) in clients"
            :key="index"
            @click="history(client.id)"
          >
            <th>{{index+1}}</th>
            <th scope="row">{{client.name}}</th>
            <th>{{client.area}}</th>
            <th>{{client.netAmount}}</th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import db from "@/components/firebaseInit.js";
import Loader from "@/components/Loader.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { Loader },
  data() {
    return {
      clients: [],
      total: 0
    };
  },
  computed: {
    ...mapGetters(["userInfo", "loading", "clientType"])
  },
  methods: {
    ...mapActions(["loadOn", "loadOff"])
  },
  created() {
    this.loadOn();
    db.collection(this.clientType)
      .where("ref", "==", this.userInfo.id)
      .get()
      .then(querySnap => {
        if (querySnap.size) {
          querySnap.forEach(doc => {
            let bill = 0,
              paid = 0;
            const name = doc.data().name,
              id = doc.id,
              area = doc.data().area;
            db.collection("transactions")
              .where("clientId", "==", doc.id)
              .where("refId", "==", this.userInfo.id)
              .get()
              .then(querySnap => {
                if (querySnap.size) {
                  querySnap.forEach(doc => {
                    bill += doc.data().netPrice;
                  });
                }
                db.collection("payments")
                  .where("clientId", "==", doc.id)
                  .where("refId", "==", this.userInfo.id)
                  .get()
                  .then(querySnap => {
                    if (querySnap.size) {
                      querySnap.forEach(doc => {
                        paid += doc.data().amount;
                      });
                    }
                    this.clients.push({
                      id: id,
                      name: name,
                      area: area,
                      netAmount: bill - paid
                    });
                    this.loadOff();
                  })
                  .catch(err => {
                    alert(err);
                    this.loadOff();
                  });
              })
              .catch(err => {
                alert(err);
                this.loadOff();
              });
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
  watch: {
    clients() {
      this.total = 0;
      for (let i in this.clients) {
        this.total += this.clients[i].netAmount;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
div.container {
  margin-top: 200px;
}
div.shadow-wrapper {
  z-index: 99;
  height: 100px;
  width: 100%;
  box-sizing: border-box;
  position: fixed;
  top: 90px;
  align-content: center;
  left: 0;
  padding: 10px 30px;
  div {
    box-sizing: border-box;
    width: 100%;
    transform: translateX(4%);
    height: 100%;
  }
}
</style>
