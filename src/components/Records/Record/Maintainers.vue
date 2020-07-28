<template>
  <v-card
    class="pa-4 mt-5 d-flex flex-column"
    outlined
    tile
    elevation="1"
  >
    <SectionTitle title="Maintainers" />
    <NoneFound :data-field="getField('maintainers')" />

    <!--Contact-->
    <v-card
      v-for="(maintainer, index) in getField('maintainers')"
      :key="maintainer.contact_name"
      class="pa-4 d-flex flex-column"
      :class="index===0?'mt-4':'mt-2'"
      flat
      outlined
    >
      <div class="d-flex mt-2 flex-wrap">
        <v-icon
          color="secondary"
          class="mr-2"
        >
          mdi-account-circle
        </v-icon>
        <b class="mr-2">User Name:</b>
        <a :href="maintainer.username + '/' + maintainer.id">
          {{ maintainer.username + '/' + maintainer.id }}
        </a>
      </div>
    </v-card>
  </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';

    import SectionTitle from '@/components/Records/Record/SectionTitle';
    import NoneFound from '@/components/Records/Record/NoneFound';

    export default {
        name: "Maintainers",
        components: {
          NoneFound,
          SectionTitle
        },
        computed: {
            ...mapGetters("record", ["getField"])
        }

    }
</script>

<style scoped lang="scss">
  a {
    text-decoration: none;

    &:hover, &:focus {
      text-decoration: underline;
      outline: 0;
    }
  }

</style>
