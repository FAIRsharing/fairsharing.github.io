<template>
  <div
    v-if="getField('homepage') === getField('metadata').reference_url"
    class="d-flex flex-row mt-4 align-center min-height-40"
  >
    <span
      class="d-flex align-baseline width-15-percent-flex"
    >
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-icon
            class="mr-2"
            size="15"
            v-on="on"
          >
            fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips['reference_url'][getField('type')] }}
      </v-tooltip>
      <b class="width-15-percent-flex">Reference URL</b>
    </span>
    <div class="d-flex full-width ml-md-12 ml-13">
      As above
    </div>
  </div>
  <div
    v-else-if="getField('metadata').reference_url"
    class="d-flex flex-row mt-4 align-center min-height-40"
  >
    <span
      class="d-flex align-baseline width-15-percent-flex"
    >
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-icon
            class="mr-2"
            size="15"
            v-on="on"
          >
            fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips['reference_url'][getField('type')] }}
      </v-tooltip>
      <b class="width-15-percent-flex">Reference URL</b>
    </span>
    <div class="d-flex full-width ml-md-12 ml-13">
      <a
        v-if="getField('metadata').reference_url"
        :href="getField('metadata').reference_url"
        target="_blank"
        class="underline-effect"
      >{{ getField('metadata').reference_url }}</a>
      <NoneFound
        v-else
        :string-field="getField('metadata').reference_url"
      />
    </div>
  </div>
  <div
    v-else
    class="d-flex flex-row mt-4 align-center min-height-40"
  >
    <span
      class="d-flex align-baseline width-15-percent-flex"
    >
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-icon
            class="mr-2"
            size="15"
            v-on="on"
          >
            fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips['reference_url'][getField('type')] }}
      </v-tooltip>
      <b class="width-15-percent-flex">Reference URL</b>
    </span>
    <div class="d-flex full-width ml-md-12 ml-13">
      N/A
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";

import NoneFound from "@/components/Records/Record/NoneFound";
export default {
  name: "ReferenceURL",
  components: {NoneFound},
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("editor", ["recordTooltips"]),
  }
}
</script>
