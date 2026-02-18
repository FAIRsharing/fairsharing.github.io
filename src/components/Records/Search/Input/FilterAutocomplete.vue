<template>
  <v-expansion-panel
    v-if="filter.filterName"
    :id="filter.filterName + 'AutocompleteList'"
  >
    <v-expansion-panel-title> {{ filter.filterLabel }}</v-expansion-panel-title>

    <v-expansion-panel-text class="pl-5 pr-5">
      <v-row no-gutters>
        <v-col cols="12">
          <div
            :class="['d-flex', { 'flex-column': $vuetify.display.mdAndDown }]"
          >
            <v-combobox
              v-model="selectedValues"
              :items="getValues"
              :menu-props="{ maxWidth: '50' }"
              chips
              class="text-capitalize"
              clearable
              closable-chips
              color="primary"
              density="compact"
              hide-details="auto"
              hide-no-data
              item-title="key"
              item-value="key"
              multiple
              placeholder="Search"
              prepend-inner-icon="fas fa-search"
              return-object
              variant="solo"
              @focus="scrollTo(filter.filterName)"
              @click:clear="reset(filter)"
            >
              <template #chip="{ props, item }">
                <v-chip color="blue" v-bind="props" variant="flat">
                  {{ item.title.replace(/_/g, " ") }}
                  <v-tooltip activator="parent" location="bottom">
                    {{ item.title.replace(/_/g, " ") }}
                  </v-tooltip>
                </v-chip>
              </template>

              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #prepend="{ isActive }">
                    <v-list-item-action start>
                      <v-checkbox-btn
                        :model-value="isActive"
                        readonly
                      ></v-checkbox-btn>
                    </v-list-item-action>
                  </template>

                  <span v-if="item.raw.key" class="text-capitalize">
                    {{ item.raw.key.replace(/_/g, " ") }}
                  </span>

                  <template #append>
                    <span class="filterValueCount">{{
                      item.raw.doc_count
                    }}</span>
                  </template>
                </v-list-item>
              </template>
            </v-combobox>
            <v-btn
              class="ml-lg-2 custom-btn"
              color="primary"
              @click="applyFilters(filter)"
            >
              Apply
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import clearString from "@/utils/stringUtils";
import { capitalize } from "lodash";

export default {
  name: "FilterAutocomplete",
  mixins: [clearString],
  props: {
    filter: { default: null, type: Object },
    lastItem: { default: false, type: Boolean },
  },
  data: () => {
    return {
      selectedValues: [],
    };
  },
  computed: {
    ...mapGetters("records", ["getFilter"]),
    ...mapState("uiController", ["stickToTop"]),
    getValues: function () {
      let _module = this;
      let output = _module.getFilter(this.filter.filterName);
      if (output.values && typeof output.values === "object") {
        return output.values;
      }
      return [];
    },
  },
  methods: {
    /**
     * Apply the filters by building the new query parameters using the form data.
     */
    applyFilters: function () {
      let _module = this;
      let filterName = _module.filter.filterName;
      let currentParams = JSON.parse(JSON.stringify(_module.$route.query));

      _module.selectedValues = _module.selectedValues.map(({ key }) => key);
      if (Object.keys(currentParams).indexOf(filterName) === -1) {
        if (
          _module.selectedValues !== null &&
          _module.selectedValues.length > 0
        ) {
          if (_module.selectedValues.length === 1) {
            currentParams[filterName] = encodeURIComponent(
              _module.selectedValues.join(","),
            );
          }
          else {
            let newParam = [];
            _module.selectedValues.forEach(function (val) {
              newParam.push(encodeURIComponent(val));
            });
            currentParams[filterName] = newParam.join(",");
          }
          currentParams["page"] = 1;
          _module.$router.push({
            name: _module.$route.name,
            query: currentParams,
          });
        }
      }
      else {
        if (
          _module.selectedValues === null ||
          _module.selectedValues.length === 0
        ) {
          delete currentParams[_module.filter.filterName];
          currentParams["page"] = 1;
          _module.$router.push({
            name: _module.$route.name,
            query: currentParams,
          });
        }
        else {
          let newParams = [];
          let existingValues =
            currentParams[_module.filter.filterName].split(",");
          _module.selectedValues.forEach(function (selectedValue) {
            const filterVal = encodeURIComponent(selectedValue);
            if (existingValues.indexOf(filterVal) === -1) {
              newParams.push(filterVal);
            }
          });
          currentParams[_module.filter.filterName] += `,${newParams.join(",")}`;
          if (newParams.length > 0) {
            currentParams["page"] = 1;
            _module.$router.push({
              name: _module.$route.name,
              query: currentParams,
            });
          }
        }
      }
      _module.selectedValues = [];
    },
    /**
     * Reset the form/filters/parameters to default (go so /search?page=1)
     */
    reset: function (selectedItem) {
      selectedItem.filterSelected = {};
    },
    /* istanbul ignore next */
    scrollTo(name) {
      let _module = this;
      _module.$scrollTo("#" + name + "AutocompleteList", 450, {
        container: "#scrollable-holder",
        easing: "ease-in",
      });
    },

    itemProps(item) {
      return {
        key: item.key,
        title: capitalize(this.cleanString(item.key)),
        subtitle: item.doc_count,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.filterValueName {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
}

.chipsValueName {
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.filterValueCount {
  background: #2196f3;
  color: white;
  padding: 0 7px;
}

.custom-btn {
  height: 38px;
}

.v-field {
  .v-chip {
    height: inherit;
  }
}

:deep(.v-list-item-title) {
  display: none;
}
</style>
