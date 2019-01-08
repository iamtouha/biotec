<template>
  <div id="app">
    <nav>
      <ul class="list-inline">
        <router-link class="list-inline-item" to="/" tag="li">
          <a>
            <i class="fas fa-user"></i>
            <span>User Home</span>
          </a>
        </router-link>
        <router-link class="list-inline-item" to="/transactions" tag="li">
          <a>
            <i class="fas fa-clipboard-list"></i>
            <span>Transactions</span>
          </a>
        </router-link>
        <router-link class="list-inline-item" to="/overview" tag="li">
          <a>
            <i class="fas fa-calculator"></i>
            <span>Overview</span>
          </a>
        </router-link>
        <router-link class="list-inline-item" to="/settings" tag="li">
          <a>
            <i class="fas fa-tools"></i>
            <span>Options</span>
          </a>
        </router-link>
      </ul>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase";
import db from "./components/firebaseInit.js";
export default {
  data() {
    return {
      email: null
    };
  },
  computed: {
    ...mapGetters(["currentPage"])
  },
  methods: {
    getMail() {
      if (firebase.auth().currentUser) {
        const email = firebase.auth().currentUser.email;
        db.collection("user")
          .where("email", "==", email)
          .get()
          .then(docSnapShot => {
            docSnapShot.forEach(doc => {
              if (doc.id) {
                this.email = email;
              }
            });
          });
      }
    }
  },
  created() {
    this.getMail();
  },
  watch: {
    email() {
      this.$store.dispatch("getEmail", this.email);
      this.$store.dispatch("getUserInfo");
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
nav {
  $primary: #01796f;
  $txt_inverse: #fff;
  width: 100%;
  background: $primary;
  position: fixed;
  top: 0px;
  height: 75px;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 1);
  z-index: 99;
  @media screen and (max-width: 764px) {
    height: 50px;
  }
  li {
    font-size: 20px;
    margin: 20px;
    @media screen and (min-width: 401px) and (max-width: 600px) {
      font-size: 17px;
      margin: 20px 10px;
    }
    @media screen and (max-width: 764px) {
      text-align: center;
      width: calc(99% / 4);
      border-left: 1px solid $txt_inverse;
      margin: 0 !important;
    }
    &:nth-child(1) {
      border-left: 0;
    }
    a {
      color: $txt_inverse;
      text-decoration: none;
      span {
        @media screen and (max-width: 764px) {
          font-size: 30px;
          margin: 10px auto;
          display: none;
        }
      }
      i {
        font-size: 35px;
        margin: 20px auto;
        @media screen and (min-width: 765px) {
          display: none !important;
        }
        @media screen and (max-width: 764px) {
          font-size: 30px;
          margin: 10px auto;
          display: block;
        }
      }
    }

    a:active,
    a:hover {
      color: #ccc !important;
      i {
        color: $txt_inverse !important;
      }
      text-decoration: none;
    }
  }
  a.active {
    color: #ddd !important;
  }
}
tr {
  cursor: pointer;
}
</style>
