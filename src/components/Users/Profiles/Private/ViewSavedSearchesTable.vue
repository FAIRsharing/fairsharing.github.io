<template>
  <div>
    <v-data-table
      class="userProfileSavedSearches"
      :items="combinedSearches"
      :headers="headers"
      :items-per-page="perPage"
      :footer-props="footer"
      calculate-widths
      :sort-desc.sync="sort_desc"
    >
      <template #[`item.creator`]="{ item }">
        <a :href="`/users/${item.creator['id']}`"
          >{{ item.creator["username"] }}
        </a>
      </template>
      <template #[`item.date`]="{ item }">
        {{ item.createdAt.split("T", 1)[0] }}
      </template>
      <template #[`item.name`]="{ item }">
        {{ item.name }}
      </template>
      <template #[`item.comments`]="{ item }">
        {{ item.comments }}
      </template>
      <template #[`item.link`]="{ item }">
        <a :href="item.url">Link</a>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "ViewSavedSearchesTable",
  props: {
    createdSearches: { type: Array, default: null },
    savedSearches: { type: Array, default: null },
  },
  data: () => {
    return {
      sort_desc: true,
    };
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
    combinedSearches() {
      let mergedSearches = [];
      mergedSearches = this.createdSearches.concat(this.savedSearches);
      let mapSearches = new Map();
      for (const search of mergedSearches) {
        mapSearches.set(search.id, search);
      }
      //Reversed array to show latest entry first
      return [...mapSearches.values()].toReversed();
    },
  },
};
</script>

<style scoped></style>
