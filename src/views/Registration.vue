<template>
  <div class="contain px-5">
    <div class="wrapper">
      <form>
        <h1 class="w-100 text-center">Registration</h1>
        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input
            type="email"
            v-model="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            required
          >
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            v-model="password"
            class="form-control"
            id="exampleInputPassword1"
            placeholder="Enter Password"
            required
          >
        </div>
        <div class="form-group">
          <input
            type="password"
            v-model="rePassword"
            class="form-control"
            id="exampleInputPassword2"
            placeholder="Enter password again"
            required
          >
          <div class="form-group mt-3">
            <label for="refId">Referance ID</label>
            <input
              type="text"
              id="refId"
              v-model="refId"
              placeholder="Enter Referance Id"
              class="form-control"
              required
            >
          </div>
          <p class="text-white">{{warning}}</p>
        </div>

        <div class="row w-100 m-0">
          <router-link to="/login" tag="button" class="btn btn-outline-light">Log In</router-link>
          <button @click="register" type="submit" class="btn btn-info ml-auto mr-0">Next</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import firebase from "firebase";
import db from "@/components/firebaseInit";
export default {
  name: "register",
  data() {
    return {
      refId: "",
      email: "",
      password: "",
      rePassword: "",
      warning: ""
    };
  },
  methods: {
    register(e) {
      e.preventDefault();
      if (this.password == this.rePassword) {
        db.collection("user")
          .doc(this.refId)
          .get()
          .then(doc => {
            if (doc.exists && doc.data().approved) {
              this.warning = "";
              firebase
                .auth()
                .createUserWithEmailAndPassword(this.email, this.password)
                .then(user => this.$store.dispatch("getEmail", this.email))
                .then(() => this.$router.push("/create/" + this.refId))
                .catch(err => {
                  alert(err.message);
                });
            } else {
              this.warning = "refId doesn't exist!";
            }
          })
          .catch(err => alert(err));
      } else {
        this.warning = "Passwords don't match!";
      }
    }
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
