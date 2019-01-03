<template>
    <div class="container mt-4">
        <table class="table">
  <thead class="thead-light" id="myTable">
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>
  </tbody>
</table>
    </div>
</template>

<script>
import fireStore from '@/components/firebaseInit.js'
export default {
    data(){
      return{
        status: ''
      }
    },
    created() {
      this.loadTxt() 
    },
    methods: {
      loadTxt(){
         fireStore.collection('users').where('id', '==', 1).get()
        .then(function(querySnapshot){
          querySnapshot.forEach(doc => {
            console.log(doc.data());
            const refData = doc.data();
          });
        }).catch(function(error) {
        console.log("Error getting documents: ", error);
        });
      }
    }
}
</script>

<style lang="scss" scoped>

</style>
