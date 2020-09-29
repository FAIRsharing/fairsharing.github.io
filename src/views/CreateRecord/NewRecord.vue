<template>
  <v-container
    id="createRecord"
    fluid
  >
    <v-row>
      <v-col cols="12">
        <v-card>
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
              <v-container
                id="recordMetadata"
                fluid
              >
                <v-row>
                  <v-col
                    v-for="(fieldVal, fieldName, fieldKey) in getFields()"
                    :key="'edit_' + fieldKey"
                    :class="{'col-2': fieldVal.type !== 'longtext', 'col-12': fieldVal.type === 'longtext', 'col-3': fieldVal.type === 'autocomplete'}"
                  >
                    <!-- simple input -->
                    <div v-if="fieldVal.type === 'string'">
                      <v-text-field
                        v-model="record[fieldName]"
                        :label="fieldName"
                        :hint="fieldVal.description"
                        outlined
                        :required="fieldVal.required"
                        :rules="fieldVal.rules"
                      />
                    </div>

                    <!-- long text -->
                    <div v-if="fieldVal.type === 'longtext'">
                      <v-textarea
                        v-if="fieldName !== 'deprecation_reason' || (models.recordStatus !== null && models.recordStatus.name === 'deprecated')"
                        v-model="record[fieldName]"
                        :label="fieldVal.label"
                        :hint="fieldVal.description"
                        outlined
                        :required="fieldVal.required"
                        :rules="fieldVal.rules"
                      />
                    </div>

                    <!-- autocomplete -->
                    <div v-if="fieldVal.type === 'autocomplete'">
                      <v-autocomplete
                        :id="fieldName + '_autocomplete'"
                        v-model="models[fieldVal.target]"
                        :items="getItems(fieldVal.source)"
                        item-text="name"
                        item-value="name"
                        :label="fieldName"
                        outlined
                        return-object
                        :required="fieldVal.required"
                        :disabled="fieldName !== 'Record Type' && models.recordType !== null && models.recordType.name === 'collection'"
                        :rules="fieldVal.rules"
                      >
                        <!-- autocomplete selected -->
                        <template v-slot:selection="data">
                          {{ data.item.name.replace(/_/g, ' ') }}
                        </template>

                        <!-- autocomplete data -->
                        <template v-slot:item="data">
                          <v-list
                            id="autocompleteSelect"
                            max-width="565px"
                            three-line
                          >
                            <v-list-item min-height="0px">
                              <v-list-item-content class="py-0">
                                <v-list-item-title> {{ data.item.name.replace(/_/g, ' ') }} </v-list-item-title>
                                <v-list-item-subtitle> {{ data.item.description }} </v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </template>
                      </v-autocomplete>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-btn
                    type="submit"
                    class="primary"
                    :disabled="!formValid"
                    @click="createRecord()"
                  >
                    Create Record
                  </v-btn>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import { mapState } from "vuex"
    import GraphClient from "@/components/GraphClient/GraphClient.js"
    import typesQuery from "@/components/GraphClient/queries/getRecordsTypes.json"
    import RESTClient from "@/components/Client/RESTClient.js"
    import status from "@/data/status.json"
    import { isLongEnough, isRequired, isUrl } from "@/utils/rules.js"


    let client = new GraphClient();
    let restClient = new RESTClient();

    /** Component to generate the new record page and its buttons to redirect to new collection, standard, policy and database
     *
     */
    export default {
        name: "NewRecordPage",
        data(){
          return {
            record: {},
            recordsTypes: [],
            models: {
                recordType: null,
                recordStatus: null,
            },
            formValid: false
          }
        },
        computed: {
            ...mapState('users', ["user"]),
            status: function(){ return status.status; }
        },
        watch: {
            models: {
              deep: true,
              handler(oldVal, newVal){
                const _module = this;
                if (newVal.recordType !== null && newVal.recordType.name === "collection"){
                  _module.models.recordStatus = "uncertain";
                  delete _module.record["deprecation_reason"];
                }
              }
            }
        },
        async mounted(){
          const _module = this;
          let data = await client.executeQuery(typesQuery);
          const size = data['fairsharingRegistries'].records.length;
          let currentItem = 0;
          data['fairsharingRegistries'].records.forEach(function(type){
            currentItem += 1;
            _module.recordsTypes.push({
              header: type.name
            });
            type.recordTypes.forEach(function(subType){
              _module.recordsTypes.push({
                name: subType.name,
                group: type.name,
                id: subType.id,
                description: subType.description
              })
            });
            if (currentItem < size) _module.recordsTypes.push({ divider: true });
          });


        },
        methods: {
          getFields: function () {
            return {
                name: {
                    type: "string",
                    description: "The name of the record",
                    required: true,
                    rules: [isLongEnough(5), isRequired()]
                },
                abbreviation: {
                    type: "string",
                    description: "Abbreviation or short name for the record",
                    required: false,
                    rules: [isRequired()]
                },
                homepage: {
                    type: "string",
                    description: "The homepage of the record",
                    format: "uri",
                    required: false,
                    rules: [isUrl(), isRequired()]
                },
                "Record Type": {
                    type: "autocomplete",
                    source: "recordsTypes",
                    required: true,
                    target: "recordType",
                  rules: [isRequired()]
                },
                status: {
                    type: "autocomplete",
                    source: "status",
                    required: false,
                    target: "recordStatus",
                    rules: [isRequired()]
                },
                "deprecation_reason": {
                    type: "longtext",
                    description: "A short description of why the resource is no longer actively maintained.",
                    required: false,
                    label: "Deprecation reason"
                },
                description: {
                    type: "longtext",
                    description: "The description of the record",
                    required: false,
                    label: "description",
                    rules: [isRequired()]
                }
            }
          },
          getItems: function(fieldName){
              return this[fieldName]
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
