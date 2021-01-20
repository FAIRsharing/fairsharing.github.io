<template>
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    tile
    color="bg_record_card"
    elevation="3"
  >
    <SectionTitle title="Licences" />
    <NoneFound :data-field="getField('licences')" />
    <v-card
      v-for="(licence, index) in getField('licences')"
      :key="licence.name"
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
          fas fa-certificate
        </v-icon>
        <p class="ma-0">
          {{ licence.name }}
        </p>
      </div>
    </v-card>
  </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';

    import NoneFound from '@/components/Records/Record/NoneFound';
    import SectionTitle from '@/components/Records/Record/SectionTitle';

    export default {
        name: "Licences",
        components: {
            NoneFound,
            SectionTitle
        },
        computed: {
            ...mapGetters("record", ["getField"])
        }

    }
</script>

<style scoped>

</style>

