<template>
  <div>
    <v-data-table
      class="userProfileSavedSearches"
      :items="searches"
      :headers="headers"
      :items-per-page="perPage"
      :footer-props="footer"
      calculate-widths
    >
      <template #[`item.creator`]="{ item }">
        {{ item.creator }}
      </template>
      <template #[`item.date`]="{ item }">
        {{ item.date }}
      </template>
      <template #[`item.name`]="{ item }">
        {{ item.name }}
      </template>
      <template #[`item.comments`]="{ item }">
        {{ item.comments }}
      </template>
      <template #[`item.link`]="{ item }">
        {{ item.link }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "ViewSavedSearchesTable",
  props: {
    searches: { type: Array, default: null },
  },
  computed: {
    headers() {
      let headers = [
        { text: "Creator", value: "creator", align: "center" },
        { text: "Date", value: "date", align: "center" },
        { text: "Name", value: "name", align: "center" },
        { text: "Comments", value: "comments", align: "center" },
        { text: "Link", value: "link", align: "center" },
      ];
      return headers;
    },
    perPage() {
      return 5;
    },
    footer() {
      return { "items-per-page-options": [5] };
    },
  },
};
</script>

<style scoped></style>
