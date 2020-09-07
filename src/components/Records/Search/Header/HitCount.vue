<template>
  <div class="mt-2" style="text-align: center;">
    <p>Displaying {{x}}  to {{y}} of {{ hits }}.</p>
  </div>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "HitCount",
        computed: {
          ...mapState("records", ["hits", "perPage", "currentPage"]),
          x: function () {
            let _module = this;
            return _module.perPage * (_module.currentPage -1)
          },
          y: function () {
            let _module = this;
            return (_module.perPage * _module.currentPage) -1
          }
        }
    }
</script>

<style scoped>

</style>