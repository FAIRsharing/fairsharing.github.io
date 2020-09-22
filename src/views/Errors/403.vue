<template>
  <div>
    <h1 class="text-center mt-5 blue--text">
      Error 403: <br>
    </h1>
    <h3 class="text-center mb-5 blue--text">
      Sorry but you are not authorized to access {{ getSource }}.
    </h3>
  </div>
</template>

<script>
    export default {
        name: "Error403",
        computed: {
          getSource(){
            return window.location.host + ((this.$route.query.source) ? JSON.parse(this.$route.query.source) : '' + " this page");
          }
        }
      }
</script>

<style scoped>

</style>
