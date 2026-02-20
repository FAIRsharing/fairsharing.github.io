<template>
  <div>
    <template v-if="user().is_super_curator">
      <v-autocomplete
        v-model="userSelected"
        v-model:search="searchUser"
        :items="usersList"
        :loading="loading"
        chips
        class="mb-7 full-width stepperField"
        closable-chips
        color="primary"
        flat
        hide-details="auto"
        item-title="username"
        item-value="id"
        label="Enter text to search for additional user(s) to associate with this saved search"
        multiple
        variant="underlined"
      >
        <template #no-data>
          <div v-show="!loading" class="py-3 px-4">No User found</div>
          <div v-show="loading" class="py-3 px-4">Loading...</div>
        </template>
      </v-autocomplete>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import saveSearch from "@/store";
import { removeItem } from "@/utils/advancedSearchUtils";

export default {
  name: "UserStepper",
  data() {
    return {
      loading: false,
      userSelected: [],
      searchUser: null,
    };
  },
  computed: {
    ...mapState("users", ["user", "usersList"]),
  },
  watch: {
    async searchUser(val) {
      if (!val || val.length < 3) return;
      val = val.trim();
      this.loading = true;
      await this.getUsersList(val);
      this.loading = false;
    },

    userSelected(val) {
      saveSearch.commit("saveSearch/setUserSelected", val);
    },
  },

  methods: {
    ...mapActions("users", ["getUsersList"]),

    /**
     * Remove the selected item from selection
     * @param item
     * @return {Array}
     */
    remove(item) {
      return removeItem(item, this.userSelected);
    },
  },
};
</script>
