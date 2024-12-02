<template>
  <div
    class="d-flex full-width py-2 px-5 justify-center"
    :class="{ 'flex-column': $vuetify.breakpoint.smAndDown }"
  >
    <v-btn
      :class="
        $vuetify.breakpoint.smAndDown ? 'full-width' : 'mx-2 button-width'
      "
      color="accent"
      elevation="2"
      @click="editAdvancedSearch()"
    >
      <v-icon
        small
        class="mr-1"
      >
        fa-solid fa-pen
      </v-icon>
      <span :class="{ 'button-text-size': $vuetify.breakpoint.lgAndUp }">{{
        $vuetify.breakpoint.mdAndDown
          ? "Show/Edit"
          : "Edit"
      }}</span>
    </v-btn>
    <v-btn
      class="white--text"
      :class="
        $vuetify.breakpoint.smAndDown ? 'mt-3 full-width' : 'mx-2 button-width'
      "
      color="secondary"
      elevation="2"
      @click="openAdvancedSearch()"
    >
      <v-icon
        small
        class="mr-1"
      >
        fa-solid fa-reply
      </v-icon>
      <span :class="{ 'button-text-size': $vuetify.breakpoint.lgAndUp }">Restart</span>
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
      this.$router.replace({'query': null});
      advancedSearch.commit(
        "advancedSearch/setAdvancedSearchDialogStatus",
        true
      );
    },
  },
};
</script>
<style scoped lang="scss">
.button-width {
  width: 50%;
  .button-text-size {
    font-size: 12px;
  }
}
</style>
