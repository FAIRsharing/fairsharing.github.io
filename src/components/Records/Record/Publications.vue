<template>
  <v-card
    class="pa-4 mt-5 d-flex flex-column"
    outlined
    tile
    elevation="1"
  >
    <SectionTitle title="Publications" />
    <v-card
      v-if="!getField('publications').length"
      class="pr-2 pl-4 pt-1 pb-2 d-flex flex-column"
      :class="index === 0 ? 'mt-4':'mt-2'"
      flat
      outlined
    >
      <div class="d-flex mt-2 ">
        <p class="ma-0">
          None found.
        </p>
      </div>
    </v-card>
    <v-card
      v-for="(publication,index) in getField('publications')"
      :key="publication.title"
      class="pr-2 pl-4 pt-1 pb-2 d-flex flex-column"
      :class="index === 0 ? 'mt-4':'mt-2'"
      flat
      outlined
    >
      <div class="d-flex mt-2 ">
        <v-icon
          color="secondary"
          class="mr-2"
        >
          mdi-book-open
        </v-icon>
        <p class="ma-0">
          {{ publication.title }}
        </p>
      </div>
    </v-card>
  </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';

    import SectionTitle from '@/components/Records/Record/SectionTitle';

    export default {
        name: "Publications",
        components: {
            SectionTitle
        },
        computed: {
            ...mapGetters("record", ["getField"])
        }
    }
</script>

<style scoped>

</style>