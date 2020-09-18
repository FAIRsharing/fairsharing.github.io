<template>
  <div>
    <h1 class="text-center mt-5 blue--text">
      Error 404: <br>
    </h1>
    <h3 class="text-center mb-5 blue--text"> {{ getSource }} couldn't be found ! </h3>
  </div>
</template>

<script>
    export default {
        name: "Error404",
        computed: {
            getSource(){
              return JSON.parse(this.$route.query.source)
            }
        }
    }
</script>

<style scoped>

</style>
