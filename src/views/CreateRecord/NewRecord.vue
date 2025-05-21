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
              <h3
                v-if="fairassistOnly"
                class="white--text"
              >
                Creating a new FAIRassist record
              </h3>
              <h3
                v-else
              >
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
                    :create-mode="true"
                    :submit-record="submitAnyway"
                    :loading="loading"
                    @submission="setSubmitAnyway()"
                    @clearing="tryAgain()"
                    @createnewrecord="createRecord()"
                  />
                </v-row>
              </v-container>
            </v-card-text>
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
    <v-dialog
      v-model="recordCreated"
      max-width="700px"
    >
      <v-card>
        <v-card-title
          class="headline"
        >
          <p>
            <b>Draft submission saved!</b>
          </p>
        </v-card-title>
        <v-card-text>
          <p>
            We'll email you confirmation, including  details of the
            remaining fields you'll need to add for your record. Our curators
            won't check your record until it is complete. 
          </p>
          <p>
            Click the button below to carry on adding information to your record.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="redirectToEdit(newRecord)"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
    import { mapActions, mapGetters,mapState } from "vuex"

    import status from "@/data/status.json"
    import RESTClient from "@/lib/Client/RESTClient.js"
    import { isUrl } from "@/utils/rules.js"

    import BaseFields from "../../components/Editor/GeneralInformation/BaseFields";
    import Loaders from "../../components/Navigation/Loaders";

    let restClient = new RESTClient();

    /** Component to generate the new record page and its buttons to redirect to new collection, standard, policy and database
     *
     */
    export default {
      name: "NewRecordPage",
      components: {Loaders, BaseFields},
      props: {
        fairassistOnly: { type: Boolean, default: false }
      },
      data(){
          return {
            record: {},
            newRecord: {},
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
            recordCreated: false,
            loading: false,
          }
        },
        computed: {
            ...mapState('users', ["user"]),
            ...mapState('editor', ['possibleDuplicates', 'objectTypes']),
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
               "getObjectTypes",
               "getPossibleDuplicates",
               "cleanEditorStore"
              ]),
          ...mapActions("record", ["resetRecord"]),
          async getData(){
            await this.getCountries();
            await this.getRecordTypes(this.fairassistOnly);
            await this.getTags();
            await this.getObjectTypes();
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

            this.loading = true;

            record.record_type_id = record.type.id;
            record.metadata.status = status;
            record.country_ids = record.countries.map(obj => obj.id);
            record.metadata.status = record.status;

            this.objectTypes.forEach(type => {
              if (type.label === 'object type not found') {
                record.object_type_ids = [type.id];
              }
            })

            delete record.status;
            delete record.countries;
            delete record.type;
            let new_record = await restClient.createRecord(record, this.user().credentials.token);
            if (new_record.error) {
              this.message = {
                error: true,
                value: new_record.error
              }
            }
            else {
              this.recordCreated = true;
              this.newRecord = new_record;
            }
          },
          redirectToEdit(record) {
            this.recordCreated = false;
            this.$router.push({
              path: record.data.id + "/edit"
            });
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
