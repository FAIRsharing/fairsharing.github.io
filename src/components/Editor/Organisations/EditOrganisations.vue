<template>
  <v-form
    id="editOrganisations"
    ref="editOrganisations"
    v-model="formValid"
  >
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="grey lighten-4 blue--text">
              Edit Organisations and Grants
            </v-card-title>
            <v-card-text class="pt-3 mb-0">
              <v-container fluid>
                <v-row>
                  <v-col cols="12 py-0 mb-2">
                    Record's current organisations:
                  </v-col>
                  <v-col
                    v-for="(link, linkIndex) in organisationLinks"
                    :key="'orgaLink_' + linkIndex"
                    cols="12"
                    class="col-lg-6 col-xl-3"
                    transition="scroll-x"
                  >
                    <v-card
                      v-if="link.organisation.name"
                      key="view"
                      class="flexCard grey lighten-3"
                      height="100%"
                    >
                      <v-card-text
                        class="py-1"
                        style="flex-grow: 1"
                      >
                        <v-list class="grey lighten-3 px-0">
                          <v-list-item class="px-0">
                            <v-list-item-avatar
                              v-if="link.organisation.name"
                              class="mr-5"
                            >
                              <img
                                v-if="link.organisation.urlForLogo"
                                :src="'https://api.fairsharing.org/' + link.organisation.urlForLogo"
                                alt="organisation logo"
                              >
                              <v-icon v-else>
                                fas fa-sitemap
                              </v-icon>
                            </v-list-item-avatar>
                            <v-list-item-content class="mb-0 pb-0">
                              <v-list-item-title class="font-weight-bold">
                                {{ link.organisation.name }}
                              </v-list-item-title>
                              <v-list-item-subtitle> {{ link.organisation.homepage }} </v-list-item-subtitle>
                              <v-list-item-subtitle v-if="link.organisation.types">
                                Types: {{ link.organisation.types.join(", ") }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item class="px-0">
                            <v-list-item-content class="mb-0 pb-0">
                              <v-list-item-subtitle v-if="link.relation">
                                <span class="text-decoration-underline">Relation:</span>
                                {{ link.relation }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle v-if="link.grant">
                                <span class="text-decoration-underline">Grant:</span>
                                {{ link.grant.name }}
                              </v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                      <v-card-actions style="border-top: 1px solid #ccc">
                        <v-spacer />
                        <link-overlay :id="linkIndex" />
                        <v-btn
                          icon
                          class="red white--text"
                          @click="removeRelation(linkIndex)"
                        >
                          <v-icon small>
                            fa-trash
                          </v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                    <link-overlay
                      v-else
                      :id="linkIndex"
                      :show-button="false"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    class="col-lg-6 col-xl-3"
                  >
                    <v-card
                      class="flexCard"
                      height="100%"
                      @click="createNewRelation()"
                    >
                      Create a new organisation link
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
    import Vue from "vue"
    import { mapState, mapGetters } from "vuex"
    import LinkOverlay from "./LinkOverlay";

    export default {
        name: "EditOrganisations",
        components: {LinkOverlay},
        filters: {
          cleanArray(array){
            return array.map(obj => obj.organisation.name);
          }
        },
        data(){
            return {
                editID: null,
                formValid: false
            }
        },
        computed: {
            ...mapGetters("record", ["getSection"]),
            ...mapState("users", ["user"]),
            organisationLinks(){
                return this.getSection("organisations").data;
            }
        },
        methods: {
          createNewRelation(){
            Vue.set(this.organisationLinks, this.organisationLinks.length, {organisation: {}})
          },
          removeRelation(id){
            this.organisationLinks.splice(id, 1);
          }
        }
    }
</script>

<style>
    .flexCard {
        display:flex;
        flex-direction: column;
    }

    #editOrganisations .scroll-x-transition-enter-active,
    #editOrganisations .scroll-x-transition-leave-active {
      transition-duration: 0.7s !important;
    }


</style>
