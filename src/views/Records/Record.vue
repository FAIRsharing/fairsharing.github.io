<template>
  <div
    class="standard container-fluid"
  >
    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>

    <div
      v-if="!error && queryTriggered"
      class="row"
    >
      <div class="col-10">
        <span>{{ currentRecord['fairsharingRecord'].name }}</span>
        <div class="card">
          <div
            v-for="(field, label, index) in currentRecord['fairsharingRecord']"
            :key="index"
          >
            <b>{{ label }}: </b> {{ field }}
          </div>
        </div>
      </div>

      <div class="col-2">
        <button
          type="button"
          class="btn btn-dark"
          @click="getHistory()"
        >
          Get History
        </button>
        <hr>
        {{ currentRecordHistory }}
      </div>
    </div>
  </div>
</template>

<script>
    import Client from '../../components/GraphClient/GraphClient.js'
    import { mapActions, mapState } from 'vuex'

    /** Component to handle the display of single record.
     * @vue-computed {String} currentRoute - the route of the current page
     */
    export default {
        name: "Record",
        data() {
            return {
                error: null,
                queryTriggered: false
            }
        },
        computed: {
            currentRoute: function () {
                return this.$route.params['id']
            },
            ...mapState('records', ["currentRecord", "currentRecordHistory"])
        },
        watch: {
            currentRoute: async function () {
                await this.getData();
            }
        },
        mounted: function () {
            this.$nextTick(async function () {
                this.client = new Client();
                await this.getData();
            })
        },
        methods: {
            /** Method to build and return the page title to be included as a metadata
             *  @returns {String} - the title of the current page
             */
            getTitle: function(){
                return 'FAIRsharing | ' + this.currentRoute
            },
            getData: async function(){
                this.queryTriggered = false;
                this.error = null;
                try {
                    await this.fetchRecord(this.currentRoute);
                }
                catch(e){
                    this.error = e.message;
                }
                this.queryTriggered = true;
            },
            ...mapActions('records', ['fetchRecord', "fetchRecordHistory"]),
            getHistory: async function(){
                await this.$store.dispatch("records/fetchRecordHistory", this.currentRoute);
            }
        },
        /**
         * Setting up the metaInfo of the page
         * @returns {{title: String}}
         * */
        metaInfo() {
            return {
                title: this.getTitle()
            }
        },
    }
</script>

<style scoped>

  .error {
    background-color: indianred;
    border:1px solid red;
    padding:20px;
    color:white;
    margin:20px;
    text-align: left;
    font-size: 18px;
  }

</style>
