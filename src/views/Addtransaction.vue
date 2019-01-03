<template>
    <div class="container">
        <h1 class="text-center text-dark w-100 mb-3">New Transaction</h1>
        <form action="">
            <div class="form-row  px-5">
                <div class="form-group col-12">
                    <select class="custom-select" name="" id="">
                        <option :value="null" selected>Select M.O.</option>
                        <option value="Matlab">Matlab</option>
                        <option value="Chandpur">Chandpur</option>
                        <option value="Hajigonj">Hajigonj</option>
                    </select>
                </div>
            </div>
            <ul class="list-group p-3">
                    <li v-for="(product, index) in products" 
                    :key="products[index]"
                    class="list-group-item row">
                        <span class="col-1 float-left">{{index + 1}}.</span>
                        <span class="col-5 text-left">{{product.name}}</span>
                        <span class="col-3">{{product.size}}</span>
                        <span class="col-2">{{product.unit}}</span>
                        <span class="col-1 btn btn-outline-danger btn-sm py-1 m-0 float-right" 
                                    style="font-size:16px;"
                                    @click="deletePack(index)">&times;</span>
                    </li>
                </ul>
            <div class="form-row  px-2 justify-content-center">
                
                <vue-single-select
                    v-model="product_name"
                    :options="['apple','banana','cherry','tomato','potato']"
                    placeholder="pick a product"
                    :required="true">
                </vue-single-select>
            </div>
            <div v-if="product_name" class="form-row  px-3 justify-content-center ">
                <select v-model="pack_size" class="custom-select col-5 mr-1" name="" id="">
                    <option :value="null" selected>pack size</option>
                    <option value="Matlab">Matlab</option>
                    <option value="Chandpur">Chandpur</option>
                    <option value="Hajigonj">Hajigonj</option>
                </select>
                <input type="number" v-model="unit" placeholder="Units" class="form-control col-4 ml-1" >
            </div>
            <div class="row w-100 justify-content-center">
                <p id="productSizeWarning" class="w-100 text-center">{{warning}}</p>
                <div @click="addProduct(product_name, pack_size, unit)" class="col-4 btn btn-info mb-5">Add Pack</div>
            </div>
        
            <input type="submit" name="submit" class="btn w-100 position-fixed text-center text-white" />
        </form>
    </div>
</template>

<script>
import VueSingleSelect from "vue-single-select"
export default {
    components: {
        VueSingleSelect
    },
    data(){
        return {
            products:[],
            product_name: null,
            pack_size : null,
            unit: null,
            warning: null
        }
    },
    methods: {
        addProduct(name, size, unit){
            if(size&&unit){
                this.products.push({
                name: name,
                size: size,
                unit: unit
            });
            console.log(this.products);
            this.pack_size = this.unit = this.warning = null;
            }
            else{
                this.warning = 'Enter pack size & units';
            }
        },
        deletePack(i){
            this.products.splice(i, 1);
        }
    },
    computed: {
        
    }
}
</script>

<style lang="scss" scoped>
$primary: #01796F;
    div.container{
        margin-top: 100px;
        div.addSize{
            height: 40px;
        }
        input.position-fixed{
            display: block;
            height: 40px;
            bottom: 0px;
            right: 0px;
            font-size: 20px;
            background: $primary; 
            z-index: 99;
        }
    }
    .btn-sm{
        height: 25px;
        padding: 0px !important;
    }
</style>
