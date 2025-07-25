<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editGeneralInformation"
    ref="editGeneralInformation"
    v-model="formValid"
  >
    <v-card
      v-if="initialized"
      class="delayed-transition"
    >
      <v-card-title class="grey lighten-4 blue--text">
        Edit General Information
      </v-card-title>

      <Alerts target="generalInformation" />

      <v-card-text>
        <v-container fluid>
          <base-fields
            @imageTooBig="imageTooBig = $event"
          />
          <v-row>
            <!-- edit maintainers -->
            <v-col
              v-if="user().is_super_curator"
              cols="12"
            >
              <Maintainers />
            </v-col>
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
          :disabled="!formValid || imageTooBig"
          :loading="loading"
          @click="checkTypeChange(false)"
        >
          Save and continue
        </v-btn>
        <v-btn
          :disabled="!formValid || imageTooBig"
          :loading="loading"
          class="primary"
          @click="checkTypeChange(true)"
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
        <loaders />
      </v-overlay>
    </v-fade-transition>
    <v-dialog
      v-model="showTypeChanged"
      max-width="700px"
      persistent
    >
      <v-card>
        <v-card-title
          class="headline"
        >
          Record type has changed!
        </v-card-title>
        <v-card-text>
          <p>
            Are you sure you want to change this record from
            a <b>{{ formatType(initialFields.type) }}</b>&nbsp;to a&nbsp;
            <b>{{ formatType(currentFields.type) }}?</b>
          </p>
          <p>
            Any metadata specific to&nbsp;<b>{{ formatType(initialFields.type) }}</b>&nbsp;will be deleted.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            persistent
            @click="closeTypeChanged()"
          >
            Cancel
          </v-btn>
          <v-btn
            color="orange darken-1"
            text
            persistent
            @click="submitWithChangedType()"
          >
            Confirm Change
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
    import { mapActions, mapGetters, mapMutations,mapState } from "vuex"

    import Loaders from "@/components/Navigation/Loaders";

    import Alerts from "../Alerts";
    import BaseFields from "./BaseFields";
    import Contact from "./Contact";
    import EditTags from "./EditTags";
    import Maintainers from "./Maintainers";

    const diff = require("deep-object-diff").diff;

    export default {
        name: "GeneralInformation",
        components: {Alerts, Loaders, BaseFields, EditTags, Contact, Maintainers },
        data(){
            return {
                initialized: false,
                formValid: false,
                loading: false,
                showTypeChanged: false,
                redirect: false,
                imageTooBig: false
            }
        },
        computed: {
            ...mapGetters("record", ["getSection", "getChanges"]),
            ...mapState("users", ["user"]),
            section(){
              return this.getSection('generalInformation');
            },
            initialFields(){
              return this.getSection("generalInformation").initialData
            },
            currentFields(){
              return this.getSection("generalInformation").data
            },
            message(){
              let error = this.getSection("generalInformation").error;
              return {
                error: error,
                value: this.getSection("generalInformation").message,
                type: function(){if (error){return "error"} else {return "success"}}
              };
            }
        },
        watch: {
            currentFields: {
                deep: true,
                handler(newVal){
                    let changes = 0;
                    if (this.initialized){
                        if (newVal.status !== "deprecated"){
                          this.currentFields.deprecation_reason = null;
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
            ...mapActions("record", ["updateGeneralInformation"]),
            ...mapMutations("record", ["setSectionError"]),
            async getData(){
                await this.getCountries();
                await this.getRecordTypes();
                await this.getTags();
            },
            async checkTypeChange(redirect) {
              let _module = this;
              let initialType = this.formatType(_module.initialFields.type);
              let currentType = this.formatType(_module.currentFields.type);

              if (currentType === initialType) {
                await _module.saveRecord(redirect, false);
              }
              else {
                // Deal with the confirmation dialogue.
                _module.showTypeChanged = true;
                _module.redirect = redirect;
              }

            },
            closeTypeChanged() {
              this.showTypeChanged = false;
            },
            async submitWithChangedType() {
              this.showTypeChanged = false;
              await this.saveRecord(this.redirect, true);
            },
            formatType(type) {
              if (type.name === undefined) {
                return type;
              }
              return type.name;
            },
            async saveRecord(redirect, change){
              this.loading = true;
              // Non-deprecated records will need their deprecation reason to be cleared.
              if (this.currentFields.status !== 'deprecated') {
                this.currentFields.metadata.deprecation_reason = null;
              }
              await this.updateGeneralInformation({
                token: this.user().credentials.token,
                id: this.$route.params.id,
                change: change
              });
              this.loading = false;
              if (!redirect) this.$scrollTo("#mainHeader");
              if (redirect && !this.message.error) {
                await this.$router.push({path: '/' + this.$route.params.id})
              }
            }
        }
    }
</script>

<style scoped>
    #editGeneralInformation .v-chip.white--text .v-icon {
        color: white;
        margin-left: 10px;
    }

    .v-subheader {
        text-transform: uppercase;
        font-size: 24px;
        font-weight: bolder;
    }

    .shadowChip {
      box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    }

</style>
