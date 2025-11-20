<template>
  <v-form id="editOrganisations" ref="editOrganisations" v-model="formValid">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12" class="pa-0">
          <v-card>
            <v-card-title class="bg-grey-lighten-4 text-blue">
              Edit Organisations & Grants
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
                    lg="6"
                    xl="3"
                  >
                    <v-card
                      v-if="link.organisation.name"
                      key="view"
                      :class="[
                        'flexCard',
                        {
                          'bg-grey-lighten-3': !link.isLead,
                          'bg-green-lighten-3': link.isLead,
                        },
                      ]"
                      height="100%"
                    >
                      <v-card-text class="py-1" style="flex-grow: 1">
                        <v-list
                          class="px-0"
                          :class="[
                            'px-0',
                            {
                              'bg-grey-lighten-3': !link.isLead,
                              'bg-green-lighten-3': link.isLead,
                            },
                          ]"
                        >
                          <v-list-item class="px-0">
                            <v-list-item-title class="font-weight-bold">
                              {{ link.organisation.name }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              {{ link.organisation.homepage }}
                            </v-list-item-subtitle>
                            <v-list-item-subtitle
                              v-if="link.organisation.types"
                            >
                              Types: {{ link.organisation.types.join(", ") }}
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="link.relation">
                              <span class="text-decoration-underline"
                                >Relation:</span
                              >
                              {{ link.relation }}
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="link.grant">
                              <span class="text-decoration-underline"
                                >Grant:</span
                              >
                              {{ link.grant.name }}
                            </v-list-item-subtitle>
                          </v-list-item>
                        </v-list>
                        <v-switch
                          v-if="link.relation === 'maintains'"
                          v-model="link.isLead"
                          color="green"
                          label="Lead organisation?"
                        />
                      </v-card-text>
                      <v-card-actions style="border-top: 1px solid #ccc">
                        <v-spacer />
                        <v-btn
                          icon
                          class="bg-green text-white"
                          @click="showEditOverlay(linkIndex)"
                        >
                          <v-icon size="small"> fas fa-pen </v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          class="bg-red text-white"
                          @click="removeRelation(linkIndex)"
                        >
                          <v-icon size="small"> fas fa-trash </v-icon>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                  <v-col cols="12" lg="6" xl="3">
                    <v-card
                      height="100%"
                      class="newRel text-green"
                      style="cursor: pointer"
                      min-height="190px"
                      @click="showEditOverlay(null)"
                    >
                      <v-icon size="40" class="text-green mb-4">
                        fas fa-plus-circle
                      </v-icon>

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
                class="bg-primary"
                :loading="continueLoader"
                variant="elevated"
                @click="saveRecord(false, $event.target)"
              >
                Save and continue
              </v-btn>
              <v-btn
                class="bg-primary"
                :loading="exitLoader"
                variant="elevated"
                @click="saveRecord(true, $event.target)"
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
      <div>
        <v-overlay
          v-model="loading"
          :absolute="false"
          opacity="0.8"
          class="align-center justify-center"
        >
          <loaders />
        </v-overlay>
      </div>
    </v-fade-transition>
  </v-form>
</template>

<script>
import { isEqual } from "lodash";
import { mapActions, mapGetters, mapState } from "vuex";

import Loaders from "../../Navigation/Loaders";
import Alerts from "../Alerts";
import LinkOverlay from "./LinkOverlay";

export default {
  name: "Organisations",
  components: { Alerts, LinkOverlay, Loaders },
  data() {
    return {
      formValid: false,
      showOverlay: false,
      initialized: false,
      loading: false,
      data: {},
      exitLoader: false,
      continueLoader: false,
    };
  },
  computed: {
    ...mapState("record", ["sections"]),
    ...mapState("users", ["user"]),
    organisationLinks() {
      return this.sections["organisations"].data;
    },
  },
  watch: {
    organisationLinks: {
      deep: true,
      handler() {
        let changes = 0;
        this.sections["organisations"].initialData.forEach((link) => {
          let found = this.organisationLinks.filter(
            (obj) => obj.id === link.id,
          )[0];
          if (!found) {
            changes += 1;
          } else if (!isEqual(link, found)) {
            changes += 1;
          }
        });
        this.organisationLinks.forEach((link) => {
          if (!link.id) {
            changes += 1;
          }
        });
        this.$store.commit("record/setChanges", {
          section: "organisations",
          value: changes,
        });
      },
    },
  },
  methods: {
    ...mapActions("editor", [
      "getOrganisations",
      "getOrganisationsTypes",
      "getGrants",
    ]),
    ...mapActions("record", ["updateOrganisations"]),
    ...mapGetters("record", ["getSection"]),
    removeRelation(id) {
      this.organisationLinks.splice(id, 1);
    },
    async showEditOverlay(id) {
      if (!this.initialized) {
        this.loading = true;
        await Promise.all([
          this.getOrganisationsTypes(),
          this.getOrganisations(),
          this.getGrants(),
        ]);
        this.loading = false;
        this.initialized = true;
      }
      let editObject = {
        showOverlay: true,
        data: this.organisationLinks[id]
          ? JSON.parse(JSON.stringify(this.organisationLinks[id]))
          : {},
      };
      if (id !== null) editObject.id = id;
      this.$store.commit("record/setEditOrganisationLink", editObject);
    },
    async saveRecord(redirect, item) {
      if (item.textContent.trim() === "Save and continue") {
        this.continueLoader = true;
        this.exitLoader = false;
      } else if (item.textContent.trim() === "Save and exit") {
        this.continueLoader = false;
        this.exitLoader = true;
      }
      await this.updateOrganisations(this.user().credentials.token);
      this.continueLoader = false;
      this.exitLoader = false;
      if (!redirect) this.$scrollTo("#mainHeader");
      else if (redirect && !this.getSection("organisations").error) {
        await this.$router.push({ path: "/" + this.$route.params.id });
      }
    },
  },
};
</script>

<style scoped>
.flexCard {
  display: flex;
  flex-direction: column;
}

#editOrganisations .expand-transition-enter-active,
#editOrganisations .expand-transition-leave-active {
  transition-duration: 0.7s !important;
}

.newRel {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}
</style>
