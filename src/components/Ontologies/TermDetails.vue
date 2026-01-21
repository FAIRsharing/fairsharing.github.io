<template>
  <div id="termDetails" class="px-3">
    <!-- BACK BUTTON -->
    <div class="pl-3 mt-4">
      <v-chip
        :class="`text-${color} border-${color} border border-solid border-opacity-100 mb-3 cursor-pointer bg-white`"
        variant="elevated"
        @click="$router.push({ path: '/browse/subject' })"
      >
        <v-icon :class="`text-${color}`"> fas fa-arrow-left</v-icon>
        <span :class="`text-${color} ml-3`"> GO BACK TO GRAPH </span>
      </v-chip>
    </div>

    <!-- TERM METADATA -->
    <v-card class="pt-3 d-flex flex-column justify-center align-center">
      <v-card-title
        id="metadata"
        class="d-flex flex-column justify-center align-center"
      >
        <div
          :class="`bg-${color} text-white`"
          class="d-flex justify-center align-center hits largeHits"
        >
          {{ selectedTerm.records_count ? selectedTerm.records_count : 0 }}
        </div>
        <span :class="`text-${color} text-h4 mb-2`">
          {{ selectedTerm.name }}
        </span>
      </v-card-title>
      <v-card-subtitle class="subTitle">
        <div class="text-center" style="white-space: normal">
          {{ selectedTerm.description }}
        </div>
        <v-divider class="opacity-100" />
        <v-container fluid>
          <v-row class="py-0 my-0">
            <v-col cols="4 my-0 py-0">
              <v-row class="justify-end pr-5 font-weight-bold">
                Descendants count:
              </v-row>
              <v-row class="justify-end pr-5 pt-2 font-weight-bold">
                Ancestors:
              </v-row>
            </v-col>
            <v-col cols="8 my-0 py-0">
              <v-row>{{ selectedTerm.descendants_count }}</v-row>
              <v-row
                v-if="ancestors.length > 0"
                class="d-flex flex-row align-center"
              >
                <v-chip
                  v-for="(ancestor, ancestorKey) in ancestors"
                  :key="'ancestor_' + ancestorKey"
                  :class="`text-${color} border-${color}`"
                  class="bg-white mr-2 mt-1"
                  @click="goToTerm(ancestor)"
                >
                  {{ ancestor }}
                </v-chip>
              </v-row>
              <v-row v-else class="d-flex flex-row align-center pt-2">
                This term doesn't have any ancestor.
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-subtitle>

      <!-- SEARCH OUTPUT -->
      <v-card-text id="termSearchResults" class="px-0 pb-0 mt-5 full-width">
        <v-divider class="opacity-100" />
        <h5
          :class="`text-${color} mb-4 text-decoration-underline text-h5 px-4`"
        >
          Records with this {{ selectedOntology }}:
        </h5>
        <div class="inputGroup d-flex flex-row align-center mb-5 px-4">
          <v-btn class="bg-primary text-white" @click="goToSearch()">
            Access All Search Options
          </v-btn>
          <v-spacer />
          <div class="perPageSelector flex-row d-flex align-center">
            Row per page:
            <v-select
              v-model="perPage"
              :items="[10, 20, 50, 100]"
              class="ml-5"
              density="compact"
              hide-details
              style="flex-grow: 0"
            />
          </div>
          <div class="pager flex-row d-flex align-center">
            Showing {{ min }} to {{ min + perPage - 1 }}
            <v-icon
              :disabled="currentPage === 1"
              class="ml-5 mr-10"
              @click="setPage(-1)"
            >
              fas fa-chevron-left
            </v-icon>
            <v-icon :disabled="currentPage === totalPages" @click="setPage(1)">
              fas fa-chevron-right
            </v-icon>
          </div>
        </div>
        <v-data-table
          :headers="headers"
          :items="records"
          :no-data-text="`Cannot find any record with this ${selectedOntology}`"
          class="fixedHeight d-block"
          hide-default-footer
          items-per-page="-1"
          mobile-breakpoint="sm"
          text-center
        >
          <template #[`item.name`]="{ item }">
            <div :class="'text-' + color" class="noBreak">
              <a
                :href="`/${item.id}`"
                class="d-flex align-center cursor-pointer"
              >
                <v-avatar class="mr-3" size="30">
                  <Icon :item="item.type" height="30" wrapper-class="" />
                </v-avatar>
                {{ item.name }}
              </a>
            </div>
          </template>
          <template #[`item.status`]="{ item }">
            <div class="d-flex justify-center align-center">
              <StatusPills :record-status="item.status" />
            </div>
          </template>
          <template #[`item.registry`]="{ item }">
            <div class="d-flex justify-center align-center flex-column">
              <div>{{ item.registry }}</div>
              <div>({{ cleanString(item.type) }})</div>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import Icon from "@/components/Icon";
import StatusPills from "@/components/Users/Profiles/Private/StatusPills";
import stringUtils from "@/utils/stringUtils";

export default {
  name: "TermDetails",
  components: { Icon, StatusPills },
  mixins: [stringUtils],
  props: { selectedOntology: { required: true, type: String } },
  data() {
    return {
      headers: [
        { title: "Record name", value: "name", align: "center" },
        {
          title: "Record registry and type",
          value: "registry",
          align: "center",
        },
        { title: "Record status", value: "status", align: "center" },
      ],
    };
  },
  computed: {
    min() {
      return (this.currentPage - 1) * this.perPage + 1;
    },
    currentPage() {
      return this.getCurrentPage();
    },
    color() {
      return this.colors[this.selectedOntology];
    },
    ancestors() {
      return this.getAncestors()(this.selectedTerm.identifier, "name");
    },
    perPage: {
      get() {
        return this.getPerPage();
      },
      set(val) {
        this.changePerPage(val);
      },
    },
    ...mapState("ontologyBrowser", ["records", "totalPages", "selectedTerm"]),
    ...mapState("editor", ["colors"]),
  },
  methods: {
    async setPage(offset) {
      await this.fetchNewPage(offset);
    },
    goToSearch() {
      this.$router.push({
        name: "search",
        query: { subjects: encodeURIComponent(this.selectedTerm.name) },
      });
    },
    goToTerm(term) {
      this.$router.push({
        path: this.$route.path,
        query: { term: encodeURIComponent(term) },
      });
    },
    ...mapGetters("ontologyBrowser", [
      "getPerPage",
      "getCurrentPage",
      "getAncestors",
    ]),
    ...mapActions("ontologyBrowser", ["fetchNewPage", "changePerPage"]),
  },
};
</script>

<style scoped>
.cell {
  padding: 10px 20px !important;
}

.fixedHeight {
  min-height: 40vh;
  max-height: 50vh;
  overflow-y: scroll;
}

.largeChips {
  height: 50px;
  border-radius: 40px;
  padding-left: 40px;
  padding-right: 40px;
}

.largeHits {
  width: 100px;
  height: 100px;
  font-size: 30px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.subject_color--border {
  border: 1px solid;
  border-color: #e67e22 !important;
}

.domain_color--border {
  border: 1px solid;
  border-color: #712727 !important;
}

@media (max-width: 760px) {
  .inputGroup {
    flex-direction: column !important;
  }

  .perPageSelector {
    margin-top: 15px;
    margin-bottom: 15px;
  }
}

@media (min-width: 761px) {
  .perPageSelector {
    margin-right: 30px;
    margin-left: 30px;
  }
}

@media (min-width: 1904px) {
  .subTitle {
    max-width: 50%;
  }
}
</style>
