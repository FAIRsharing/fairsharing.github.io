<template>
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
    <v-btn
      v-if="$vuetify.breakpoint.mdAndDown && !showButton"
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
    <v-btn
      v-if="showButton"
      id="home-search-bt"
      color="primary"
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
  </form>
</template>

<script>
export default {
  name: "StringSearch",
  props: {
    placeholder: {default: null, type: String},
    showButton: {default: false, type: Boolean}
  },
  data() {
    return {
      searchTerm: null
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

#home-search-bt {
  height: 40px;
  position: absolute;
  right: 0;
  top: 0;
  border-radius: unset;
  -webkit-border-radius: unset;
  -moz-border-radius: unset;
}
</style>

