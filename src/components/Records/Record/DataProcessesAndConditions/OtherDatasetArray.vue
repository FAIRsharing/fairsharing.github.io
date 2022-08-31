<template>
  <div
    v-if="currentItem"
    class="pa-4 mt-4 data-holder d-flex flex-row align-content-start justify-start"
    :class="{'flex-column': $vuetify.breakpoint.xsOnly}"
  >
    <b class="full-width min-width-200 max-width-200 text-capitalize">{{ cleanString(title) }}</b>
    <!--  Name    -->
    <div
      v-if="currentItem.name"
      class="full-width min-width-200 max-width-200"
    >
      <a
        class="underline-effect"
        :href="currentItem.url"
        target="_blank"
      >{{ currentItem.name }}
      </a>
    </div>

    <!--  Type    -->
    <div
      v-if="currentItem.type"
      class="full-width min-width-200 max-width-200"
    >
      <a
        class="underline-effect"
        :href="currentItem.url"
        target="_blank"
      >{{ currentItem.type }}
      </a>
    </div>

    <!--  URLs    -->
    <div
      v-if="(currentItem.url && !currentItem.type && !currentItem.name)"
      class="full-width min-width-200 max-width-200"
    >
      <a
        class="underline-effect"
        :href="currentItem.url"
        target="_blank"
      >
        {{ currentItem.url }}
      </a>
    </div>

    <!--  Notes    -->
    <div
      v-if="currentItem.notes"
      class="full-width min-width-200 max-width-200"
    >
      {{ currentItem.notes }}
    </div>
  </div>
</template>

<script>
import stringUtils from '@/utils/stringUtils'

export default {
  name: "OtherDatasetArray",
  mixins: [stringUtils],
  props: {
    title: {default: null, type: String},
    currentItem: {default: () => {}, type: Object},
    currentKey: {default: null, type: String}
  },

}
</script>

<style scoped>

</style>