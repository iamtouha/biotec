<template>
  <div class="contain">
    <a href="https://facebook.com/touha99" class="credit text-white">credits</a>
    <div class="intro text-center">
      <img src="@/assets/biotech-w.svg" alt="biotech ltd">
      <p class="w-100 text-white m-0">A biotech inventory management app</p>
      <small class="w-100 text-white m-0">beta version: 0.5</small>
    </div>
    <div class="wrapper">
      <form>
        <div class="row justify-content-center px-md-5">
          <div class="form-group col-md-6">
            <label for="exampleInputEmail1">Email address</label>
            <input
              type="email"
              v-model="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
            >
          </div>
        </div>
        <div class="row justify-content-center px-md-5">
          <div class="form-group col-md-6">
            <label for="exampleInputPassword1">Password</label>
            <input
              type="password"
              v-model="password"
              class="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
            >
          </div>
        </div>
        <div class="row justify-content-center px-md-5">
          <div class="col-md-6 justify-content-between d-flex">
            <button type="submit" @click="logIn" class="btn btn-info">Log In</button>
            <router-link
              to="/registration"
              tag="button"
              class="btn btn-outline-light"
            >Create Account</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import firebase from "firebase";
import db from "@/components/firebaseInit.js";
export default {
  name: "register",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    logIn(e) {
      e.preventDefault();
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            db.collection("user")
              .where("email", "==", this.email)
              .get()
              .then(querySnapshot => {
                if (querySnapshot.size) {
                  this.$router.push("/");
                } else {
                  firebase
                    .auth()
                    .currentUser.delete()
                    .then(() => this.$router.push("/registration"));
                }
              });
          },
          err => {
            alert(err.message);
          }
        );
    }
  }
};
</script>
<style lang="scss" scoped>
div.contain {
  .credits {
    position: fixed;
    top: 20px;
    right: 20px;
  }
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
  div.intro {
    width: 350px;
    margin: 0 auto;
    img {
      display: block;
      margin: 0 auto;
      width: 180px;
      height: 180px;
    }
  }
  div.wrapper {
    padding: 30px;
    left: 50%;
    top: 70%;
    position: absolute;
    width: 100%;
    transform: translate(-50%, -60%);
  }
}
</style>
