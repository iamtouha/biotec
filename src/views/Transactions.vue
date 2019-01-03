<template>
  <div>
    <navigator-app v-once/>
    <router-view></router-view>
    <router-link to="/addtransaction" tag="div" class="addtrans">
      <i class="fas fa-plus"></i>
    </router-link>
  </div>
</template>

<script>
import NavigatorApp from "@/components/transactions/Navigator";
export default {
  components: {
    NavigatorApp
  }
};
</script>

<style lang="scss" scoped>
$primary: #01796f;
.addtrans {
  width: 70px;
  height: 70px;
  padding: 15px;
  position: fixed;
  background: $primary;
  border-radius: 50%;
  bottom: 20px;
  right: 20px;
  box-shadow: 2px 2px 6px 0px rgba(0, 0, 0, 0.6);
  i {
    font-size: 40px;
    text-align: center;
    color: #fff;
  }
}
</style>
