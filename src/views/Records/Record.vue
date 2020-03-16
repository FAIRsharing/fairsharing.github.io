<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div
    class="standard container-fluid"
  >
    <div
      class="container-fluid"
    >
      <v-row>
        <v-col cols12>
          <v-card>
            <v-list-item class="blue">
              <v-list-item-content class="pa-0">
                <v-list-item-title
                  v-if="currentRecord['fairsharingRecord']"
                  class="headline text-left white--text"
                >
                  {{ currentRecord['fairsharingRecord'].name }} - {{ currentRecord['fairsharingRecord'].doi }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-avatar
                v-if="userLoggedIn"
                style="height:auto !important"
              >
                <v-menu
                  v-if="$store.state.users.userLoggedIn"
                  offset-y
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      dark
                      icon
                      v-on="on"
                    >
                      <v-icon>
                        fa-ellipsis-v
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(item, index) in items"
                      :key="index"
                      @click="console.log('Hello')"
                    >
                      <v-list-item-title class="text-left">
                        {{ item }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-avatar>
            </v-list-item>

            <v-card-text class="container-fluid">
              <v-row v-if="!error && queryTriggered">
                <v-col class="col-12">
                  <div
                    v-for="(field, label, index) in currentRecord['fairsharingRecord']"
                    :key="index"
                    class="text-left"
                  >
                    <div v-if="field">
                      <b class="blue--text">{{ label }}: </b>
                      <span v-if="typeof field === 'string'">
                        {{ field }}
                      </span>
                      <v-list-item v-else>
                        <v-list-item-content>
                          <v-list-item-subtitle>{{ field }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </div>
                  </div>
                </v-col>

                <div class="col-12">
                  <v-btn
                    type="button"
                    @click="getHistory()"
                  >
                    Get History
                  </v-btn>
                  <hr>
                  {{ currentRecordHistory }}
                </div>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <div
        v-if="error"
        class="error"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
    import Client from '../../components/GraphClient/GraphClient.js'
    import { mapActions, mapState } from 'vuex'

    /** Component to handle the display of single record.
     * @vue-data {String | null} [error = null] - either null of an error message to display
     * @vue-data {Boolean} [queryTriggered = false] - has the API query been triggered yet or not
     * @vue-computed {String} currentRoute - return the ID parameter value of the current route
     * @vue-computed {Object} currentRecord - the current record obtained from the store
     * @vue-computed {Object} currentRecordHistory - the history of the current record obtained from the store
     * @vue-event {Promise} fetchRecord - Method to get the current record
     * @vue-event {Promise} fetchRecordHistory - Method to get the current record history
     */
    export default {
        name: "Record",
        data() {
            return {
                error: null,
                queryTriggered: false,
                items: ["Edit", "Admin Edit", "Claim Ownership", "Suggest and edit/Questions?", "Watch Record"]
            }
        },
        computed: {
            currentRoute: function () {
                return this.$route.params['id']
            },
            ...mapState('records', ["currentRecord", "currentRecordHistory"]),
            ...mapState('users', ["userLoggedIn"])
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
            /** Method to get the page title
             *  @returns {String} - the title of the current page
             */
            getTitle: function(){
                return 'FAIRsharing | ' + this.currentRoute
            },
            /**
             * Method to set the current record in the store
             * @returns {Promise} - the current record
             * */
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
            /**
             * Method to dispatch the current record history into the store
             * @returns {Promise} - the current record history
             * */
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
