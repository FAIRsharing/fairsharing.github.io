<template>
  <div>
    <form
      class="d-flex flex-row align-center align-content-center pt-1 mr-1 mr-lg-1 ml-1"
      style="position: relative"
      @submit.prevent="searchString()"
    >
      <v-text-field
        v-model="searchTerm"
        solo
        single-line
        clearable
        dense
        full-width
        :class="$vuetify.breakpoint.lgAndDown?'v-input':'v-input-lg-up'"
        :height="responsiveHeightTextBox"
        :placeholder="placeholder"
      />

      <!--  reusable search box  -->
      <v-btn
        v-if="$vuetify.breakpoint.mdAndDown && !showHomeSearch"
        small
        color="primary"
        outlined
        :class="responsiveHeight"
        class="mt-1 mt-lg-1 ml-2"
        @click="searchString()"
      >
        <v-icon
          x-small
          class="mr-1"
        >
          fas fa-search
        </v-icon>
        <span class="button-text-size">Search</span>
      </v-btn>

      <!--  home page search box  -->
      <v-btn
        v-if="showHomeSearch"
        color="primary"
        :class="['mt-1 mt-lg-1 ml-2',$vuetify.breakpoint.lgAndDown?'home-search-bt':'home-search-bt-xl']"
        @click="searchStringHomePage()"
      >
        <v-icon
          x-small
          class="mr-1"
        >
          fas fa-search
        </v-icon>
        <span class="button-text-size">Search</span>
      </v-btn>
    </form>
    <!--  home page exclusive check box for search  -->
    <div
      v-if="showHomeSearch"
      class="pt-6"
    >
      <v-checkbox
        v-for="(checkbox,index) in registries"
        :key="checkbox.value+'_'+index"
        v-model="selectedRegistries"
        class="d-inline-block mr-2"
        :label="checkbox.label"
        :value="checkbox"
      >
        <template #label>
          <span class="v-label-white">{{ checkbox.label }}</span>
        </template>
      </v-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: "StringSearch",
  props: {
    placeholder: {default: null, type: String},
    showHomeSearch: {default: false, type: Boolean}
  },
  data() {
    return {
      searchTerm: null,
      registries: [{label:'standards',value:'standard'},{label:'databases',value:'database'}
        ,{label:'policies',value:'policy'},{label:'collections',value:'collection'}
      ],
      selectedRegistries:[{label:'standards',value:'standard'},{label:'databases',value:'database'}
        ,{label:'policies',value:'policy'},{label:'collections',value:'collection'}
      ]
    }
  },
  computed: {
    responsiveHeight: function () {
      return {
        'style-sm-xs': this.$vuetify.breakpoint.mdAndDown,
        'style-md': this.$vuetify.breakpoint.mdOnly,
        'style-lg': this.$vuetify.breakpoint.lgOnly,
        'style-xl': this.$vuetify.breakpoint.xlOnly,
      }
    },
    responsiveHeightTextBox: function () {
      let boxHeight = 35;
      if(this.$vuetify.breakpoint.xlOnly){
        boxHeight = 50;
      }
        return boxHeight;
    }
  },
  methods: {
    searchString() {
      const _module = this;
      if (_module.searchTerm) {
        _module.$router.push({
          path: "/search",
          query: {
            q: _module.searchTerm
          }
        });
        _module.searchTerm = null;
      }
    },
    searchStringHomePage() {
      const _module = this;
      if (_module.searchTerm) {
        if (_module.selectedRegistries.length === _module.registries.length) {
          _module.$router.push({
            path: "/search",
            query: {
              q: _module.searchTerm
            }
          });
          _module.searchTerm = null;
        }
        else {
          const selectedRegistriesValues = [];
          _module.selectedRegistries.forEach(registryItem => {
            selectedRegistriesValues.push(registryItem.value)
          });
          _module.$router.push({
            path: "/search",
            query: {
              q: _module.searchTerm,
              fairsharingRegistry: selectedRegistriesValues.toString(),
              searchAnd:false
            }
          });
          _module.searchTerm = null;
        }
      }
    }
  }
}
</script>

<style scoped>
.v-input {
  box-shadow: 0 0 0 0;
  height: 35px!important;
  margin-bottom: 7px;
}
.v-input-lg-up{
  box-shadow: 0 0 0 0;
  height: 48px;
  margin-bottom: 15px;
}

.button-text-size {
  font-size: 12px;
}

.style-xl {
  height: 52px !important;
  margin-bottom: 4px;
}

.style-lg {
  height: 36px !important;
  margin-bottom: 4px;
}

.style-md {
  height: 32px !important;
}

.style-sm-xs {
  height: 40px !important;
  margin-bottom: 5px;
}

.home-search-bt {
  height: 40px!important;
  position: absolute;
  right: 0;
  top: 0;
  border-radius: unset;
  -webkit-border-radius: unset;
  -moz-border-radius: unset;
}

.home-search-bt-xl {
  height: 50px!important;
  position: absolute;
  right: 0;
  top: 0;
  border-radius: unset;
  -webkit-border-radius: unset;
  -moz-border-radius: unset;
}
.v-label-white {
  color: white;
}
</style>

