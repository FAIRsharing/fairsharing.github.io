<template>
  <v-container class="my-10">
    <v-card>
      <v-card-title>
        Organisations List
        <v-spacer />
        <v-text-field
          v-model="search"
          append-inner-icon="fas fa-search"
          clearable
          color="primary"
          hide-details
          label="Search"
          single-line
          variant="outlined"
        />
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="organisations"
        :loading="loading"
        :search="search"
        loading-text="Loading... Please wait"
        mobile-breakpoint="md"
      >
        <template #[`item.name`]="{ item }">
          <router-link :to="`/organisations/${item.id}`">
            {{ item.name }}
          </router-link>
        </template>
        <template #[`item.types`]="{ item }">
          {{ item.types.join(", ") }}
        </template>
        <template #[`item.homepage`]="{ item }">
          <a :href="item.homepage" class="underline-effect" target="_blank">
            {{ item.homepage }}
          </a>
        </template>
        <template #[`item.rorLink`]="{ item }">
          <a :href="item.rorLink" class="underline-effect" target="_blank">
            {{ item.rorLink }}
          </a>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getAllOrganisationsQuery from "@/lib/GraphClient/queries/getAllOrganisations.json";

let graphClient = new GraphClient();
export default {
  name: "OrganisationsList",

  data() {
    return {
      search: "",
      headers: [
        {
          title: "Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { title: "Types", value: "types", sortable: false },
        { title: "Homepage", value: "homepage", sortable: false },
        { title: "ROR", value: "rorLink", sortable: false },
      ],
      loading: false,
      organisations: [],
    };
  },

  async mounted() {
    this.loading = true;
    await this.getOrganisationsList();
    this.loading = false;
  },

  methods: {
    async getOrganisationsList() {
      const organisationsList = await graphClient.executeQuery(
        getAllOrganisationsQuery,
      );

      this.organisations = organisationsList.allOrganisations;
    },
  },
};
</script>

<style scoped>
:deep(.v-data-table-headers--mobile) {
  display: none;
}
</style>
