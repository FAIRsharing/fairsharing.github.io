<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editGeneralInformation"
    ref="editGeneralInformation"
    v-model="formValid"
  >
    <v-card v-if="initialized">
      <v-card-title class="grey lighten-4 blue--text">
        Edit General Information
        <span
          v-if="getChanges['generalInformation']"
          class="orange--text ml-2"
        >({{ getChanges['generalInformation'] }})</span>
      </v-card-title>
      <v-card-text>
        <v-container fluid>
          <base-fields />
          <v-row>
            <!-- contact points -->
            <v-col cols="12">
              <Contact />
            </v-col>

            <!-- divider -->
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
          :disabled="!formValid"
          @click="saveRecord(true)"
        >
          Save and continue
        </v-btn>
        <v-btn
          :disabled="!formValid"
          class="primary"
          @click="saveRecord(false)"
        >
          Save and exit
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-fade-transition>
      <v-overlay
        v-if="!initialized"
        :absolute="false"
        opacity="0.8"
      >
        <v-progress-circular
          indeterminate
          size="64"
        />
      </v-overlay>
    </v-fade-transition>
  </v-form>
</template>

<script>
    import { mapGetters, mapActions } from "vuex"
    import Contact from "./Contact";
    import EditTags from "./EditTags";
    import BaseFields from "./BaseFields";

    const diff = require("deep-object-diff").diff;

    export default {
        name: "GeneralInformation",
        components: { BaseFields, EditTags, Contact },
        data(){
            return {
                initialized: false,
                formValid: false,
                databaseWarning: false,
            }
        },
        computed: {
            ...mapGetters("record", ["getSection", "getChanges"]),
            section(){
              return this.getSection('generalInformation');
            },
            initialFields(){
              return this.getSection("generalInformation").initialData
            },
            currentFields(){
              return this.getSection("generalInformation").data
            }
        },
        watch: {
            currentFields: {
                deep: true,
                handler(newVal){
                    let changes = 0;
                    if (this.initialized){
                        if (newVal.type === "collection" || newVal.type.name === "collection"){
                            this.currentFields.status = null;
                        }
                        else if (newVal.type.name === "repository" || newVal.type.name === "knowledge_base"){
                          this.databaseWarning = true;
                        }
                        if (newVal.status !== "deprecated"){
                          this.currentFields.deprecation_reason = "";
                        }
                        const differences = diff(newVal, this.initialFields);
                        Object.keys(differences).forEach(difference => {
                            if (differences[difference] || differences[difference] === "") {
                              if (difference === "type") {
                                if (newVal.type.name !== this.initialFields.type) changes += 1;
                              }
                              else if (difference !== "metadata") {
                                const exceptions = ["domains", "subjects", "taxonomies", "userDefinedTags"];
                                if (exceptions.indexOf(difference) === -1) changes += 1;
                                else {
                                    const initArray = this.initialFields[difference].map(obj => obj.id);
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
            ...mapActions("editor", ["getCountries", "getRecordTypes", "getTags"]),
            async getData(){
                await this.getCountries();
                await this.getRecordTypes();
                await this.getTags();
            },
            /** TODO: build this method to save and redirect**/
            async saveRecord(redirect){
              console.log(this.getSection("generalInformation").data);
              return redirect;
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
