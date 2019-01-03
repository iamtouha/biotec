<template>
  <div class="wrapper">
    <div id="cover"></div>
    <div id="content">
      <img :src="userInfo.imgUrl" alt="user avater" class="img-thumbnail">
      <h2>{{userInfo.name}}</h2>
      <h4>{{userInfo.post}}</h4>
      <h3>Biotech agrovat ltd.</h3>
    </div>
  </div>
</template>

<script>
import db from "./../firebaseInit.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
$txt: #111;
$txtshad: 0px;
@font-face {
  font-family: agencyFb;
  src: url("./../../assets/AGENCYR.TTF");
}
#cover {
  width: 100%;
  height: 250px;
  // background: url('./../../assets/img/cover.png');
  // background-repeat: no-repeat;
  // background-size: cover;
  position: absolute;
  filter: blur(1.5px);
}
.wrapper {
  height: 300px;
  width: 100%;
  position: relative;
}
#content {
  position: absolute;
  color: $txt;
  width: 100%;
  height: 300px;
  text-shadow: $txtshad;
  font-family: "agencyFb", sans-serif;
  img {
    width: 150px;
    height: 150px;
    border: 1px solid #333;
    padding: 1px;
    left: 20px;
    position: absolute;
    top: 100px;
  }
  h2 {
    position: absolute;
    top: 105px;
    left: 180px;
    color: $txt;
    font-size: 45px;
    font-weight: 300;
  }
  h3 {
    position: absolute;
    top: 200px;
    left: 180px;
    color: $txt;
    font-size: 25px;
  }
  h4 {
    position: absolute;
    top: 165px;
    left: 180px;
    color: $txt;
  }
  @media screen and (max-width: 400px) {
    img {
      width: 130px;
      height: 130px;
      border: 1px solid #333;
      padding: 1px;
      left: 20px;
      top: 100px;
    }
    h2 {
      top: 110px;
      left: 160px;
      font-size: 35px;
    }
    h3 {
      top: 190px;
      left: 160px;
    }
    h4 {
      top: 155px;
      left: 160px;
    }
  }
}
</style>
