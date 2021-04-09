<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-spacer />
      <v-chip
        color="green white--text pr-5 shadowChip"
        @click="showOverlay = true"
      >
        <v-icon
          small
          class="mr-3"
        >
          fa-plus-circle
        </v-icon> Create new user defined tags
      </v-chip>
    </v-row>
    <v-row
      no-gutters
      class="mt-2"
    >
      <v-spacer />
      <v-chip
        color="green white--text pr-5 shadowChip"
      >
        <a
          :href="email"
          class="white--text"
        >
          <v-icon
            small
            class="mr-3"
          >
            fas fa-envelope
          </v-icon> Request new species (email)
        </a>
      </v-chip>
    </v-row>

    <v-row>
      <v-expand-transition>
        <v-overlay
          v-if="showOverlay"
          :dark="false"
          opacity="0.8"
        >
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-card width="700px">
                  <v-card-title class="green white--text">
                    Create new user defined tags
                  </v-card-title>
                  <v-card-text class="pt-5">
                    <v-form
                      id="createTags"
                      ref="createTags"
                      @submit.prevent="addTerm()"
                    >
                      <v-container
                        fluid
                        class="pa-0"
                      >
                        <v-row
                          v-if="error"
                          no-gutters
                        >
                          <v-col cols="12">
                            <v-alert type="error">
                              {{ error }}
                            </v-alert>
                          </v-col>
                        </v-row>
                        <v-row no-gutters>
                          <v-col
                            cols="12"
                            class="mb-5"
                          >
                            <v-text-field
                              v-model="newTerm"
                              label="New tag label"
                              outlined
                              hide-details
                              class="mb-2"
                            />
                            <v-chip
                              class="green white--text pr-6"
                              @click="addTerm()"
                            >
                              <v-icon
                                small
                                class="mr-3"
                              >
                                fa-plus-circle
                              </v-icon>Add term to creation list
                            </v-chip>
                          </v-col>
                          <v-col
                            v-if="newTags.length === 0"
                            cols="12"
                          >
                            No new tags to create
                          </v-col>
                          <v-col
                            v-else
                            cols="12"
                          >
                            Tags to create:
                            <v-chip-group>
                              <v-chip
                                v-for="tag in newTags"
                                :key="'tag_' + tag"
                              >
                                {{ tag }}
                                <v-icon
                                  class="ml-1"
                                  small
                                  @click="removeItem(tag)"
                                >
                                  fa-times-circle
                                </v-icon>
                              </v-chip>
                            </v-chip-group>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      class="success"
                      :disabled="newTags.length === 0"
                      :loading="loading"
                      @click="createTerms()"
                    >
                      Submit new tags
                    </v-btn>
                    <v-btn
                      class="error"
                      @click="showOverlay = false"
                    >
                      Cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-overlay>
      </v-expand-transition>
    </v-row>
  </v-container>
</template>

<script>
    import Vue from "vue"
    import { mapState } from "vuex"

    export default {
        name: "NewTags",
        data(){
            return {
                newTags: [],
                newTerm: null,
                error: false,
                showOverlay: false,
                loading: false
            }
        },
        computed: {
            ...mapState("editor", ["allTags"]),
            ...mapState("record", ["sections"]),
            email(){
              let target = "mailto:contact@fairsharing.org",
                title = "?subject=Request for a new species",
                text = "I would like to make a request for a new species in the FAIRsharing.org database. \n"
                  + `Record id: ${this.$route.params.id} \n`
                  + 'New species name: "ADD_YOUR_SPECIES_HERE" \n \n'
                  + "The FAIRsharing Team";
              let body = encodeURIComponent(text);
              return target + title + "&body=" + body;
            }
        },
        methods: {
            addTerm(){
                this.error = false;
                if (this.newTerm) {
                    let newTags = this.newTags.map(obj => obj.toLowerCase());
                    this.newTerm = this.newTerm.trim().toLowerCase();
                    if (newTags.indexOf(this.newTerm) === -1) {
                        let found = this.allTags.filter(obj => obj.label.toLowerCase() === this.newTerm);
                        if (found.length > 0){
                            this.error = `Term ${this.newTerm} already declared as a ${found[0].model}`
                        }
                        else {
                            Vue.set(this.newTags, this.newTags.length, JSON.parse(JSON.stringify(this.newTerm)));
                            this.newTerm = null;
                        }
                    }
                    else {
                        this.error = `Term ${this.newTerm} is already in creation list`
                    }
                }
            },
            removeItem(name){
                let index = this.newTags.indexOf(name);
                if (index > -1){
                    this.newTags.splice(index, index+1)
                }
            },
            createTerms(){
                this.loading = true;
                for (let term of this.newTags){
                    Vue.set(this.sections.generalInformation.data.userDefinedTags,
                        this.sections.generalInformation.data.userDefinedTags.length,
                        {label: term});
                }
                this.newTags = [];
                this.loading = false;
                this.showOverlay = false;
                this.$scrollTo("#editTags");
            }
        }
    }
</script>
