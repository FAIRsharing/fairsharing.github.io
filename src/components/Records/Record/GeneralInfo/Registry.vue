<template>
  <div class="d-flex flex-row mt-4 align-center min-height-40">
    <span
      class="d-flex align-baseline width-15-percent-flex"
    >
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-icon
            class="mr-2"
            size="15"
            v-bind="props"
          >
            fas fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips['fairsharing_registry'] }}
      </v-tooltip>
      <b>Registry</b>
    </span>
    <p
      class="ma-0 full-width ml-md-12 ml-8"
      :class="{'text-end' : $vuetify.display.smAndDown}"
    >
      {{ $filters.capitalize(getField('registry')) }}
    </p>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
export default {
  name: "Registry",
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("editor", ["recordTooltips"]),
  }
}
</script>
