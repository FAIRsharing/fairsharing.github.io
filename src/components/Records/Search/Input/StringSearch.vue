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
      placeholder="Search through all data."
    />
    <v-btn
      color="primary"
      outlined
      :class="responsiveHeight"
      class="mt-0 mt-lg-1 ml-2"
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
  props:{
  },
  computed:{
    responsiveHeight: function () {
      return {
        'style-sm-xs': this.$vuetify.breakpoint.smAndDown,
        'style-md': this.$vuetify.breakpoint.mdOnly,
        'style-lg': this.$vuetify.breakpoint.lgOnly,
        'style-xl': this.$vuetify.breakpoint.xlOnly,
      }
    }
  },
  data() {
    return {
      searchTerm: null
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

<style scoped >
.v-input {
  height: 38px;
  box-shadow: 0 0 0 0;
}
.button-text-size
{
  font-size: 11px;
}
.style-xl {
  height: 56px!important;
}
.style-lg {
  height: 40px!important;
}
.style-md {
  height: 32px!important;
}
.style-sm-xs {
  height: 32px!important;
}
</style>

