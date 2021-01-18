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
            <Alerts target="organisations" />
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
                        <v-btn
                          icon
                          class="green white--text"
                          @click="showEditOverlay(linkIndex)"
                        >
                          <v-icon small>
                            fa-pen
                          </v-icon>
                        </v-btn>
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
                  </v-col>
                  <v-col
                    cols="12"
                    class="col-lg-6 col-xl-3"
                  >
                    <v-card
                      height="100%"
                      class="newRel green--text"
                      style="cursor: pointer"
                      min-height="190px"
                      @click="showEditOverlay(null)"
                    >
                      <div class="mb-4">
                        <v-icon
                          x-large
                          class="green--text icon--xxl"
                        >
                          fa-plus-circle
                        </v-icon>
                      </div>
                      <div class="text-h4 text-center">
                        Add a new relationship
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="info"
                :loading="saving"
                @click="saveRecord(false)"
              >
                Save and continue
              </v-btn>
              <v-btn
                class="info"
                :loading="saving"
                @click="saveRecord(true)"
              >
                Save and exit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <LinkOverlay />
    <v-fade-transition>
      <v-overlay
        v-if="loading"
        :absolute="false"
        opacity="0.8"
      >
        <loaders />
      </v-overlay>
    </v-fade-transition>
  </v-form>
</template>

<script>
    import { mapState, mapActions, mapGetters } from "vuex"
    import Loaders from "../../Navigation/Loaders";
    import LinkOverlay from "./LinkOverlay";
    import { isEqual } from "lodash"
    import Alerts from "../Alerts";

    export default {
        name: "EditOrganisations",
        components: {Alerts, LinkOverlay, Loaders},
        data(){
            return {
                formValid: false,
                showOverlay: false,
                initialized: false,
                loading: false,
                saving: false,
                data: {}
            }
        },
        computed: {
          ...mapState("record", ["sections"]),
          ...mapState("users", ["user"]),
          organisationLinks() {
            return this.sections["organisations"].data;
          }
        },
        watch: {
          organisationLinks: {
            deep: true,
            handler() {
              let changes = 0;
              this.sections["organisations"].initialData.forEach((link) => {
                let found = this.organisationLinks.filter(obj => obj.id === link.id)[0];
                if (!found){
                  changes += 1;
                }
                else if (!isEqual(link, found)){
                    changes += 1;
                }
              });
              this.organisationLinks.forEach((link) => {
                if (!link.id){
                  changes += 1;
                }
              });
              this.$store.commit("record/setChanges", {
                section: "organisations",
                value: changes
              })
            }
          }
        },
        methods: {
          ...mapActions("editor", ["getOrganisations", "getOrganisationsTypes", "getGrants"]),
          ...mapActions("record", ["updateOrganisations"]),
          ...mapGetters("record", ["getSection"]),
          removeRelation(id){
            this.organisationLinks.splice(id, 1);
          },
          async showEditOverlay(id){
            if (!this.initialized){
              this.loading = true;
              await Promise.all([
                this.getOrganisationsTypes(),
                this.getOrganisations(),
                this.getGrants()
              ]);
              this.loading = false;
              this.initialized = true;
            }
            let editObject = {
              showOverlay: true,
              data: (this.organisationLinks[id]) ? JSON.parse(JSON.stringify(this.organisationLinks[id])) : {}
            };
            if (id !== null) editObject.id = id;
            this.$store.commit("record/setEditOrganisationLink", editObject);
          },
          async saveRecord(redirect){
            this.saving = true;
            await this.updateOrganisations(this.user().credentials.token);
            this.saving = false;
            if (!redirect) this.$scrollTo("#mainHeader");
            else if (redirect && !this.getSection("organisations").error){
              await this.$router.push({path: '/' + this.$route.params.id})
            }
          }
        },
    }
</script>

<style>
    .flexCard {
        display:flex;
        flex-direction: column;
    }

    #editOrganisations .expand-transition-enter-active,
    #editOrganisations .expand-transition-leave-active {
      transition-duration: 0.7s !important;
    }

    .newRel {
      justify-content: center;
      align-items: center;
      display:flex;
      flex-direction: column;
    }
</style>
