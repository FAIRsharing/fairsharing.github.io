<template>
  <v-card
    class="pa-4 mt-5 d-flex flex-column"
    outlined
    tile
    elevation="1"
  >
    <SectionTitle title="Maintainers" />

    <v-card
      v-if="getField('maintainers').length === 0"
      class="mt-2 pr-2 pl-4 pt-1 pb-2 d-flex flex-column"
      flat
      outlined
    >
      <div class="d-flex mt-2 ">
        <p class="ma-0 mr-2">
          This record is in need of a maintainer.
        </p>
        <p
          v-if="canClaim"
          class="ma-0 mr-2"
        >
          If you are affiliated with this project,
        </p>
        <a
          v-if="canClaim"
          @click="()=>{this.$emit('requestOwnership')}"
        >
          Claim it now!
        </a>
      </div>
    </v-card>
    <!--<NoneFound :data-field="getField('maintainers')" />-->

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
          fa fa-user-circle
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
    import { mapGetters} from 'vuex';

    import SectionTitle from '@/components/Records/Record/SectionTitle';


    export default {
        name: "Maintainers",
        components: {
          SectionTitle
        },
        props: {
            canClaim: {
                type: Boolean,
                default: true
            }
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
