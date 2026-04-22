<template>
  <div
    :class="{ 'flex-column': $vuetify.display.smAndDown }"
    class="d-flex full-width py-2 px-5 justify-center"
  >
    <v-btn
      :class="$vuetify.display.smAndDown ? 'full-width' : 'mx-2 button-width'"
      color="accent"
      elevation="2"
      @click="editAdvancedSearch()"
    >
      <v-icon class="mr-1" size="small"> fas fa-solid fa-pen</v-icon>
      <span :class="{ 'button-text-size': $vuetify.display.lgAndUp }">{{
        $vuetify.display.mdAndDown ? "Show/Edit" : "Edit"
      }}</span>
    </v-btn>
    <v-btn
      :class="
        $vuetify.display.smAndDown ? 'mt-3 full-width' : 'mx-2 button-width'
      "
      class="text-white"
      color="secondary"
      elevation="2"
      @click="openAdvancedSearch()"
    >
      <v-icon class="mr-1" size="small"> fas fa-solid fa-reply</v-icon>
      <span :class="{ 'button-text-size': $vuetify.display.lgAndUp }"
        >Restart</span
      >
    </v-btn>
  </div>
</template>

<script>
import advancedSearch from "@/store";

export default {
  name: "AdvancedSearchButtons",
  methods: {
    editAdvancedSearch() {
      advancedSearch.commit("advancedSearch/setEditDialogStatus", true);
    },
    openAdvancedSearch() {
      this.$router.replace({ query: null });
      advancedSearch.commit(
        "advancedSearch/setAdvancedSearchDialogStatus",
        true,
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.button-width {
  width: 50%;

  .button-text-size {
    font-size: 12px;
  }
}
</style>
