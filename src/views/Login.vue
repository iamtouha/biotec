<template>
  <div class="container px-5">
    <form>
      <h1 class="w-100 text-center">Log In</h1>
      <div class="form-group">
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
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input
          type="password"
          v-model="password"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="Password"
        >
      </div>
      <button type="submit" @click="logIn" class="btn btn-info">Log In</button>
      <router-link
        to="/registration"
        tag="button"
        class="btn btn-outline-info float-right"
      >Create Account</router-link>
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
          user => {
            alert("Account signed in for" + this.email);
            this.$router.push("/");
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
div.container {
  text-align: left;
  margin-top: 90px;
}
</style>
