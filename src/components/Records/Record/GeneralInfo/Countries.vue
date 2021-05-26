<template>
  <div class="d-flex flex-row mt-4 min-height-40">
    <b class="width-200">Countries developing this resource</b>
    <div class="d-flex full-width flex-wrap ml-md-12 ml-13">
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
      <div
        v-for="(country,index) in getField('countries')"
        :key="country.id"
      >
        <p
          v-if="country.name"
          class="ma-0 mr-2"
        >
          {{ ` ${country.name}${index!==getField('countries').length-1?',':''}` }}
        </p>
        <span
          v-else
          class="warning"
        >
          country code undefined!
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import NoneFound from "@/components/Records/Record/NoneFound";
import {mapGetters} from "vuex";

export default {
  name: "Countries",
  components: {NoneFound},
  computed: {
    ...mapGetters("record", ["getField"]),
  }
}
</script>
