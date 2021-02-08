<template>
  <v-container
    id="createRecord"
    fluid
  >
    <v-form
      id="createRecord"
      ref="createRecord"
      v-model="formValid"
    >
      <v-row>
        <v-col cols="12">
          <v-card v-if="loaded">
            <v-card-title class="primary white--text">
              <h3 class="white--text">
                Creating a new FAIRsharing record
              </h3>
            </v-card-title>
            <v-card-text
              v-if="message.error"
              class="pt-4"
            >
              <v-alert type="error">
                {{ message.value }}<v-icon class="px-3">
                  fa-arrow-right
                </v-icon> {{ message.value.response.data }}
              </v-alert>
            </v-card-text>
            <v-card-text class="pt-3">
              <v-container fluid>
                <v-row>
                  <base-fields />
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="primary"
                :disabled="!formValid"
                @click="createRecord()"
              >
                Create Record
              </v-btn>
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
    </v-form>
  </v-container>
</template>

<script>
    import { mapState, mapActions, mapGetters } from "vuex"
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
            message: {
              error: false,
              value: null
            }
          }
        },
        computed: {
            ...mapState('users', ["user"]),
            ...mapGetters('record', ['getSection'])
        },
        async mounted(){
          this.$nextTick(async function () {
            this.loaded = false;
            this.resetRecord();
            await this.getData();
            this.loaded = true;
            this.$store.commit("record/setCreatingNewRecord");
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
          async createRecord(){
            this.message = {
              error: false,
              value: null
            };
            let record = JSON.parse(JSON.stringify(this.getSection("generalInformation").data));
            record.record_type_id = record.type.id;
            record.metadata.status = status;
            record.country_ids = record.countries.map(obj => obj.id);
            record.metadata.status = record.status;

            delete record.status;
            delete record.countries;
            delete record.type;
            let new_record = await restClient.createRecord(record, this.user().credentials.token);
            if (!new_record.error) {
              this.$router.push({
                path: new_record.data.id + "/edit"
              });
            }
            else {
              this.message = {
                error: true,
                value: new_record.error
              }
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
