<template>
  <div id="recordHistoryContent">
    <v-tabs
      v-model="selectedTab"
      dark
      slider-color="primary"
      slider-size="5"
    >
      <v-tab>
        View history logs
      </v-tab>
      <v-tab>
        View legacy logs
      </v-tab>

      <v-tabs-items v-model="selectedTab">
        <v-tab-item>
          <div
            v-if="selectedTab === 0"
            class="my-3"
          >
            <v-tabs
              v-model="subTab"
              slider-color="secondary"
              slider-size="5"
              vertical
            >
              <v-tab
                v-for="(subTabContent, subTabIndex) in history"
                :key="'subTab_' + subTabIndex"
                dense
                style="max-width: 150px;"
                class="primary white--text"
                @click="page = 1"
              >
                {{ subTabContent[0] }}
              </v-tab>

              <v-tabs-items v-model="subTab">
                <v-tab-item
                  v-for="(subTabContent, subTabIndex) in history"
                  :key="'subTabContent_' + subTabIndex"
                >
                  <v-card
                    v-if="subTab === subTabIndex"
                    class="mx-2 pa-4"
                    max-height="85vh"
                    style="overflow-y: scroll"
                  >
                    <v-card-text v-if="Object.keys(subTabContent[1]).length > 0">
                      <!-- CONFIGURATION -->
                      <div class="text-center mb-10">
                        <v-pagination
                          v-model="page"
                          :length="maxPage"
                          :total-visible="7"
                        />
                        <v-switch
                          v-model="reverseDate"
                          inset
                          color="primary"
                          :label="(reverseDate) ? 'Descending date' : 'Ascending date'"
                        />
                      </div>

                      <!-- CONTENT -->
                      <v-expansion-panels
                        focusable
                        multiple
                      >
                        <v-expansion-panel
                          v-for="(entry, entryIndex) in reverse(subTabContent[1], subTabIndex)"
                          :key="'entry_' + entryIndex"
                        >
                          <v-expansion-panel-header>
                            <div v-if="entry['updated_at']">
                              <h3 class="mb-3">
                                <v-icon
                                  class="mr-3"
                                >
                                  far fa-calendar-check
                                </v-icon>
                                <span style="position:relative; top:3px;">{{ entry['updated_at'][1] | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</span>
                              </h3>
                            </div>
                            <div v-if="entry.changes">
                              <h3 class="mb-3">
                                <v-icon
                                  class="mr-3"
                                >
                                  far fa-calendar-check
                                </v-icon>
                                <span style="position:relative; top:3px;">{{ entry.changes['updated_at'][1] | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}</span>
                              </h3>
                            </div>
                          </v-expansion-panel-header>
                          <v-expansion-panel-content class="pt-3">
                            <vue-json-pretty
                              :data="entry"
                              :show-double-quotes="false"
                              :deep="5"
                              :highlight-mouseover-node="true"
                            />
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-card-text>
                    <v-card-text v-else>
                      No data.
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </div>
        </v-tab-item>
        <v-tab-item>
          <v-card
            v-if="selectedTab === 1"
            class="ma-3 pa-3"
            max-height="87vh"
            style="overflow-y: scroll"
          >
            {{ legacyLogs }}
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
    import VueJsonPretty from 'vue-json-pretty'

    export default {
        name: "RecordHistory",
        components: { VueJsonPretty },
        props: {
            history: { default: null, type: Array},
            legacyLogs: { default: null, type: Array}
        },
        data() {
            return {
                selectedTab: null,
                subTab: null,
                page: 1,
                perPage: 12,
                maxPage: 0,
                reverseDate: true,
            }
        },
        methods: {
            reverse(array, index){
                let output = JSON.parse(JSON.stringify(array));
                if (index >  0) output = Object.values(output);
                let length = output.length;
                if (this.reverseDate) output = output.reverse();
                this.maxPage = Math.ceil(length/this.perPage);
                const enter = (this.page - 1) * this.perPage,
                    exit = ((this.page - 1) * this.perPage) + this.perPage;
                output = output.slice(enter, exit);
                return output;
            }
        }
    }
</script>

<style scoped>

</style>
