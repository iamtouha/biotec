<template>
  <div class="container justify-content-center">
    <div class="accordion" id="accordionExample">
      <div class="card">
        <div class="card-header" id="headingOne">
          <h2 class="mb-0">
            <button
              class="btn btn-link collapsed"
              type="button"
              data-toggle="collapse"
              data-target="#collapseOne"
              aria-expanded="false"
              aria-controls="collapseOne"
            >
              <i class="fas fa-plus-circle"></i>
              Add/Remove {{clientType}}
            </button>
          </h2>
        </div>

        <div
          id="collapseOne"
          class="collapse"
          aria-labelledby="headingOne"
          data-parent="#accordionExample"
        >
          <div class="card-body">
            <form>
              <div class="row">
                <div class="col pl-0 pr-1">
                  <input
                    type="text"
                    v-model="clientName"
                    class="form-control mx-0"
                    :placeholder="clientType+' Name'"
                    required
                  >
                </div>
                <div class="col pr-0 pl-1">
                  <input
                    type="text"
                    v-model="clientArea"
                    class="form-control mx-0"
                    placeholder="Area Name"
                    required
                  >
                </div>
              </div>
              <p class="text-danger w-100 text-center">{{warning}}</p>
              <div class="row">
                <button
                  type="submit"
                  @click.prevent="addClient"
                  class="btn btn-info my-2 mx-auto"
                >Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header" id="headingTwo">
          <h2 class="mb-0">
            <button
              class="btn btn-link collapsed"
              type="button"
              data-toggle="collapse"
              data-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              <i class="fas fa-info-circle"></i>Edit account info
            </button>
          </h2>
        </div>
        <div
          id="collapseTwo"
          class="collapse"
          aria-labelledby="headingTwo"
          data-parent="#accordionExample"
        >
          <div class="card-body"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header" id="headingThree">
          <h2 class="mb-0">
            <button
              @click="logOut"
              class="btn btn-link collapsed"
              type="button"
              data-toggle="collapse"
              data-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              <i class="fas fa-sign-out-alt text-danger"></i>
              Sign Out
            </button>
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { mapGetters } from "vuex";
import db from "./../components/firebaseInit.js";
export default {
  data() {
    return {
      isLoggedIn: false,
      currentUser: false,
      clientName: null,
      clientArea: null,
      warning: null
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    clientType() {
      return this.userInfo.post == "Area Manager" ? "Dealer" : "Retailer";
    }
  },
  methods: {
    logOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/login");
        });
    },
    addClient() {
      if (this.clientName && this.clientArea) {
        db.collection(this.clientType)
          .where("name", "==", this.clientName)
          .where("ref", "==", this.userInfo.id)
          .get()
          .then(querySnapshot => {
            if (querySnapshot.size) {
              this.warning = this.clientType + " already Exists";
            } else {
              db.collection(this.clientType)
                .doc()
                .set({
                  name: this.clientName,
                  area: this.clientArea,
                  ref: this.userInfo.id
                })
                .then(() => {
                  console.log("done");
                  this.warning = "";
                  this.clientName = null;
                  this.clientArea = null;
                })
                .catch(err => alert(err));
            }
          });
      } else {
        this.warning = "Insert Name and Area";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
div.container {
  margin-top: 100px;
  button {
    text-align: left;
    font-size: 16px;
    i {
      font-size: 20px;
      margin: 5px;
      margin-right: 10px;
      transform: translateY(3px);
    }
  }
}
</style>
