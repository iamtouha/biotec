<template>
  <div class="contain px-5">
    <div class="wrapper">
      <form>
        <h1 class="w-100 text-center" style="font-size: 35px;">Create account</h1>
        <div class="row">
          <div class="col-12">
            <input
              type="text"
              maxlength="16"
              class="form-control"
              v-model="firstName"
              placeholder="First name"
              required
            >
          </div>
        </div>
        <div class="row mt-2 mb-4">
          <div class="col-12">
            <input
              maxlength="16"
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
              <option value disabled selected>Select Post</option>
              <option value="Area Manager">Area Manager</option>
              <option value="Marketing Officer">Marketing Officer</option>
            </select>
          </div>
        </div>
        <div class="row mt-2 mb-4">
          <div class="col-12">
            <input
              type="text"
              class="form-control"
              v-model="area"
              placeholder="Area"
              maxlength="32"
              required
            >
          </div>
        </div>
        <div class="row mt-2 px-3">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">+880</span>
            </div>
            <input
              type="text"
              maxlength="11"
              placeholder="Phone No"
              v-model="phone"
              class="form-control"
            >
          </div>
          <p v-if="warning3!==true" class="text-white m-0">{{warning3}}</p>
        </div>
        <div class="row mt-2">
          <div class="col-12">
            <input type="text" class="form-control" :value="mail" placeholder="mail" readonly>
          </div>
        </div>
        <p class="w-100 text-white text-center">{{warning}}</p>
        <button @click.prevent="submitInfo" type="submit" class="btn btn-info mt-4 float-right">Next</button>
      </form>
      <Loading v-if="loading"/>
    </div>
  </div>
</template>
<script>
import db from "@/components/firebaseInit.js";
import Loading from "./../components/Loader.vue";
import firebase from "firebase";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    Loading
  },
  data() {
    return {
      firstName: null,
      lastName: null,
      area: null,
      phone: null,
      post: "",
      mail: null,
      warning3: null,
      warning: null
    };
  },
  computed: {
    ...mapGetters(["loading", "userInfo"])
  },
  methods: {
    ...mapActions(["loadOn", "loadOff", "getUserInfo", "getEmail"]),

    submitInfo() {
      if (
        this.firstName &&
        this.lastName &&
        this.area &&
        this.phone &&
        this.post &&
        this.mail
      ) {
        this.loadOn();
        const fullName = this.firstName + " " + this.lastName;
        db.collection("user")
          .doc()
          .set({
            name: fullName,
            phone: Number(this.phone),
            area: this.area,
            email: this.mail,
            post: this.post,
            refId: this.$route.params.refId,
            approved: false
          })
          .then(() => {
            this.getUserInfo("/addphoto");
          })
          .catch(error => {
            this.loadOff();
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
  watch: {
    phone() {
      const n = Number(this.phone);
      const str = String(n);
      const l = str.length;
      if (n == NaN || Number(str[0]) != 1 || l > 10) {
        this.warning3 = "Enter a valid Phone No.";
      } else if (l == 10) {
        this.warning3 = true;
      } else {
        this.warning3 = null;
      }
    },
    mail() {
      this.validMail(this.mail);
      this.getEmail(this.mail);
    }
  },
  created() {
    this.mail = firebase.auth().currentUser.email;
    this.loadOff();
  }
};
</script>
<style lang="scss" scoped>
div.contain {
  color: #fff;
  top: 0px;
  right: 0px;
  width: 100%;
  height: 100vh;
  position: fixed;
  background: #01796f;
  z-index: 999;
  text-align: left;
  input {
    box-sizing: border-box;
  }
  div.wrapper {
    padding: 30px;
    left: 50%;
    top: 50%;
    position: absolute;
    width: 100%;
    transform: translate(-50%, -50%);
  }
}
</style>
