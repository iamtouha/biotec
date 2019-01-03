<template>
  <div class="container px-5">
    <form>
      <h1 class="w-100 text-center" style="font-size: 35px;">Create account</h1>
      <div class="row">
        <div class="col-12">
          <input
            type="text"
            class="form-control"
            v-model="firstName"
            placeholder="First name"
            required
          >
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-12">
          <input
            type="text"
            class="form-control"
            v-model="lastName"
            placeholder="Last name"
            required
          >
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-12">
          <select class="custom-select" v-model="post">
            <option selected>Select Post</option>
            <option value="Area Manager">Area Manager</option>
            <option value="Marketing Officer">Marketing Officer</option>
          </select>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-12">
          <input
            type="text"
            class="form-control"
            v-model="area"
            placeholder="Area"
            maxlength="40"
            required
          >
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-12">
          <input
            type="text"
            class="form-control"
            v-model="phone"
            placeholder="Phone No"
            maxlength="11"
            required
          >
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-12">
          <input type="text" class="form-control" :value="mail" placeholder="mail" readonly>
        </div>
      </div>
      <p class="w-100 text-danger text-center">{{warning}}</p>
      <button @click="submitInfo" type="submit" class="btn btn-primary mt-4 float-right">Next</button>
    </form>
    <Loading v-if="loading"/>
  </div>
</template>
<script>
import db from "@/components/firebaseInit.js";
import Loading from "./../components/Loader.vue";
import firebase from "firebase";
export default {
  components: {
    Loading
  },
  data() {
    return {
      loading: false,
      firstName: null,
      lastName: null,
      area: null,
      phone: null,
      post: null,
      mail: null,
      warning: null
    };
  },
  methods: {
    submitInfo(e) {
      e.preventDefault();
      if (
        this.firstName &&
        this.lastName &&
        this.area &&
        this.phone &&
        this.post &&
        this.mail
      ) {
        this.loading = true;
        const fullName = this.firstName + " " + this.lastName;
        db.collection("user")
          .doc()
          .set({
            name: fullName,
            phone: this.phone,
            area: this.area,
            email: this.mail,
            post: this.post
          })
          .then(() => {
            this.$store.dispatch("getEmail", this.mail);
            this.$store.dispatch("getUserInfo");
            this.loading = false;
            this.$router.push("/addphoto");
          })
          .catch(error => {
            this.loading = false;
            console.error("Error writing document: ", error);
          });
      } else {
        this.warning == "fillup all the fields";
      }
    },
    validMail(email) {
      db.collection("user")
        .where("email", "==", email)
        .get()
        .then(docSnapShot => {
          docSnapShot.forEach(doc => {
            if (doc.id) {
              alert("account already exists!");
              this.$router.push("/");
            }
          });
        });
    }
  },
  created() {
    this.mail = firebase.auth().currentUser.email;
    this.validMail(this.mail);
  }
};
</script>
<style lang="scss" scoped>
div.container {
  text-align: left;
  margin-top: 90px;
}
img {
  width: 150px;
  height: 150px;
}
</style>
