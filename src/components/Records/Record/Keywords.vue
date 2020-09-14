<template>
  <v-card
    class="pa-4 mt-3 mt-lg-2 d-flex flex-column"
    outlined
    tile
    elevation="1"
  >
    <SectionTitle title="keywords" />
    <!--
    <section>
      <div class="d-flex mt-4 flex-wrap">
        <b class="mr-2">Taxonomies:</b>
        <span
          v-if="!getField('taxonomies').length"
        >
          None.
        </span>
        <v-chip
          v-for="item in getField('taxonomies')"
          :key="item.label"
          class="mr-2 mb-2 "
          :color="colors['taxonomies']"
          :text-color="colors['taxonomies']"
          label
          outlined
        >
          <v-icon left>
            mdi-label
          </v-icon>
          {{ item.label }}
        </v-chip>
      </div>
      <div
        class="d-flex mt-2 flex-wrap"
      >
        <b class="mr-8">Domains:</b>
        <span
          v-if="!getField('domains').length"
        >
          None.
        </span>
        <v-chip
          v-for="item in getField('domains')"
          :key="item.label"
          class="mr-2 mb-2"
          :color="colors['domains']"
          :text-color="colors['domains']"
          label
          outlined
        >
          <v-icon left>
            mdi-label
          </v-icon>
          {{ item.label }}
        </v-chip>
      </div>
      <div
        class="d-flex mt-2 flex-wrap"
      >
        <b class="mr-8">Subjects:</b>
        <span
          v-if="!getField('subjects').length"
        >
          None.
        </span>
        <v-chip
          v-for="item in getField('subjects')"
          :key="item.label"
          class="mr-2 mb-2"
          :color="colors['subjects']"
          :text-color="colors['subjects']"
          label
          outlined
        >
          <v-icon left>
            mdi-label
          </v-icon>
          {{ item.label }}
        </v-chip>
      </div>
      <div
        class="d-flex mt-2 flex-wrap"
      >
        <b class="mr-6">User tags:</b>
        <span
          v-if="!getField('userDefinedTags').length"
        >
          None.
        </span>
        <v-chip
          v-for="item in getField('userDefinedTags')"
          :key="item.label"
          class="mr-2 mb-2"
          :color="colors['userDefinedTags']"
          :text-color="colors['userDefinedTags']"
          label
          outlined
        >
          <v-icon left>
            mdi-label
          </v-icon>
          {{ item.label }}
        </v-chip>
      </div>
    </section>
    -->
    <v-container fluid>
      <v-row
        v-for="(section, sectionIndex) in sections"
        :key="'keywordsSection_' + sectionIndex"
        class="d-flex flex-wrap"
      >
        <v-col
          cols="12"
          class="keywordLabel px-0 mx-0"
        >
          <b>{{ labels[section].filterLabel }}: </b>
          <span v-if="!getField(labels[section].filterName).length"> None. </span>
        </v-col>

        <v-chip
          v-for="item in getField(labels[section].filterName)"
          :key="item.label"
          class="mr-2 mt-1"
          :color="colors[labels[section].filterName]"
          :text-color="colors[labels[section].filterName]"
          label
          outlined
        >
          <v-icon left>
            mdi-label
          </v-icon>
          {{ item.label }}
        </v-chip>
        <v-col
          v-if="section !== 'user_defined_tags'"
          cols="12"
        >
          <v-divider class="mb-0 mt-4 py-0" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
    // TODO: Also needs user defined tags
    import { mapGetters } from 'vuex';
    import colorsObject from "@/data/colorOptions.json"
    import labelMapping from "@/components/Records/FiltersLabelMapping.json"

    import SectionTitle from '@/components/Records/Record/SectionTitle';

    export default {
        name: "Keywords",
        components: {
            SectionTitle
        },
        data(){
          return {
            colors: colorsObject.colors,
            labels: labelMapping.autocomplete,
            sections: [
              "taxonomies",
              "domains",
              "subjects",
              "user_defined_tags"
            ]
          }
        },
        computed: {
            ...mapGetters("record", ["getField"])
        }

    }
</script>

<style scoped>

</style>
