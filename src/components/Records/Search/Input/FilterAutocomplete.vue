<template>
  <v-expansion-panel v-if="filter.filterName">
    <div
      :class="['d-flex',{'flex-column':$vuetify.breakpoint.mdAndDown}]"
      class="px-3"
    >
      <v-autocomplete
        v-model="selectedValues"
        :items="getValues"
        outlined
        dense
        clearable
        multiple
        prepend-inner-icon="mdi-magnify"
        :placeholder="`Search through ${filter.filterLabel}`"
        :label="filter.filterLabel"
        item-text="key"
        item-value="key"
        class="autocomplete-max-width pt-2"
        @click:clear="reset(filter)"
      >
        <template v-slot:selection="data">
          <v-chip class="blue white--text  mb-1 ">
            <span class="chipsValueName">
              {{ cleanString(data.item.key) }}
            </span>
          </v-chip>
        </template>
        <template v-slot:item="data">
          <div class="d-flex align-content-around">
            <span class="filterValueName"> {{ cleanString(data.item.key) }}</span>
            <span class="filterValueCount"> {{ data.item['doc_count'] }}</span>
          </div>
        </template>
      </v-autocomplete>
      <v-btn
        color="primary"
        class="ml-lg-2 mt-2"
        style="height: 38px"
        @click="applyFilters(filter)"
      >
        Apply
      </v-btn>
    </div>
  </v-expansion-panel>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import clearString from '@/utils/stringUtils'

export default {
  name: "FilterAutocomplete",
  mixins: [clearString],
  props: {
    filter: {default: null, type: Object},
    lastItem:{default:false, type:Boolean}
  },
  data: () => {
    return {
      selectedValues: []
    }
  },
  computed: {
    ...mapGetters('records', ['getFilter']),
    ...mapState('uiController', ['stickToTop']),
    getValues: function () {
      let _module = this;
      let output = _module.getFilter(this.filter.filterName);
      if (output.values && typeof output.values === 'object') {
        return output.values;
      }
      return []
    }
  },
  methods: {
    /**
     * Apply the filters by building the new query parameters using the form data.
     */
    applyFilters: function () {
      let _module = this;
      let filterName = _module.filter.filterName;
      let currentParams = JSON.parse(JSON.stringify(_module.$route.query));

      if (Object.keys(currentParams).indexOf(filterName) === -1) {
        if (_module.selectedValues !== null && _module.selectedValues.length > 0) {
          if (_module.selectedValues.length === 1) {
            currentParams[filterName] = encodeURIComponent(_module.selectedValues.join(','));
          }
          else {
            let newParam = [];
            _module.selectedValues.forEach(function (val) {
              newParam.push(encodeURIComponent(val));
            });
            currentParams[filterName] = newParam.join(",");
          }
          _module.$router.push({
            name: _module.$route.name,
            query: currentParams
          });
        }
      }
      else {
        if (_module.selectedValues === null || _module.selectedValues.length === 0) {
          delete currentParams[_module.filter.filterName];
          _module.$router.push({
            name: _module.$route.name,
            query: currentParams
          });
        }
        else {
          let newParams = [];
          let existingValues = currentParams[_module.filter.filterName].split(",");
          _module.selectedValues.forEach(function (selectedValue) {
            const filterVal = encodeURIComponent(selectedValue);
            if (existingValues.indexOf(filterVal) === -1) {
              newParams.push(filterVal);
            }
          });
          currentParams[_module.filter.filterName] += `,${newParams.join(",")}`;
          if (newParams.length > 0) {
            _module.$router.push({
              name: _module.$route.name,
              query: currentParams
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
      _module.$scrollTo("#" + name + 'AutocompleteList', 450, {
        container: '#scrollable-holder',
        easing: 'ease-in',
      })
    }
  }
}
</script>

<style scoped>
.filterValueName {
  width: 378px;
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
  background: #2196F3;
  color: white;
  padding: 0 7px;
}

.custom-btn {
  height: 38px;
}
</style>
