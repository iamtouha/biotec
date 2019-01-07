<template>
  <form>
    <div class="contain px-5 w-100 justify-content-center">
      <div class="wrapper">
        <div class="row loader">
          <div class="mx-auto position-relative">
            <span v-if="fileName" class="bg-danger" @click="removeImg">&times;</span>
            <img class="img-thumbnail" :src="imgUrl" alt="User profile">
          </div>
        </div>
        <div class="d-block">
          <div class="row mt-2 justify-content-center">
            <button class="btn btn-lg btn-info" @click="imgPreview">
              <i class="fas fa-camera"></i> Select Photo
            </button>
            <input
              type="file"
              ref="imgInput"
              @change="onFileSelected"
              class="d-none"
              accept="image/jpg"
            >
          </div>
          <div class="row justify-content-center">
            <button @click="submitPhoto" type="submit" class="btn btn-primary mt-1">Submit</button>
            <input type="reset" class="d-none" ref="removeImg">
          </div>
        </div>
      </div>
    </div>
    <Loader v-if="loading"/>
  </form>
</template>
<script>
import db from "./../components/firebaseInit.js";
import Loader from "./../components/Loader.vue";
import firebase from "firebase";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    Loader
  },
  data() {
    return {
      selectedFile: null,
      imgUrl: require("./../assets/user-default.svg"),
      fileName: null,
      email: null,
      id: null,
      file: null
    };
  },
  computed: {
    ...mapGetters(["userInfo", "loading"])
  },
  methods: {
    ...mapActions(["loadOn", "loadOff", "getUserInfo"]),
    imgPreview(e) {
      e.preventDefault();
      this.$refs.imgInput.click();
    },
    onFileSelected(e) {
      this.file = e.target.files[0];
      this.fileName = this.file.name;
      console.log(this.userInfo);
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imgUrl = fileReader.result;
      });
      fileReader.readAsDataURL(this.file);
    },
    removeImg() {
      this.imgUrl = require("./../assets/user-default.svg");
      this.$refs.removeImg.click();
      this.fileName = null;
      this.file = null;
    },
    submitPhoto(e) {
      e.preventDefault();
      this.loadOn();
      if (this.file) {
        firebase
          .storage()
          .ref("user-profile/" + this.userInfo.id + ".jpg")
          .put(this.file)
          .then(response => {
            response.ref
              .getDownloadURL()
              .then(downloadURL => {
                db.collection("user")
                  .doc(this.userInfo.id)
                  .update({ imageUrl: downloadURL })
                  .then(() => {
                    this.getUserInfo("/");
                  });
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
      } else {
        this.$router.push("/");
      }
    }
  },
  created() {
    this.email = firebase.auth().currentUser.email;
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
    div.loader {
      height: 160px;
      text-align: center;
      position: relative;
    }
    span {
      width: 25px;
      height: 25px;
      top: -5px;
      left: -5px;
      padding: 5px;
      border-radius: 50%;
      position: absolute;
      text-align: center;
      display: block;
      color: #fff;
      line-height: 12px;
      font-size: 25px;
    }

    img {
      width: 150px;
      height: 150px;
    }
  }
}
</style>
