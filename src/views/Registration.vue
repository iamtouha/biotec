<template>
  <div class="container px-5">
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
        <small class="text-danger">{{warning}}</small>
      </div>

      <div class="row w-100">
        <router-link to="/login" tag="button" class="btn btn-outline-info">Log In</router-link>
        <button @click="register" type="submit" class="btn btn-primary ml-auto mr-0">Next</button>
      </div>
    </form>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  name: "register",
  data() {
    return {
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
        this.warning = "";
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(
            user => {
              alert("Account created for " + this.email);
              this.$router.push("/create");
            },
            err => {
              alert(err.message);
            }
          );
      } else {
        this.warning = "Passwords don't match!";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
div.container {
  text-align: left;
  margin-top: 90px;
}
</style>
