<template>
  <div class="container-fluid">
    <div class="row">
      <div
        v-for="(record, index) in input_data"
        :key="index"
        class="col col-xl-4 col-lg-4 col-sm-6"
      >
        <div class="card">
          <div class="card-header">
            <a :href="'#/'+record.id">{{ record.name }}</a>
          </div>
          <div class="card-body">
            <div
              v-for="(itemVal, itemKey, subIndex) in record"
              :key="subIndex"
            >
              <b>{{ itemKey }}: </b> {{ itemVal }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "SearchOutputGrid",
        props: {
            inputData: {
                type: Array,
                default: function () {
                    return []
                }
            }
        }
    }
</script>

<style scoped>

</style>