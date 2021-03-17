<template>
  <v-container
    id="organisationPage"
    fluid
    class="standard grey lighten-3 pb-10"
  >
    <div v-if="error">
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
            xl="2"
            lg="6"
            md="12"
            sm="12"
            xs="12"
            class="pt-0"
            left
          />

          <v-card
            class="d-flex flex-column rounded-0"
            height="100%"
          >
            <v-card-title class="primary white--text py-3">
              General Information
            </v-card-title>

            <!-- TODO: Delete these raw data -->
            <v-card-text class="pt-3 pb-0">
              <v-list>
                <!--
                <v-list-item
                  :key="'organisation_raw'"
                  class="body-1"
                >
                  <v-list-item-content
                    class="py-0 d-block"
                  >
                    <b class="blue--text">Raw data: </b>
                    {{ organisation }}
                  </v-list-item-content>
                </v-list-item>
                -->

                <!-- TODO: Put logo here... -->

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
                        target="_blank"
                      >
                        {{ organisation.homepage }}
                      </a>
                    </span>
                    <span v-else> None </span>
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
                    <span v-else> None </span>
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
                        <a
                          :href="'/organisations/' + parent.id"
                          target="_blank"
                        >
                          {{ parent.name }}
                        </a>
                      </li>
                    </ul>
                  </v-list-item-content>
                </v-list-item>

                <!-- Parent organisations -->
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
                        <a
                          :href="'organisations/' + child.id"
                          target="_blank"
                        >
                          {{ child.name }}
                        </a>
                      </li>
                    </ul>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>

      <v-fade-transition>
        <v-overlay
          v-if="loading"
          :absolute="false"
          opacity="0.8"
        >
          <loaders />
        </v-overlay>
      </v-fade-transition>
    </v-row>
  </v-container>
</template>

<script>
import GraphClient from "@/components/GraphClient/GraphClient.js"
import Loaders from "@/components/Navigation/Loaders";
import NotFound from "@/views/Errors/404"
import getOrganisationQuery from "@/components/GraphClient/queries/Organisations/getOrganisation.json"
import {formatList} from "@/utils/stringUtils"

let graphClient = new GraphClient();

export default {
  name: "Organisation",
  components: { NotFound, Loaders },
  mixins: [formatList],
  data: () => {
    return {
      error: true,
      organisation: {},
      loading: false
    }
  },
  async created() {
    this.loading = true;
    getOrganisationQuery.queryParam.id = parseInt(this.$route.params.id);
    let org = await graphClient.executeQuery(getOrganisationQuery);
    if (org.organisation != null) {
      this.organisation = JSON.parse(JSON.stringify(org.organisation));
      this.error = false;
    }
    this.loading = false;
  }
}
</script>

<style scoped>

</style>