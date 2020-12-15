<template>
  <v-card
    v-if="metaTemplate.metadata"
    id="editGeneralInfo"
  >
    <v-card-title class="grey lighten-4 blue--text">
      <v-btn
        class="blue mr-4"
        fab
        x-small
      >
        <v-icon
          class="white--text"
          small
        >
          fa fa-info
        </v-icon>
      </v-btn>
      <b> EDIT GENERAL INFORMATION </b>
    </v-card-title>
    <v-alert
      v-if="error && error_message"
      type="error"
    >
      {{ error_message }}
    </v-alert>
    <v-form
      id="editGeneralInfoForm"
      ref="editGeneralInfoForm"
      v-model="formValid"
      class="my-3"
    >
      <v-card-text>
        <v-container fluid>
          <v-row>
            <!-- name -->
            <v-col class="col-3">
              <v-text-field
                v-model="metaTemplate.metadata.name"
                hint="Name of the record"
                label="Record Name"
                :rules="[rules.isRequired()]"
                outlined
              >
                <template v-slot:prepend>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        fa-question-circle
                      </v-icon>
                    </template>
                    Name of the record
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>

            <!-- abbreviation -->
            <v-col class="col-3">
              <v-text-field
                v-model="metaTemplate.metadata.abbreviation"
                label="Abbreviation"
                :rules="[rules.isRequired()]"
                :hint="descriptions['abbreviation']"
                outlined
              >
                <template v-slot:prepend>
                  <v-tooltip
                    bottom
                    max-width="300px"
                    class="text-justify"
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        fa-question-circle
                      </v-icon>
                    </template>
                    {{ descriptions['abbreviation'] }}
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>

            <!-- homepage -->
            <v-col class="col-3">
              <v-text-field
                v-model="metaTemplate.metadata.homepage"
                label="Homepage"
                :rules="[rules.isRequired(), rules.isUrl()]"
                :hint="descriptions['homepage']"
                outlined
              >
                <template v-slot:prepend>
                  <v-tooltip
                    bottom
                    max-width="300px"
                    class="text-justify"
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        fa-question-circle
                      </v-icon>
                    </template>
                    {{ descriptions['homepage'] }}
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>

            <!-- year of creation -->
            <v-col class="col-3">
              <v-autocomplete
                v-model="metaTemplate.metadata.year_creation"
                label="Year of creation"
                :hint="descriptions['year']"
                :items="years"
                outlined
              >
                <template v-slot:prepend>
                  <v-tooltip
                    bottom
                    max-width="300px"
                    class="text-justify"
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        fa-question-circle
                      </v-icon>
                    </template>
                    {{ descriptions['year'] }}
                  </v-tooltip>
                </template>
              </v-autocomplete>
            </v-col>

            <!-- countries -->
            <v-col class="col-4">
              <v-autocomplete
                v-model="metaTemplate.countries"
                label="Countries"
                :items="countries"
                :hint="descriptions['countries']"
                item-text="name"
                item-value="name"
                multiple
                outlined
                return-object
              >
                <template v-slot:prepend>
                  <v-tooltip
                    bottom
                    max-width="300px"
                    class="text-justify"
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        fa-question-circle
                      </v-icon>
                    </template>
                    {{ descriptions['countries'] }}
                  </v-tooltip>
                </template>

                <!-- autocomplete selected -->
                <template v-slot:selection="data">
                  <v-chip
                    class="blue white--text"
                    close
                    @click:close="removeCountry(data.item)"
                  >
                    {{ data.item.name }}
                  </v-chip>
                </template>

                <!-- autocomplete data -->
                <template v-slot:item="data">
                  <country-flag
                    v-if="data.item.code !== null"
                    :country="data.item.code"
                    size="normal"
                  />
                  <img
                    v-else
                    src="@/assets/placeholders/country.png"
                    class="ml-4 mr-3"
                  >
                  <div> {{ data.item.name }} </div>
                </template>
              </v-autocomplete>
            </v-col>

            <!-- registry -->
            <v-col class="col-4">
              <v-autocomplete
                v-model="metaTemplate.type"
                label="Registry type"
                :rules="[rules.isRequired()]"
                hint="Select between given elements"
                :items="recordsTypes"
                item-text="name"
                item-value="name"
                outlined
                return-object
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
            </v-col>

            <!-- status -->
            <v-col class="col-4">
              <v-autocomplete
                v-model="metaTemplate.status"
                label="Status"
                :items="status"
                item-text="name"
                item-value="name"
                outlined
                :disabled="metaTemplate.type === 'collection' || metaTemplate.type.name === 'collection'"
              >
                <!-- autocomplete selected -->
                <template v-slot:selection="data">
                  {{ data.item.name.replace(/_/g, ' ') }}
                </template>

                <!-- autocomplete data -->
                <template v-slot:item="data">
                  <v-list
                    max-width="745px"
                    two-line
                    class="py-0 my-0"
                  >
                    <v-list-item min-height="0px">
                      <v-list-item-content class="py-0 my-0">
                        <v-list-item-title> <b>{{ data.item.name.replace(/_/g, ' ').toUpperCase() }} </b></v-list-item-title>
                        <v-list-item-subtitle> {{ data.item.description }} </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </template>
              </v-autocomplete>
            </v-col>

            <!-- deprecation reasons -->
            <v-col class="col-12">
              <v-textarea
                v-if="metaTemplate.status === 'deprecated'"
                v-model="metaTemplate['deprecation_reason']"
                label="Reason for deprecation"
                :hint="descriptions['deprecation_reason']"
                outlined
              >
                <template v-slot:prepend>
                  <v-tooltip
                    bottom
                    max-width="300px"
                    class="text-justify"
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        fa-question-circle
                      </v-icon>
                    </template>
                    {{ descriptions['deprecation_reason'] }}
                  </v-tooltip>
                </template>
              </v-textarea>
            </v-col>

            <!-- description -->
            <v-col class="col-12">
              <v-textarea
                v-model="metaTemplate.metadata.description"
                label="Description"
                :rules="[rules.isRequired(), rules.isLongEnough(10)]"
                :hint="descriptions['description']"
                outlined
                prepend-icon="fa-question-circle"
              >
                <template v-slot:prepend>
                  <v-tooltip
                    bottom
                    max-width="300px"
                    class="text-justify"
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon v-on="on">
                        fa-question-circle
                      </v-icon>
                    </template>
                    {{ descriptions['description'] }}
                  </v-tooltip>
                </template>
              </v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="primary"
          :disabled="!formValid"
          @click="editRecord()"
        >
          Submit General Info.
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
  import { mapState, mapActions } from "vuex"
  import CountryFlag from 'vue-country-flag'
  import GraphClient from "@/components/GraphClient/GraphClient.js"
  import typesQuery from "@/components/GraphClient/queries/getRecordsTypes.json"
  import status from "@/data/status.json"
  import countriesQuery from "@/components/GraphClient/queries/getCountries.json"
  import des from "@/data/fieldsDescription.json"
  import { isRequired, isUrl, isLongEnough } from "@/utils/rules.js"

  const graphClient = new GraphClient();

  export default {
    name: "EditGeneralInfo",
    components: { CountryFlag },
    data(){
      return {
        recordsTypes: [],
        countries: [],
        yearRange: 100,
        error: false,
        error_message: null,
        rules: {
          isRequired: function(){return isRequired()},
          isUrl: function(){return isUrl()},
          isLongEnough: function(val){return isLongEnough(val)},
        },
        formValid: false
      }
    },
    computed: {
      ...mapState("record", ["metaTemplate", "recordUpdate"]),
      ...mapState("users", ["user"]),
      status(){ return status.status; },
      years(){
        let years = [];
        const rangeArray = [...Array(this.yearRange).keys()];
        let d = new Date();
        let thisYear = d.getFullYear();
        rangeArray.forEach(function(year){
          years.push(thisYear - year);
        });
        return years;
      },
      descriptions() {
        return des.descriptions;
      }
    },
    watch: {
      metaTemplate: {
        deep: true,
        handler(newVal){
          if (newVal.type === "collection" || newVal.type.name === "collection"){
            this.metaTemplate.status = "uncertain";
          }
        }
      }
    },
    async mounted(){
      const _module = this;
      let data = await graphClient.executeQuery(typesQuery);
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
      _module.countries = await _module.getCountries();
    },
    methods: {
      ...mapActions("record", ["updateRecord"]),
      getCountries: async function(){
        let countries = await graphClient.executeQuery(countriesQuery);
        return countries['searchCountries'];
      },
      editRecord: async function(){
        // PREPARE THE DATA
        this.error = false;
        let countries = [];
        let newRecord = JSON.parse(JSON.stringify(this.metaTemplate));
        this.metaTemplate.countries.forEach(function(country){ countries.push(country.id) });
        newRecord.country_ids = countries;
        newRecord.record_type_id = this.metaTemplate.type.id;
        newRecord.metadata.status = this.metaTemplate.status;
        newRecord.metadata.deprecation_reason = this.metaTemplate.deprecation_reason;
        delete newRecord.countries;
        delete newRecord.type;
        delete newRecord.status;
        let data = {
          record: newRecord,
          id: this.$route.params.id,
          token: this.user().credentials.token
        };

        // POST THE DATA AND REACT THE RESPONSE
        await this.updateRecord(data);
        if (!this.recordUpdate.error){
          let ID = this.recordUpdate.id.data.id;
          this.$router.push({
            path: "/" + ID
          })
        }
        else {
          this.error = this.recordUpdate.error;
          this.error_message = this.recordUpdate.message.data;
        }
      },
      removeCountry: function(country){
        const _module = this;
        _module.countries = _module.countries.filter(obj => obj.label !== country.name && obj.id !== country.id);
      },
    },
  }
</script>
