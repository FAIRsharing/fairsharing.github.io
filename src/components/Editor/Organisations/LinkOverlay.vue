<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="mr-2">
    <v-btn
      v-if="showButton"
      icon
      class="green white--text"
      @click="showHideMenu()"
    >
      <v-icon small>
        fa-pen
      </v-icon>
    </v-btn>
    <v-fade-transition>
      <v-overlay
        v-if="!initialized && showMenu"
        :absolute="false"
        opacity="0.8"
      >
        <loaders />
      </v-overlay>
    </v-fade-transition>
    <v-expand-transition>
      <v-overlay
        v-if="initialized && showMenu"
        :dark="false"
        :absolute="false"
        opacity="0.8"
      >
        <v-card
          key="edit"
          class="flexCard grey lighten-3 black--text"
          height="100%"
          width="1000px"
        >
          <v-card-title class="green white--text">
            Edit relationship with an organisation
          </v-card-title>
          <v-card-text class="pt-4 mt-2">
            <v-autocomplete
              v-model="recordOrganisationLink.organisation"
              :items="organisations"
              item-text="name"
              item-value="id"
              outlined
              return-object
              label="Select an organisation"
            >
              <template slot="no-data">
                <v-container>
                  <v-row>
                    <v-row justify="center">
                      <div>No organisation found.</div>
                    </v-row>
                  </v-row>
                  <v-row justify="center">
                    <v-btn class="green white--text my-3">
                      Create a new organisation
                    </v-btn>
                  </v-row>
                </v-container>
              </template>
              <template v-slot:selection="data">
                <v-chip class="blue white--text px-3 py-1">
                  {{ data.item.name }}
                </v-chip>
              </template>
              <template v-slot:item="data">
                <v-list-item-avatar>
                  <img
                    v-if="data.item['urlForLogo']"
                    :src="'https://api.fairsharing.org' + data.item['urlForLogo']"
                  >
                  <v-icon v-else>
                    fas fa-sitemap
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="mb-2">
                  <v-list-item-title> {{ data.item.name }} </v-list-item-title>
                  <v-list-item-subtitle> {{ data.item.homepage }} </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="data.item.types.length > 0">
                    Types: {{ data.item.types.join(", ") }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="data.item['alternativeNames'].length > 0">
                    Alternative names: {{ data.item['alternativeNames'].join(", ") }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-autocomplete
              v-model="recordOrganisationLink.relation"
              :items="organisationsRelations"
              outlined
              label="Select a type of relationship"
            >
              <template v-slot:selection="data">
                <v-chip class="blue white--text px-3 py-1">
                  {{ data.item }}
                </v-chip>
              </template>
              <template v-slot:item="data">
                <v-list-item-content style="width:100%;height:100%">
                  {{ data.item }}
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-autocomplete
              v-model="recordOrganisationLink.grant"
              :items="grants"
              item-text="name"
              item-value="id"
              outlined
              return-object
              label="Select an optional grant for funding organisations"
              :disabled="recordOrganisationLink.relation !== 'funds'"
            >
              <template slot="no-data">
                <v-container>
                  <v-row>
                    <v-row justify="center">
                      <div>No grant found.</div>
                    </v-row>
                  </v-row>
                  <v-row justify="center">
                    <v-btn class="green white--text my-3">
                      Create a new grant
                    </v-btn>
                  </v-row>
                </v-container>
              </template>
              <template v-slot:selection="data">
                <v-chip class="blue white--text px-3 py-1">
                  {{ data.item.name }}
                </v-chip>
              </template>
              <template v-slot:item="data">
                <div>
                  <v-list-item class="px-0 py-3">
                    <v-list-item-avatar>
                      <v-icon>fas fa-funnel-dollar</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content class="py-0">
                      <v-list-item-title> {{ data.item.name }} </v-list-item-title>
                      <v-list-item-subtitle> {{ data.item.description }} </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </div>
              </template>
            </v-autocomplete>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="success"
              @click="saveRelation()"
            >
              Save
            </v-btn>
            <v-btn
              class="error"
              @click="showHideMenu()"
            >
              Cancel
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
    </v-expand-transition>
  </div>
</template>

<script>
    import Vue from 'vue'
    import { mapState, mapActions } from "vuex"
    import Loaders from "../../Navigation/Loaders";

    export default {
      name: "LinkOverlay",
      components: {Loaders},
      props: {
        id: { default: null, type: Number },
        showButton: {default: true, type: Boolean}
      },
      data(){
        return {
          showMenu: false,
          initialized: false,
          recordOrganisationLink: null
        }
      },
      computed: {
        ...mapState("editor", ["organisations", "organisationsTypes", "grants", "organisationsRelations"]),
        ...mapState("record", ["sections"])
      },
      mounted() {
        this.$nextTick(async function () {
          this.recordOrganisationLink = JSON.parse(JSON.stringify(this.sections["organisations"].data[this.id]));
          if (!this.recordOrganisationLink.id) {
            await this.showHideMenu()
          }
        })
      },
      methods: {
        ...mapActions("editor", ["getOrganisations", "getOrganisationsTypes", "getGrants"]),
        async showHideMenu(){
          this.showMenu = !this.showMenu;
          if (!this.organisations){
              this.initialized = false;
              await Promise.all([
                this.getOrganisationsTypes(),
                this.getOrganisations(),
                this.getGrants()
              ]);
          }
          this.initialized = true;
          if (!this.showMenu && !this.recordOrganisationLink.organisation.name) {
            this.sections["organisations"].data.splice(this.id, 1);
          }
        },
        saveRelation(){
          Vue.set(this.sections["organisations"].data, this.id, this.recordOrganisationLink);
          this.showHideMenu();
        }
      }
    }
</script>

<style>
  #editOrganisations .expand-transition-enter-active,
  #editOrganisations .expand-transition-leave-active {
    transition-duration: 0.7s !important;
  }

  .v-menu__content {
    max-width: 300px;
  }
</style>
