<template>
    <div class="container">
        <div class="row justify-content-center">
            <app-billboard heading="Total Bill" officer='' :amount=12000 />
        </div>
        <h3 class="w-100 text-center mt-5">Area-wise bill</h3>

        <div class="row justify-content-center my-2">
            <app-billboard heading="Matlab" officer='John Doe' :amount=14500 />
        </div>
        <div class="row justify-content-center my-2">
            <app-billboard heading="Hajigonj" officer='Jane Doe' :amount=12520 />
        </div>
        <div class="row justify-content-center my-2">
            <app-billboard heading="Chandpur" officer='Colombus' :amount=1230 />
        </div>
    </div>
</template>

<script>
import appBillboard from '@/components/overview/Billboard.vue'
export default {
    components:{
        appBillboard
    }
}
</script>

<style lang="scss" scoped>
    div.container{
        margin-top: 100px;
    }
</style>
