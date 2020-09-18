<template>
  <div>
    <h1 class="text-center my-5 blue--text">
      404: {{ getSource }} couldn't be found !
    </h1>
  </div>
</template>

<script>
    export default {
        name: "Error404",
        computed: {
            getSource(){
              return this.$route.query.source
            }
        }
    }
</script>

<style scoped>

</style>
