<template>
  <div class="wrapper">
    <div id="cover"></div>
    <div id="content" class="container">
      <div class="row">
        <img :src="userInfo.imgUrl" alt="user avater" class="img-thumbnail float-left ml-2">
        <div
          class="col col-lg-3 float-left text-left d-flex"
          style="flex-direction:column; justify-content:space-around;"
        >
          <h2>{{userInfo.name}}</h2>
          <h4>{{userInfo.post}}</h4>
          <h3>{{userInfo.company}}</h3>
          <h4>
            ref Id:
            <span style="font-family: 'agencyFb', sans-serif;">{{userInfo.id}}</span>
          </h4>
        </div>
      </div>
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
@font-face {
  font-family: robotoCondensed;
  src: url("./../../assets/RobotoCondensed-Regular.ttf");
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
  box-sizing: border-box;
}
#content {
  color: $txt;
  padding-top: 90px;
  height: 300px;
  text-shadow: $txtshad;
  font-family: "robotoCondensed", sans-serif;
  @media screen and (min-width: 600px) {
    left: 20px;
    padding-left: 100px;
    img {
      width: 200px !important;
      height: 200px !important;
      border: 1px solid #333;
      padding: 1px;
    }
  }
  img {
    width: 150px;
    height: 150px;
    border: 1px solid #333;
    padding: 1px;
  }
  h2 {
    color: $txt;
    font-size: 45px;
    font-weight: 300;
    font-size: 36px;
  }
  h3 {
    color: $txt;
    font-size: 25px;
  }
  h4 {
    color: $txt;
    font-size: 21px;
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
      font-size: 33px;
    }
    h3 {
      font-size: 23px;
    }
    h4 {
      font-size: 21px;
    }
  }
}
</style>
