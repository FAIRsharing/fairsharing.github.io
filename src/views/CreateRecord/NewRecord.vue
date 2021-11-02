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
                  <base-fields
                    @submission="setSubmitAnyway()"
                    @clearing="tryAgain()"
                  />
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="primary"
                :disabled="disableSubmit()"
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
    import RESTClient from "@/lib/Client/RESTClient.js"
    import status from "@/data/status.json"
    import BaseFields from "../../components/Editor/GeneralInformation/BaseFields";
    import Loaders from "../../components/Navigation/Loaders";
    import { isUrl } from "@/utils/rules.js"

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
            },
            rules: {
              isUrl: function(){return isUrl()}
            },
            submitAnyway: false,
            recordCreated: false
          }
        },
        computed: {
            ...mapState('users', ["user"]),
            ...mapState('editor', ['possibleDuplicates']),
            ...mapGetters('record', ['getSection'])
        },
        async mounted(){
          this.$nextTick(async function () {
            this.loaded = false;
            this.resetRecord();
            await this.getData();
            this.loaded = true;
            this.$store.commit("editor/clearPossibleDuplicates");
            this.$store.commit("record/setCreatingNewRecord");
          });
        },
        methods: {
          ...mapActions("editor",
              ["getCountries",
               "getRecordTypes",
               "getTags",
               "getPossibleDuplicates",
               "cleanEditorStore"
              ]),
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
            // The user has not specified to ignore the warning of duplicate records.
            // So, a check is made to see if the server reports any possibilities
            if (!this.submitAnyway) {
              record = await this.checkForDups(record);
            }

            if (this.submitAnyway) {
              if (this.possibleDuplicates.length > 0) {
                record.dups_suspected = true;
              }
              else {
                record.dups_suspected = false;
              }
            }
            else {
              if (this.possibleDuplicates.length > 0) {
                return;
              }
            }

            record.record_type_id = record.type.id;
            record.metadata.status = status;
            record.country_ids = record.countries.map(obj => obj.id);
            record.metadata.status = record.status;

            delete record.status;
            delete record.countries;
            delete record.type;
            let new_record = await restClient.createRecord(record, this.user().credentials.token);
            this.recordCreated = true;
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
          },
          async checkForDups(record) {
            const _module = this;
            // run the dup check query, using stored_name, stored_abbreviation or stored_homepage; any that
            // are over three characters in length.
            let fieldsToQuery = [];
            // These are only queried if they are at least 6 characters...
            [record.metadata.name, record.metadata.abbreviation].forEach(function(val) {
              /* istanbul ignore else */
              if (val === null) {
                return;
              }
              if (val.trim().length >= 3) {
                fieldsToQuery.push(val);
              }
            });
            // ...whereas any length URL will do if it is valid.
            let urlCheck = _module.rules.isUrl();
            /* istanbul ignore next */
            if (urlCheck(record.metadata.homepage)) {
              fieldsToQuery.push(record.metadata.homepage)
            }
            /* istanbul ignore if */
            if (fieldsToQuery.length === 0) {
              return;
            }
            // Now send the query.
            await _module.getPossibleDuplicates({fields: fieldsToQuery});
            if (_module.possibleDuplicates.length > 0) {
              record.dups_suspected = true;
            }
            return record;
          },
          disableSubmit() {
            let _module = this;
            if (!_module.formValid) {
              return true;
            }
            if (_module.possibleDuplicates.length > 0) {
              if (_module.submitAnyway) {
                return false;
              }
              else {
                return true;
              }
            }
            return false;
          },
          setSubmitAnyway() {
            this.submitAnyway = true;
          },
          tryAgain() {
            this.submitAnyway = false;
            this.$store.commit("editor/clearPossibleDuplicates");
          }
        }
    }
</script>

<style scoped>
.v-autocomplete__content .v-subheader {
  font-size: 2rem;
  text-transform: capitalize;
}

#autocompleteSelect .v-list-item {
  min-height: 0 !important;
}
</style>
