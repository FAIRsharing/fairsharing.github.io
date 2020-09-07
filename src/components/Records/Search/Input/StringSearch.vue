<template>
  <form
    class=" d-flex flex-row align-center align-content-center  mr-1 mr-lg-2 ml-1"
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
      :placeholder="placeHolder"
    />
    <v-btn
      color="primary"
      outlined
      :class="responsiveHeight"
      class="mt-1 mt-lg-1 ml-2"
      @click="searchString()"
    >
      <v-icon>search</v-icon>
      <span class="button-text-size">Search</span>
    </v-btn>
  </form>
</template>

<script>
export default {
  name: "StringSearch",
  props: {
    placeHolder: {default: "", type: String}
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
      let boxHeight=38;
      if(this.$vuetify.breakpoint.xlOnly){
        boxHeight = 54;
      }
        return boxHeight;
    }
  },
  methods: {
    searchString() {
      const _module = this;
      if (_module.searchTerm) {
        _module.$router.push({
          path: "search",
          query: {
            q: _module.searchTerm
          }
        })
        _module.searchTerm = null;
      }
    },
  }
}
</script>

<style scoped>
.v-input {
  box-shadow: 0 0 0 0;
  height: 38px;
}
.v-input-lg-up{
  box-shadow: 0 0 0 0;
  height: 50px;
}

.button-text-size {
  font-size: 11px;
}

.style-xl {
  height: 56px !important;
}

.style-lg {
  height: 40px !important;
}

.style-md {
  height: 32px !important;
}

.style-sm-xs {
  height: 40px !important;
}
</style>

