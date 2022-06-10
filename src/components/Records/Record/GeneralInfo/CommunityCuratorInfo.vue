<template>
  <div 
    v-if="getField('communityCurators').length > 0"
    class="d-flex flex-row flex-wrap align-center mt-4 min-height-40"
  >
    <b class="mr-2">The following community curators have contributed to this record: </b>
    <div
      v-for="(curator,index) in getField('communityCurators')"
      :key="curator.id"
      class="d-flex flex-wrap"
    >
      <div class="d-flex">
        <router-link
          v-if="curator"
          :class="[{'mr-1':curator.orcid},'underline-effect']"
          :to="`/users/${curator.id}`"
        >
          {{ curator.username }}
        </router-link>
        <a
          v-if="curator.orcid"
          class="mr-2"
          :href="`https://orcid.org/${curator.orcid}`"
          target="_blank"
        >
          <Icon
            :height="27"
            item="Orcid"
            wrapper-class=""
          />
        </a>
      </div>
      <span
        class="mr-1"
        style="margin-left: -6px;"
      >{{ index !== getField('communityCurators').length - 1 ? ',' : '' }}</span>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";

import Icon from "@/components/Icon";

export default {
  name: "CommunityCuratorInfo",
  components: {Icon},
  computed: {
    ...mapState("record", ["currentRecord"]),
    ...mapGetters("record", ["getField"])
  }
}
</script>
