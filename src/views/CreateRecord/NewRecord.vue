<template>
  <v-container
    id="createRecord"
    fluid
  >
    <v-row>
      <v-col cols="12">
        <v-card v-if="loaded">
          <v-card-title class="primary white--text">
            <h3 class="white--text">
              Creating a new FAIRsharing record
            </h3>
          </v-card-title>
          <v-card-text class="pt-3">
            <v-form
              id="createRecord"
              ref="createRecord"
              v-model="formValid"
            >
              <v-container fluid>
                <v-row>
                  <base-fields />
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn class="primary">Create Record</v-btn>
          </v-card-actions>
        </v-card>

        <v-fade-transition>
          <v-overlay
            v-if="!loaded"
            :absolute="false"
            opacity="0.8"
          >
            <loaders />
          </v-overlay>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import { mapState, mapActions } from "vuex"
    import RESTClient from "@/components/Client/RESTClient.js"
    import status from "@/data/status.json"
    import BaseFields from "../../components/Editor/GeneralInformation/BaseFields";
    import Loaders from "../../components/Navigation/Loaders";


    let restClient = new RESTClient();

    /** Component to generate the new record page and its buttons to redirect to new collection, standard, policy and database
     *
     */
    export default {
      name: "NewRecordPage",
      components: {Loaders, BaseFields},
      data(){
          return {
            record: {},
            recordsTypes: [],
            formValid: false,
            loaded: false,
          }
        },
        computed: {
            ...mapState('users', ["user"]),
            status: function(){ return status.status; }
        },
        async mounted(){
          this.$nextTick(async function () {
            this.loaded = false;
            this.resetRecord();
            await this.getData();
            this.loaded = true;
          });
        },
        methods: {
          ...mapActions("editor", ["getCountries", "getRecordTypes", "getTags"]),
          ...mapActions("record", ["resetRecord"]),
          async getData(){
            await this.getCountries();
            await this.getRecordTypes();
            await this.getTags();
          },
          createRecord: async function(){
            const _module = this;
            let record = {
              metadata: _module.record
            };
            record.metadata.status = _module.models.recordStatus.name;
            record.record_type_id = _module.models.recordType.id;
            let new_record = await restClient.createRecord(record, _module.user().credentials.token);
            if (Object.prototype.hasOwnProperty.call(new_record.data, "id")) {
              _module.$router.push({
                path: new_record.data.id
              });
            }
          }
        },
    }
</script>

<style>
  .v-autocomplete__content .v-subheader {
    font-size: 2rem;
    text-transform: capitalize;
  }

  #autocompleteSelect .v-list-item {
      min-height: 0 !important;
  }

</style>
