<template>
  <v-container
    id="organisationPage"
    fluid
    class="standard grey lighten-3 pb-10"
  >
    <div v-if="error && !loading">
      <NotFound />
    </div>
    <v-row v-else>
      <v-col cols="12">
        <v-toolbar
          flat
          color="primary"
          dark
          height="55"
        >
          <v-toolbar-title>
            Organisation information for: {{ organisation.name }}
          </v-toolbar-title>
          <v-spacer />
        </v-toolbar>
      </v-col>

      <v-col
        v-if="!loading"
        cols="12"
      >
        <v-container
          fluid
          class="py-0"
        />

        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="6"
          >
            <v-card
              class="d-flex flex-column rounded-0"
              height="100%"
            >
              <v-card-title class="primary white--text py-3">
                General Information
              </v-card-title>

              <v-card-text class="pt-3 pb-0">
                <v-avatar
                  v-if="organisation.urlForLogo"
                  size="144"
                  class="ml-4"
                >
                  <img
                    :src="logoUrl"
                  >
                </v-avatar>

                <v-list>
                  <!-- Homepage -->
                  <v-list-item
                    :key="'organisation_homepage'"
                    class="body-1"
                  >
                    <v-list-item-content
                      class="py-0 d-block"
                    >
                      <b class="blue--text">Homepage: </b>
                      <span v-if="organisation.homepage">
                        <a
                          :href="organisation.homepage"
                        >
                          {{ organisation.homepage }}
                        </a>
                      </span>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- Alternative names -->
                  <v-list-item
                    :key="'organisation_altnames'"
                    class="body-1"
                  >
                    <v-list-item-content
                      class="py-0 d-block"
                    >
                      <b class="blue--text">Alternative Names: </b>
                      <span v-if="organisation.alternativeNames.length > 0">
                        <ul>
                          <li
                            v-for="(name, key) in organisation.alternativeNames"
                            :key="'altname_' + key"
                          >
                            {{ name }}
                          </li>
                        </ul>
                      </span>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item
                    :key="'organisation_types'"
                    class="body-1"
                  >
                    <v-list-item-content
                      class="py-0 d-block"
                    >
                      <b class="blue--text">Types: </b>
                      <span v-if="organisation.types.length > 0">
                        {{ organisation.types | formatList }}
                      </span>
                      <span v-else> None </span>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- Parent organisations -->
                  <v-list-item
                    v-if="organisation.parentOrganisations"
                    :key="'organisation_parents'"
                    class="body-1"
                  >
                    <v-list-item-content
                      class="py-0 d-block"
                    >
                      <b class="blue--text">This organisation belongs to: </b>
                      <ul>
                        <li
                          v-for="(parent, key) in organisation.parentOrganisations"
                          :key="'parent_' + key"
                        >
                          <router-link
                            :to="'/organisations/' + parent.id"
                            class="sub-link"
                            @click.native="$router.go()"
                          >
                            {{ parent.name }}
                          </router-link>
                        </li>
                      </ul>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- Child organisations -->
                  <v-list-item
                    v-if="organisation.childOrganisations"
                    :key="'organisation_children'"
                    class="body-1"
                  >
                    <v-list-item-content
                      class="py-0 d-block"
                    >
                      <b class="blue--text">This organisation controls: </b>
                      <ul>
                        <li
                          v-for="(child, key) in organisation.childOrganisations"
                          :key="'child_' + key"
                        >
                          <router-link
                            :to="'/organisations/' + child.id"
                            @click.native="$router.go()"
                          >
                            {{ child.name }}
                          </router-link>
                        </li>
                      </ul>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- countries -->
                  <v-list-item
                    :key="'organisation_countries'"
                    :v-if="organisation.countries"
                    class="body-1"
                  >
                    <v-list-item-content
                      class="py-0 d-block"
                    >
                      <b class="blue--text">Associated countries: </b>
                      <ul class="pl-0">
                        <li
                          v-for="(country,index) in organisation.countries"
                          :key="country.id+'_'+index"
                          class="d-inline-block"
                        >
                          <p
                            v-if="country.name"
                            style="padding-right: 5px;"
                          >
                            {{ `${country.name}${index!==organisation.countries.length-1 ? ',' : ''}` }}
                          </p>
                          <p
                            v-else
                            class="warning"
                          >
                            country code undefined!
                          </p>
                        </li>
                      </ul>
                    </v-list-item-content>
                  </v-list-item>

                  <!-- RorLink -->
                  <v-list-item
                    :key="'organisation_rorLink'"
                    class="body-1"
                  >
                    <v-list-item-content
                      class="py-0 d-block"
                    >
                      <b class="blue--text">ROR ID: </b>
                      <span v-if="organisation.rorLink">
                        <a
                          :href="organisation.rorLink"
                        >
                          {{ organisation.rorLink }}
                        </a>
                      </span>
                      <span v-else> None </span>
                    </v-list-item-content>
                  </v-list-item>

                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col
            cols="12"
            sm="12"
            md="6"
          >
            <v-card
              class="d-flex flex-column rounded-0 overflow-y-hidden overflow-x-auto"
              height="100%"
            >
              <v-card-title
                class="primary white--text py-3"
                style="min-width: 720px"
              >
                Records related to this organisation
                <!-- filter records on search page -->
                <v-col class="text-right">
                  <v-btn
                    color="white"
                    small
                    @click="filterRecords"
                  >
                    Filter Records
                  </v-btn>
                </v-col>
              </v-card-title>

              <v-data-table
                class="organisationRecordsTable"
                mobile-breakpoint="0"
                :items="organisation.organisationLinks"
                :headers="headers"
                :items-per-page="perPage"
                :footer-props="footer"
                calculate-widths
                style="min-width: 720px"
              >
                <template #[`item.name`]="{ item }">
                  <div class="d-flex justify-start align-center">
                    <v-avatar size="30">
                      <Icon
                        :item="item.fairsharingRecord.type"
                        :height="30"
                        wrapper-class=""
                      />
                    </v-avatar>
                    <div
                      class="mt-1 ml-3 alignLeft text-left"
                      style="max-width: 300px"
                    >
                      {{ item.fairsharingRecord.name | cleanString }}
                    </div>
                  </div>
                </template>

                <template #[`item.status`]="{ item }">
                  <StatusPills
                    class="d-flex justify-center"
                    :status="item.fairsharingRecord.status"
                    :small="true"
                  />
                </template>

                <template #[`item.relation`]="{ item }">
                  <div class="mt-1 ml-3 alignLeft">
                    {{ item.relation | cleanString }}
                  </div>
                </template>

                <template #[`item.grant`]="{ item }">
                  <div
                    v-if="item.grant"
                    class="mt-1 ml-3 alignLeft"
                  >
                    {{ item.grant.name | cleanString }}
                  </div>
                </template>

                <template #[`item.actions`]="{ item }">
                  <v-menu offset-x>
                    <template #activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                      >
                        fas fa-ellipsis-v
                      </v-icon>
                    </template>
                    <v-list>
                      <v-list-item @click="previewRecord(item.fairsharingRecord.id)">
                        <v-list-item-avatar><v-icon>fas fa-eye</v-icon></v-list-item-avatar>
                        <v-list-item-content><v-list-item-title> Preview record </v-list-item-title></v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="goToRecord(item.fairsharingRecord.id)">
                        <v-list-item-avatar><v-icon>fas fa-newspaper</v-icon></v-list-item-avatar>
                        <v-list-item-content><v-list-item-title> Go to record </v-list-item-title></v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        v-if="user().is_curator"
                        @click="goToEdit(item.fairsharingRecord.id)"
                      >
                        <v-list-item-avatar><v-icon>fas fa-pen</v-icon></v-list-item-avatar>
                        <v-list-item-content><v-list-item-title> Edit record </v-list-item-title></v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
              <v-card-text />
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="6"
          >
            <v-card
              class="d-flex flex-column rounded-0"
              height="100%"
            >
              <v-card-title class="primary white--text py-3">
                Users affiliated with this organisation
              </v-card-title>

              <v-data-table
                class="organisationUsersTable"
                :items="organisation.users"
                :headers="userHeaders"
                :items-per-page="perPage"
                :footer-props="footer"
                calculate-widths
              >
                <template #[`item.username`]="{ item }">
                  <router-link
                    :to="'/users/' + item.id"
                  >
                    {{ item.username }}
                  </router-link>
                </template>

                <template #[`item.email`]="{ item }">
                  <a
                    v-if="item.email"
                    :href="'mailto:' + item.email"
                  >
                    {{ item.email }}
                  </a>
                  <span
                    v-if="!item.email"
                  >
                    No email address available.
                  </span>
                </template>

                <template #[`item.orcid`]="{ item }">
                  <a
                    v-if="item.orcid"
                    :href="'https://orcid.org/' + item.orcid"
                    target="_blank"
                  >
                    {{ item.orcid }}
                  </a>
                  <span
                    v-if="!item.orcid"
                  >
                    No ORCID ID supplied.
                  </span>
                </template>

                <template #[`item.twitter`]="{ item }">
                  <a
                    v-if="item.twitter"
                    :href="'https://twitter.com/' + item.twitter"
                    target="_blank"
                  >
                    {{ item.twitter }}
                  </a>
                  <span
                    v-if="!item.twitter"
                  >
                    No Twitter username supplied.
                  </span>
                </template>
              </v-data-table>



              <template slot="no-data">
                <div>
                  This organisation has no affiliated users.
                </div>
              </template>
            </v-card>
          </v-col>
        </v-row>



        <!-- PREVIEW RECORD -->
        <v-dialog v-model="showOverlay">
          <v-btn
            fab
            small
            class="grey--text absolute"
            @click="hideOverlay()"
          >
            <v-icon>fa-times</v-icon>
          </v-btn>

          <v-card>
            <Record :target="targetID" />
          </v-card>
        </v-dialog>

        <v-fade-transition>
          <v-overlay
            v-if="loading"
            :absolute="false"
            opacity="0.8"
          >
            <loaders />
          </v-overlay>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GraphClient from "@/lib/GraphClient/GraphClient.js"
