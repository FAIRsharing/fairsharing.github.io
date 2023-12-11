<template>
  <div class="mx-2">
    <v-card
      elevation="3"
      class="py-2"
    >
      <div
        v-for="(item, index) in getAdvancedSearchQuery['fields']"
        :key="index"
        class="chips-holder ma-2"
      >
        <div
          v-for="([key, value], idx) in Object.entries(item)"
          :key="idx"
        >
          <v-chip
            class="ma-2 mt-5"
            close
            color="grey"
            text-color="secondary"
          >
            {{ displayChips(key, value) }}
          </v-chip>
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "AdvancedSeacrhSelection",
  computed: {
    ...mapGetters("advancedSearch", ["getAdvancedSearchQuery"]),
  },
  methods: {
    displayChips(key, value) {
      if (key === "operator") {
        if (value.toString() === "_and") return "and";
        else if (value.toString() === "_or") return "or";
      } else {
        return `${key} : ${value}`;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.chips-holder {
  //position: sticky;
  //top: 0;
  //z-index: 2;
  background: #f5f5f5;
  border: 2px dotted #dbdbdb;
  border-radius: 10px;
}
</style>
