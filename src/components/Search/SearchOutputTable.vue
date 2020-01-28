<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th
          v-for="(header, name, index) in headers"
          :key="index"
        >
          {{ name }}
        </th>
      </tr>
    </thead>
    <tbody>
      {{ inputData }}
      <tr
        v-for="(record, index) in inputData"
        :key="index"
      >
        <td
          v-for="(property, subIndex) in record"
          :key="subIndex"
        >
          {{ property }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
    /** This component produces the output table based on the received data.
     * @vue-prop {Object} input_data - the data that comes from the API
     */
    export default {
        name: "SearchOutputTable",
        props: {
            inputData: {
                type: Array,
                default: function(){
                    return []
                }
            },
            headers: {
                type: Object,
                default: function(){
                    return{}
                }
            }
        }
    }
</script>

<style scoped>

</style>