<template>
  <div>
    <v-data-table
      class="userProfileOrganistionsTable"
      :items="organisations"
      :headers="headers"
      :items-per-page="perPage"
      :footer-props="footer"
      calculate-widths
    >
      <template #[`item.name`]="{ item }">
        <router-link
          :to="'/organisations/' + item.id"
        >
          {{ item.name }}
        </router-link>
      </template>

      <template #[`item.homepage`]="{ item }">
        <a
          :href="item.homepage"
          target="_blank"
        >
          {{ item.homepage }}
        </a>
      </template>

      <template #[`item.organisationTypes`]="{ item }">
        {{ objToList(item.organisationTypes) }}
      </template>

      <template slot="no-data">
        <div>
          You are not a member of any organisations.
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "OrganisationsTable",
  props: {
    organisations: { type: Array, default: null }
  },
  computed: {
    ...mapState('users', ['user']),
    headers() {
      let headers = [
        {text: 'Name', value: 'name', align: 'center'},
        {text: 'Types', value: 'organisationTypes', align: 'center'},
        {text: 'Homepage', value: 'homepage', align: 'center'},
      ];
      return headers;
    },
    perPage(){
      return 5;
    },
    footer(){
      return {'items-per-page-options': [5]}
    }
  },
  methods: {
    objToList(obj) {
      let names = [];
      obj.forEach((t) => {
        names.push(t.name)
      })
      return names.join(", ");
    }
  },
}
</script>

<style scoped>

</style>