<template>
  <div class="d-flex flex-row mt-4 min-height-40">
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
            fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips['countries'] }}
      </v-tooltip>
      <b>Countries developing this resource</b>
    </span>
    <div
      class="d-flex full-width flex-wrap ml-md-12 ml-13"
      :class="{'justify-end' : $vuetify.display.smAndDown}"
    >
      <NoneFound
        v-if="!getField('countries')"
        :data-field="getField('countries')"
      />
      <p
        v-else-if="!getField('countries').length"
        class="my-0"
      >
        None found
      </p>
      <router-link
        v-for="(country,index) in sortCountries()"
        :key="country.id"
        :to="`/search?countries=${country.name}`"
        class="underline-effect"
      >
        <p
          v-if="country.name"
          class="ma-0 mr-2"
        >
          {{ ` ${country.name}${index!==getField('countries').length-1?',':''}` }}
        </p>
        <span
          v-else
          class="bg-warning"
        >
          country code undefined!
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";

import NoneFound from "@/components/Records/Record/NoneFound";

export default {
  name: "Countries",
  components: {NoneFound},
  data:()=>{
    return {
      searchTerm: null,
    }
  },
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("editor", ["recordTooltips"])
  },
  methods: {
    sortCountries() {
      if (this.getField('countries').length === 0) {
        return this.getField('countries');
      }
      let countries = JSON.parse(JSON.stringify(this.getField('countries')));
      return countries.sort((a, b) => a.id - b.id);
    }
  }

}
</script>
