<template>
  <div class="container-fluid">

    <div v-if="records.length === 0">
      LOADING
    </div>

    <div class="row">
      <div
        v-for="record in records"
        :key="'record'+record.id"
        class="col col-xl-3 col-lg-3 col-sm-6"
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
  import { mapState} from 'vuex'

    export default {
        name: "SearchOutputGrid",
        computed: {
          ...mapState('records', ["records"])
        },
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