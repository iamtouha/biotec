<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-5">
        <a @click="changeStateA" :class="{active:getRoute=='bill'}">Bill</a>
      </div>
      <div class="col-5">
        <a @click="changeStateB" :class="{active:getRoute=='payment'}">Payment</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    getRoute() {
      return this.$route.name;
    }
  },
  methods: {
    changeStateA() {
      this.$router.push("/transactions");
    },
    changeStateB() {
      this.$router.push("/transactions/payment");
    }
  }
};
</script>

<style lang="scss" scoped>
$txt: #111;
.row {
  margin-top: 80px;
  div {
    height: 50px;
    padding: 9px;
    a {
      width: 100%;
      cursor: pointer;
      height: 100%;
      display: block;
      border-radius: 20px;
      text-decoration: none;
      color: lighten($color: $txt, $amount: 50);
      text-align: center;
      border: 1px solid lighten($color: $txt, $amount: 50);
      font-size: 20px;
    }
    a.active {
      color: $txt;
      border: 1px solid $txt;
    }
  }
}
</style>
