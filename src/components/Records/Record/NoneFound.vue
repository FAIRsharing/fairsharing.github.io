<template>
  <v-card
    v-if="display"
    class="mt-2 pr-2 pl-4 pt-1 pb-2 d-flex flex-column"
    flat
    outlined
  >
    <div class="d-flex mt-2 ">
      <p class="ma-0">
        None found.
      </p>
    </div>
  </v-card>
</template>

<script>
    export default {
      name: "NoneFound",
      props: {
        dataField: {
          type: Array,
          default: null
        }
      },
      computed: {
        display: function() {
          return this.dataField.length === 0;
        }
      }
    }
</script>

<style scoped>

</style>