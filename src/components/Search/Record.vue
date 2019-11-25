<template>
    <div class="standard" id="standard_ABA">
        <h2>ABA Adult Mouse Brain</h2>
        <p>ID: {{ currentRoute}}</p>
    </div>
</template>

<script>
    export default {
        name: "ABA",
        id: 'ABA',
        computed: {
          currentRoute: function(){
              return this.$route.params['id']
          }
        },
        metaInfo() {
            return {
                title: 'FAIRsharing | ' + this.currentRoute
            }
        }
    }
</script>

<style scoped>

</style>