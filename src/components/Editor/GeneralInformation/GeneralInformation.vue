<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editGeneralInformation"
    ref="editGeneralInformation"
    v-model="formValid"
  >
    <v-card>
      <v-card-title class="grey lighten-4 blue--text">
        Edit General Information
        <span
          v-if="getChanges['generalInformation']"
          class="orange--text ml-2"
        >({{ getChanges['generalInformation'] }})</span>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row v-if="initialized">
            <!-- name -->
            <v-col
              xl="3"
              lg="6"
              md="12"
              sm="12"
              xs="12"
            >
              <v-text-field
                v-model="fields.current.metadata.name"
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
            <v-col
              xl="3"
              lg="6"
              md="12"
              sm="12"
              xs="12"
            >
              <v-text-field
                v-model="fields.current.metadata.abbreviation"
                label="Abbreviation"
                :rules="[rules.isRequired()]"
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
                    {{ tooltips['abbreviation'] }}
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>

            <!-- homepage -->
            <v-col
              xl="3"
              lg="6"
              md="12"
              sm="12"
              xs="12"
            >
              <v-text-field
                v-model="fields.current.metadata.homepage"
                label="Homepage"
                :rules="[rules.isRequired(), rules.isUrl()]"
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
                    {{ tooltips['homepage'] }}
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>

            <!-- creation year -->
            <v-col
              xl="3"
              lg="6"
              md="12"
              sm="12"
              xs="12"
            >
              <v-autocomplete
                v-model="fields.current.metadata.year_creation"
                label="Year of creation"
                :items="years()"
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
                    {{ tooltips['year'] }}
                  </v-tooltip>
                </template>
              </v-autocomplete>
            </v-col>

            <!-- countries -->
            <v-col
              xl="4"
              lg="12"
              md="12"
              sm="12"
              xs="12"
            >
              <v-autocomplete
                v-model="fields.current.countries"
                label="Countries"
                :items="countries"
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
                    {{ tooltips['countries'] }}
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
            <v-col
              xl="4"
              lg="6"
              md="12"
              sm="12"
              xs="12"
            >
              <v-autocomplete
                ref="editRecordType"
                v-model="fields.current.type"
                label="Registry type"
                :rules="[rules.isRequired()]"
                :items="recordTypes"
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
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item
                        class="registryList"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-list-item-avatar>
                          <v-img :src="icons()[data.item.name]" />
                        </v-list-item-avatar>
                        <v-list-item-content class="py-0">
                          <v-list-item-title>
                            <b>{{ data.item.name.replace(/_/g, ' ').toUpperCase() }}</b>
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ data.item.description }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <span class="tooltips">{{ data.item.description }}</span>
                  </v-tooltip>
                </template>
              </v-autocomplete>
            </v-col>

            <!-- status -->
            <v-col
              xl="4"
              lg="6"
              md="12"
              sm="12"
              xs="12"
            >
              <v-autocomplete
                v-model="fields.current.status"
                label="Status"
                :items="status"
                item-text="name"
                item-value="name"
                outlined
                :disabled="fields.current.type === 'collection' || fields.current.type.name === 'collection'"
              >
                <!-- autocomplete selected -->
                <template v-slot:selection="data">
                  {{ data.item.name.replace(/_/g, ' ') }}
                </template>

                <!-- autocomplete data -->
                <template v-slot:item="data">
                  <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                      <v-list-item
                        class="registryList"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-list-item-avatar>
                          <status-pills :status="data.item.name" />
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title> <b>{{ data.item.name.replace(/_/g, ' ').toUpperCase() }} </b></v-list-item-title>
                          <v-list-item-subtitle> {{ data.item.description }} </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <span class="tooltips"> {{ data.item.description }} </span>
                  </v-tooltip>
                </template>
              </v-autocomplete>
            </v-col>

            <!-- deprecation reasons -->
            <v-col cols="12">
              <v-expand-transition>
                <v-textarea
                  v-if="fields.current.status === 'deprecated'"
                  v-model="fields.current['deprecation_reason']"
                  label="Reason for deprecation"
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
                      {{ tooltips['deprecation_reason'] }}
                    </v-tooltip>
                  </template>
                </v-textarea>
              </v-expand-transition>
            </v-col>

            <!-- description -->
            <v-col cols="12">
              <v-textarea
                v-model="fields.current.metadata.description"
                label="Description"
                :rules="[rules.isRequired(), rules.isLongEnough(40)]"
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
                    {{ tooltips['description'] }}
                  </v-tooltip>
                </template>
              </v-textarea>
            </v-col>

            <!-- contact points -->
            <v-col cols="12">
              <Contact />
            </v-col>

            <v-col
              cols="12"
              class="py-0 my-0"
            >
              <v-divider />
            </v-col>

            <!-- keywords-->
            <v-col cols="12">
              <edit-tags />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="primary"
          @click="saveRecord(true)"
        >
          Save and continue
        </v-btn>
        <v-btn
          class="primary"
          @click="saveRecord(false)"
        >
          Save and exit
        </v-btn>
      </v-card-actions>
    </v-card>
    <database-warning />
  </v-form>
