<template>
  <div>
    <v-data-table
      class="userProfileViewAwards"
      :items="awards"
      :headers="headers"
      :items-per-page="perPage"
      :footer-props="footer"
      calculate-widths
    >
      <template #[`item.role`]="{ item }">
        {{ item.role }}
      </template>
      <template #[`item.start_date`]="{ item }">
        {{ item.start_date }}
      </template>
      <template #[`item.end_date`]="{ item }">
        {{ item.end_date }}
      </template>
    </v-data-table>
  </div>
</template>

<script>

export default {
  name: "ViewAwards",
  props: {
    awards: { type: Array, default: null }
  },
  computed: {
    headers() {
      let headers = [
        {text: 'Role', value: 'role', align: 'center'},
        {text: 'Start Date', value: 'start_date', align: 'center'},
        {text: 'End Date', value: 'end_date', align: 'center'},
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
}

</script>

<style scoped>

</style>