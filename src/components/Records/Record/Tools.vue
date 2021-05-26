<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    v-if="getField('metadata')['associated_tools']!==undefined && getField('metadata')['associated_tools']!==null"
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <!-- General Info -->
    <SectionTitle title="Tools" />
    <!--  container  -->
    <div class="d-flex flex-column ml-2 min-height-40">
      <v-card
        v-if="getField('metadata')['associated_tools']"
        class="pa-4 mt-15 d-flex flex-column"
        outlined
        color="white"
        tile
        elevation="3"
      >
        <Icon item="tools" />

        <v-card-title class="pa-0 text--primary card-title-customize">
          Tools associated with this record
        </v-card-title>
        <v-card-text class="ma-0 pt-8">
          <v-card
            v-for="(item,index) in getField('metadata')['associated_tools']"
            :key="item.name+'_'+index"
            class="pa-4 mt-2 d-flex flex-column v-card-hover"
            flat
            outlined
          >
            <a
              :href="item.url"
              target="_blank"
              class="underline-effect"
            >
              {{ item.name }}
            </a>
          </v-card>
        </v-card-text>
      </v-card>
    </div>
    <section />
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import SectionTitle from '@/components/Records/Record/SectionTitle'
import Icon from "@/components/Icon"

export default {
  name: "Tools",
  components: {
    SectionTitle,
    Icon
  },
  computed: {
    ...mapGetters("record", ["getField"]),
  }
}
</script>
