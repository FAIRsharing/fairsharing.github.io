<template>
  <div
    v-if="hits"
    class="mt-2"
  >
    <p class="text-center">
      Displaying {{ x }}  to {{ y }} of {{ hits }}.
    </p>
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
            return (_module.perPage * (_module.currentPage -1)) + 1;
          },
          y: function () {
            let _module = this;
            let max = ((_module.perPage * _module.currentPage) -1) + 1;
            if (max > _module.hits) {
              max = _module.hits;
            }
            return max;
          }
        }
    }
</script>
