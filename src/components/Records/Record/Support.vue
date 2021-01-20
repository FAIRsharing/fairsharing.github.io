<template>
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    tile
    color="bg_record_card"
    elevation="3"
  >
    <SectionTitle title="Support" />
    <!-- SupportLinks -->
    <!-- TODO -->

    <!--Contact-->
    <NoneFound :data-field="getField('metadata')['contacts']" />
    <v-card
      v-for="(contact, index) in getField('metadata')['contacts']"
      :key="contact.contact_name"
      class="pa-4 d-flex flex-column"
      :class="index === 0 ? 'mt-4':'mt-2'"
      flat
      outlined
    >
      <div class="d-flex mt-2 flex-wrap">
        <v-icon
          color="secondary"
          class="mr-2"
        >
          fas fa-user
        </v-icon>
        <b class="mr-2">Contact Name:</b>
        <p class="ma-0">
          {{ contact.contact_name }}
        </p>
      </div>
      <div class="d-flex mt-2 flex-wrap">
        <v-icon
          color="secondary"
          class="mr-2"
        >
          fas fa-envelope
        </v-icon>
        <b class="mr-2">Contact Email:</b>
        <p class="ma-0">
          {{ contact.contact_email }}
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
        name: "Support",
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
