<template>
  <div>
    <h1 class="text-center mt-5 blue--text">
      Unauthorized <br>
    </h1>
    <h3 class="text-center mb-5 blue--text">
      Sorry but you are not authorized to access this page.
    </h3>
  </div>
</template>

<script>
    export default {
        name: "Error403",
      metaInfo() {
        return {
          title: "FAIRsharing | Not Authorized"
        }
      }
    }
</script>
