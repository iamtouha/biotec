<template>
  <div class="col-8 mb-2">
    <h3 class="w-100">{{heading}}</h3>
    <h1 class="w-100 text-dark">
      {{amount}}
      <span>tk</span>
    </h1>
    <h5 v-if="officer != ''" class="w-100">M_o: {{officer}}</h5>
  </div>
</template>

<script>
export default {
  props: {
    heading: String,
    amount: Number,
    client: String
  }
};
</script>

<style lang="scss" scoped>
div {
  min-height: 130px;
  padding: 20px;
  box-shadow: 0px 0px 4px 2px rgba(0, 0, 0, 0.65);
  h1 {
    span {
      font-size: 25px;
      color: #444;
    }
  }
}
</style>
