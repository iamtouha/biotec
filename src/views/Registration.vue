<template>
  <div class="contain px-5">
    <a href="https://facebook.com/touha99" class="credit text-white">credits</a>
    <div class="intro text-center">
      <img src="@/assets/biotech-w.svg" alt="biotech ltd">
    </div>
    <div class="wrapper">
      <form>
        <h4 class="w-100 text-center">Registration</h4>
        <div class="row justify-content-center">
          <div class="form-group col-md-6">
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
        </div>
        <div class="row justify-content-center">
          <div class="form-group col-md-6">
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
        </div>
        <div class="row justify-content-center">
          <div class="form-group col-md-6">
            <input
              type="password"
              v-model="rePassword"
              class="form-control"
              id="exampleInputPassword2"
              placeholder="Enter password again"
              required
            >
          </div>
        </div>
        <div class="row justify-content-center">
          <div class="form-group col-md-6 mt-3 mb-0">
            <label for="refId">Referance ID</label>
            <input
              type="text"
              maxlength="20"
              id="refId"
              v-model="refId"
              placeholder="Enter Referance Id"
              class="form-control"
              required
            >
          </div>
        </div>
        <p class="text-white">{{warning}}</p>

        <div class="row justify-content-center">
          <div class="col-md-6 justify-content-between d-flex">
            <router-link to="/login" tag="button" class="btn btn-outline-light">Log In</router-link>
            <button @click="register" type="submit" class="btn btn-info">Next</button>
          </div>
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
  box-sizing: border-box;
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
    top: 60%;
    position: absolute;
    width: 100%;
    transform: translate(-50%, -60%);
  }
}
div.intro {
  width: auto;
  transform: translateY(-30px);
  margin: 0 auto;
  img {
    display: block;
    margin: 0 auto;
    width: 100px;
    height: 100px;
  }
}
.credits {
  position: absolute;
  top: 20px;
  right: 0px;
}
</style>
