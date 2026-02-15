<template>
  <div id="recordHistoryContent">
    <v-tabs
      v-model="selectedTab"
      align-tabs="center"
      bg-color="black"
      center-active
      color="primary"
      grow
      selected-class="tabSelected"
      show-arrows
      slider-color="primary"
    >
      <v-tab :value="0">View history logs</v-tab>
      <v-tab :value="1">View legacy logs</v-tab>
    </v-tabs>

    <v-tabs-window v-model="selectedTab">
      <v-tabs-window-item :value="0">
        <div class="my-3 d-flex flex-column flex-md-row">
          <v-tabs
            v-model="subTab"
            class="mb-4 mb-md-0"
            color="secondary"
            direction="vertical"
          >
            <v-tab
              v-for="(subTabContent, subTabIndex) in history"
              :key="'subTab_' + subTabIndex"
              :value="subTabIndex"
              class="bg-primary text-white mb-2 justify-center d-flex align-center"
              style="width: 150px; height: 80px"
              @click="page = 1"
            >
              {{ subTabContent[0] }}
            </v-tab>
          </v-tabs>

          <v-tabs-window v-model="subTab" class="flex-grow-1">
            <v-tabs-window-item
              v-for="(subTabContent, subTabIndex) in history"
              :key="'subTabContent_' + subTabIndex"
              :value="subTabIndex"
            >
              <v-card
                v-if="subTab === subTabIndex"
                class="mx-2 pa-4"
                max-height="85vh"
                style="overflow-y: auto"
              >
                <v-card-text
                  v-if="
                    subTabContent[1] && Object.keys(subTabContent[1]).length > 0
                  "
                >
                  <div
                    class="text-center mb-10 d-flex flex-column align-center"
                  >
                    <v-pagination
                      v-if="maxPage > 1"
                      v-model="page"
                      :length="maxPage"
                      :total-visible="7"
                    />
                    <v-switch
                      v-model="reverseDate"
                      :label="
                        reverseDate ? 'Descending date' : 'Ascending date'
                      "
                      class="mt-4"
                      color="primary"
                      hide-details
                      inset
                    />
                  </div>

                  <v-expansion-panels v-model="currentPanel" multiple>
                    <v-expansion-panel
                      v-for="(entry, entryIndex) in paginatedData"
                      :key="'entry_' + entryIndex"
                    >
                      <v-expansion-panel-title>
                        <div v-if="entry['date'] || entry['event']">
                          <h3
                            class="my-1 text-subtitle-1 font-weight-bold d-flex align-center"
                          >
                            <v-icon class="mr-3" icon="far fa-calendar-check" />
                            <span>
                              {{ formatDate(entry["date"]) }}
                              <span v-if="entry['event']">
                                &mdash; {{ entry["event"] }}
                              </span>
                              <span v-if="entry['user']">
                                &mdash; {{ entry["user"] }}
                              </span>
                            </span>
                          </h3>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text class="pt-3">
                        <vue-json-pretty
                          :data="entry"
                          :deep="5"
                          :highlight-mouseover-node="true"
                          :show-double-quotes="false"
                        />
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-card-text>
                <v-card-text v-else> No data. </v-card-text>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </v-tabs-window-item>

      <v-tabs-window-item :value="1">
        <v-card class="ma-3 pa-3" max-height="87vh" style="overflow-y: auto">
          <v-pagination
            v-if="maxPage > 1"
            v-model="page"
            :length="maxPage"
            :total-visible="7"
            class="mb-10"
          />
          <v-expansion-panels v-model="legacyPanels" multiple>
            <v-expansion-panel
              v-for="(entry, entryIndex) in paginatedData"
              :key="'legacy_entry_' + entryIndex"
            >
              <v-expansion-panel-title>
                <h3
                  class="my-1 text-subtitle-1 font-weight-bold d-flex align-center"
                >
                  <v-icon class="mr-3" icon="far fa-calendar-check" />
                  <span>{{ formatDate(entry["when"]) }}</span>
                </h3>
              </v-expansion-panel-title>
              <v-expansion-panel-text class="pt-3">
                <b class="d-block mb-2">By {{ entry.username }}</b>
                <vue-json-pretty
                  :data="entry.diff"
                  :deep="5"
                  :highlight-mouseover-node="true"
                  :show-double-quotes="false"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import moment from "moment";

export default {
  name: "RecordHistory",
  components: { VueJsonPretty },
  props: {
    history: { default: () => [], type: Array },
    legacyLogs: { default: () => [], type: Array },
  },
  data() {
    return {
      selectedTab: 0,
      subTab: 0,
      page: 1,
      perPage: 12,
      reverseDate: true,
      currentPanel: [],
      legacyPanels: [],
      dateFormat: "dddd, MMMM Do YYYY, h:mm:ss a",
    };
  },
  computed: {
    activeRawData() {
      let rawData = [];
      if (this.selectedTab === 0) {
        const currentSubTab = this.history?.[this.subTab];
        if (currentSubTab && currentSubTab[1]) {
          rawData = currentSubTab[1];
        }
      }
      else if (this.selectedTab === 1) {
        rawData = this.legacyLogs || [];
      }
      if (!rawData) return [];
      // Break reactivity safely
      let parsedData = JSON.parse(JSON.stringify(rawData));
      // Force to an Array so .slice() and .reverse() never crash
      if (!Array.isArray(parsedData)) {
        parsedData = Object.values(parsedData);
      }
      return parsedData;
    },

    // 2. Dynamically calculates pages based on active data length
    maxPage() {
      return Math.ceil(this.activeRawData.length / this.perPage) || 1;
    },

    // 3. Reverses and splices the data safely, used directly in v-for loops
    paginatedData() {
      let output = [...this.activeRawData];
      if (this.reverseDate) {
        output.reverse();
      }
      const start = (this.page - 1) * this.perPage;
      const end = start + this.perPage;
      return output.slice(start, end);
    },
  },
  watch: {
    page() {
      this.currentPanel = [];
      this.legacyPanels = [];
    },
    selectedTab() {
      this.currentPanel = [];
      this.legacyPanels = [];
      this.page = 1;
    },
    subTab() {
      this.currentPanel = [];
      this.legacyPanels = [];
      this.page = 1;
    },
    reverseDate() {
      this.currentPanel = [];
      this.legacyPanels = [];
      this.page = 1;
    },
  },
  methods: {
    formatDate(value) {
      if (!value) return "";
      return moment(value).format(this.dateFormat);
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.v-switch__track) {
  opacity: 1;
}

:deep(.tabSelected .v-tab__slider) {
  height: 5px;
}

:deep(.v-slide-group--vertical .v-tab__slider) {
  width: 5px;
}
</style>
