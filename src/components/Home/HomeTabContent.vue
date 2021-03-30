<template>
  <v-container>
    <v-row class="my-4">
      <v-col
        cols="12"
        sm="12"
        lg="5"
        class="d-flex justify-center"
      >
        <v-img
          contain
          :src="image"
          :width="$vuetify.breakpoint.mdAndDown?'150':'300'"
          :height="$vuetify.breakpoint.mdAndDown?'150':'300'"
        />
      </v-col>
      <v-col
        cols="12"
        sm="12"
        lg="7"
        class="d-flex flex-column justify-center"
      >
        <h4 class="mb-2 text-left text-body-2 text-sm-h6 text-md-h5 font-weight-bold primary--text">
          {{ header }}
        </h4>
        <p :class="['mb-1 lato-font-medium font-weight-thin text-justify lato-text-sm',{'lato-text-md':$vuetify.breakpoint.mdAndUp}]">
          {{ description }}
        </p>
        <router-link
          class="text-left font-weight-light lato-text-sm underline-effect"
          :to="link"
        >
          read more
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HomeTabContent",
  props: {
    header: {
      type: String,
      default: null
    },
    description: {
      type: String,
      default: null
    },
    image: {
      type: String,
      default: null
    },
    link: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped>

</style>