import Icon from "@/components/Icon";
import Loaders from "@/components/Navigation/Loaders";
import NotFound from "@/views/Errors/404"
import Record from "@/views/Records/Record";
import StatusPills from "@/components/Users/Profiles/Private/StatusPills";
import getOrganisationQuery from "@/lib/GraphClient/queries/Organisations/getOrganisation.json"
import { cleanString, formatList } from "@/utils/stringUtils"
import {mapState} from "vuex";

let graphClient = new GraphClient();

export default {
  name: "Organisation",
  components: { NotFound, Icon, Loaders, StatusPills, Record },
  mixins: [cleanString, formatList],
  data: () => {
    return {
      error: true,
      organisation: {},
      loading: false,
      perPage: 10,
      footer: {'items-per-page-options': [10]},
      showOverlay: false,
      targetID: null,
      testEnvironment:false,
      headers: [
        {text: 'Name', value: 'name', align: 'center'},
        {text: 'Status', value: 'status', align: 'center'},
        {text: 'Relation', value: 'relation', align: 'center'},
        {text: 'Grant', value: 'grant', align: 'center'},
        {text: 'Actions', value: 'actions', align: 'center', sortable: false}
      ],
      userHeaders: [
        {text: 'Username', value: 'username', align: 'center'},
        {text: 'Email address', value: 'email', align: 'center'},
        {text: 'ORCID ID', value: 'orcid', align: 'center'},
        {text: 'Twitter', value: 'twitter', align: 'center'},
      ]
    }
  },
  computed: {
    ...mapState('users', ['user']),
    currentRoute() {
      return this.$route.params['id'];
    },
    logoUrl() {
      return process.env.VUE_APP_API_ENDPOINT + this.organisation.urlForLogo;
    }
  },
  watch: {
    async currentRoute() {
      await this.getOrganisation();
    }
  },
  async created() {
    await this.getOrganisation();
  },
  methods: {
    async getOrganisation() {
      try {
        // testEnvironment variable is only for test case.
        if(this.testEnvironment) throw new Error("an error occurred while fetching data")
        this.loading = true;
        getOrganisationQuery.queryParam.id = parseInt(this.$route.params.id);
        let org = await graphClient.executeQuery(getOrganisationQuery);
        if (org.organisation != null) {
          this.organisation = JSON.parse(JSON.stringify(org.organisation));
          this.error = false;
        }
        this.loading = false;
      }
      catch (e) {
        this.errors = e.message;
      }
    },
    goToEdit(id){
      this.$router.push({path: `/${id}/edit`})
    },
    previewRecord(id) {
      this.targetID = id;
      this.showOverlay = true;
    },
    goToRecord(id) {
      window.open("/" + id, '_blank');
    },
    hideOverlay() {
      this.showOverlay = false;
      this.targetID = null;
    },
    filterRecords() {
      const params = {organisations: encodeURIComponent(this.organisation.name.toLowerCase()) }
      this.$router.push({
        name: 'search',
        query: params
      });
    }
  }
}
</script>

<style scoped>
.card-class {
  min-width: 500px;
  overflow-x: scroll;
  overflow-y: hidden;
}
</style>
