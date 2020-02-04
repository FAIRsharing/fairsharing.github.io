<template>
  <div class="container-fluid">

    <div v-if="inputData.length === 0">
      LOADING
    </div>

    <div class="row">
      <div
        v-for="record in inputData"
        :key="'record'+record.id"
        class="col col-xl-2 col-lg-2 col-sm-6"
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
  .card-body {
    text-align: left;
    max-height: 500px;
    overflow-y: auto;
  }

  .card {
    height:500px;
  }
  .col {
    margin-bottom:20px;
  }
</style>