<template>
  <v-expansion-panel v-if="filter.filterName">
    <v-expansion-panel-header> {{ filter.filterLabel }}</v-expansion-panel-header>
    <v-expansion-panel-content class="pl-5 pr-5">
      <div :class="['d-flex',{'flex-column':$vuetify.breakpoint.mdAndDown}]">
        <v-autocomplete
          v-model="selectedValues"
          :attach="true"
          :items="getValues"
          solo
          dense
          clearable
          multiple
          prepend-inner-icon="fa-search"
          :placeholder="`Search through ${filter.filterLabel}`"
          item-text="key"
          item-value="key"
          @focus="onInput"
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
            <div class="d-flex full-width">
              <span class="filterValueName"> {{ cleanString(data.item.key) }}</span>
              <span class="filterValueCount"> {{ data.item['doc_count'] }}</span>
            </div>
          </template>
        </v-autocomplete>
        <v-btn
          color="primary"
          class="ml-lg-2"
          style="height: 38px"
          @click="applyFilters(filter)"
        >
          Apply
        </v-btn>
      </div>
    </v-expansion-panel-content>
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
    onInput () {
      if (this.lastItem) {
        setTimeout(this.callOut, 100)
      }
    },
    callOut ()  {
      this.$emit('lastItemClick')
    }
  }
}
</script>

<style scoped lang="scss">
.badge {
  width: 35px;
  height: 25px;
  background: white;
  border: #27aae1 solid 1px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  position: relative;

  #inventory {
    font-size: small;
    position: absolute;
    top: 6%;
    left: 20%;
  }
}

.badge-active {
  width: 35px;
  height: 24px;
  background: #27aae1;
  border: #27aae1 solid 1px;
  border-radius: 5px 5px 5px 5px;
  -moz-border-radius: 5px 5px 5px 5px;
  -webkit-border-radius: 5px 5px 5px 5px;
  position: relative;

  #inventory {
    color: white;
    font-size: small;
    position: absolute;
    top: 6%;
    left: 20%;
  }
}

.triangle-left {
  position: absolute;
  width: 0;
  height: 0;
  border-top: 12px solid transparent;
  border-right: 15px solid #27aae1;
  border-bottom: 11px solid transparent;
  left: -30%;
}

.fixed-scrollable-height {
  max-height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

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
  background: #2196F3;
  color: white;
  padding: 0 7px;
}

</style>