</template>

<script>
    import { mapState, mapGetters, mapActions } from "vuex"
    import CountryFlag from 'vue-country-flag'
    import { isRequired, isUrl, isLongEnough } from "@/utils/rules.js"
    import StatusPills from "@/components/Records/Shared/StatusPills";
    import Contact from "./Contact";
    import EditTags from "./EditTags";
    import DatabaseWarning from "./databaseWarning";

    const diff = require("deep-object-diff").diff;

    export default {
        name: "GeneralInformation",
        components: {DatabaseWarning, EditTags, Contact, StatusPills, CountryFlag},
        data(){
            return {
                loaders: {
                    get: false,
                    post: false
                },
                initialized: false,
                rules: {
                    isRequired: function(){return isRequired()},
                    isUrl: function(){return isUrl()},
                    isLongEnough: function(val){return isLongEnough(val)},
                },
                formValid: false,
                fields: {
                    initial: null,
                    current: null
                },
                databaseWarning: false,
            }
        },
        computed: {
            ...mapState("editor", [
                "countries",
                "years",
                "tooltips",
                "recordTypes",
                "icons",
                "status"
            ]),
            ...mapGetters("record", ["getSection", "getChanges"]),
        },
        watch: {
            'fields.current': {
                deep: true,
                handler(newVal){
                    let changes = 0;
                    if (this.initialized){
                        if (newVal.type === "collection" || newVal.type.name === "collection"){
                            this.fields.current.status = "uncertain";
                        }
                        else if (newVal.type.name === "repository" || newVal.type.name === "knowledge_base"){
                          console.log(123);
                          this.databaseWarning = true;
                        }
                        if (newVal.status !== "deprecated"){
                          this.fields.current.deprecation_reason = "";
                        }
                        const differences = diff(newVal, this.fields.initial);
                        Object.keys(differences).forEach(difference => {
                            if (differences[difference] || differences[difference] === "") {
                              if (difference === "type") {
                                if (newVal.type.name !== this.fields.initial.type) changes += 1;
                              }
                              else if (difference !== "metadata") {
                                const exceptions = ["domains", "subjects", "taxonomies", "userDefinedTags"];
                                if (exceptions.indexOf(difference) === -1) changes += 1;
                                else {
                                    const initArray = this.fields.initial[difference].map(obj => obj.id);
                                    const currentArray = newVal[difference].map(obj => obj.id);
                                    let localDiff = diff(initArray, currentArray);
                                    if (Object.keys(localDiff).length > 0) changes += 1;
                                }
                              }
                              else {
                                Object.keys(differences[difference]).forEach(() => {
                                  changes += 1;
                                });
                              }
                            }
                        });
                        this.$store.commit("record/setChanges", {
                            section: "generalInformation",
                            value: changes
                        })
                    }
                }
            }
        },
        mounted() {
            this.$nextTick(async function () {
                this.initialized = false;
                await this.getData();
                this.initialized = true;
            });
        },
        methods: {
            ...mapActions("editor", ["getCountries", "getRecordTypes"]),
            ...mapActions("record", ["fetchRecord"]),
            removeCountry(country){
                this.fields.current.countries = this.fields.current.countries.filter(obj =>
                    obj.label !== country.name && obj.id !== country.id
                );
            },
            async getData(){
                this.loaders.get = true;
                await this.getCountries();
                await this.fetchRecord(this.$route.params.id);
                await this.getRecordTypes();
                this.fields = {
                    initial: JSON.parse(JSON.stringify(this.getSection("generalInformation").data)),
                    current: this.getSection("generalInformation").data
                };
                this.loaders.get = false;
            },
            async saveRecord(redirect){
              this.loaders.post = true;

              // post data
              // process error

              this.loaders.post = false;
              if (redirect){
                console.log("We will redirect you")
              }
              else {
                console.log("We will not redirect")
              }
            }
        }
    }
</script>

<style>
    #editGeneralInformation .v-chip.white--text .v-icon {
        color: white;
        margin-left: 10px;
    }
    .registryList {
        max-width: 780px;
    }

    .tooltips {
        max-width: 500px;
        display: block;
    }

    .v-tooltip__content {
        background: rgba(0, 0, 0, 1);
    }

    .v-subheader {
        text-transform: uppercase;
        font-size: 24px;
        font-weight: bolder;
    }

    .shadowChip {
      box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    }

    #editGeneralInformation .expand-transition-enter-active,
    #editGeneralInformation .expand-transition-leave-active {
      transition-duration: 0.7s !important;
    }

</style>
