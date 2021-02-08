<template>
  <div>
    <!--  dataField  -->
    <v-card
      v-if="displayData"
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
    <!--  SingleField  -->
    <div v-else-if="!displayString && !dataField">
      <span>None found.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoneFound",
  props: {
    dataField: {
      type: Array,
      default: null
    },
    stringField: {
      type: String,
      default: null
    },
  },
  computed: {
    displayData: function () {
      return this.dataField && this.dataField.length === 0;
    },
    displayString: function () {
      return this.stringField;
    }
  }
}
</script>
