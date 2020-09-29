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
        <p class="ma-0">
          This record is in need of a maintainer.
        </p>
        <p
          v-if="canClaim"
          class="ma-0"
        >
          If you are affiliated with this project,
        </p>
        <v-btn
          v-if="canClaim"
          id="requestOwnershipButton"
          class="warning"
          @click="requestOwnership()"
        >
          Claim it now!
        </v-btn>
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
    import { mapGetters, mapState } from 'vuex';

    import SectionTitle from '@/components/Records/Record/SectionTitle';
    import Client from '@/components/GraphClient/GraphClient.js';
    import RestClient from "@/components/Client/RESTClient.js";
    //import NoneFound from '@/components/Records/Record/NoneFound';

    const client = new RestClient();

    export default {
        name: "Maintainers",
        components: {
          //NoneFound,
          SectionTitle
        },
        data: () => {
            return {
                canClaim: true
            }
        },
        computed: {
            ...mapGetters("record", ["getField"]),
            ...mapState("record", ["currentRecord"]),
            ...mapState('users', ["user"]),
        },
        mounted() {
            this.$nextTick(async function () {
                this.client = new Client();
            })
        },
        methods: {
          /**
          * Method to create a maintenance_request; sets canClaim and (on fail) error.
          * @returns {undefined}
          * */
          async requestOwnership() {
            let _module = this;
            const recordID =  _module.currentRecord['fairsharingRecord'].id;
            const claim = await client.claimRecord(recordID, _module.user().credentials.token);
            if (claim.error) {
              _module.error = "Sorry, your request to claim this record failed. Please contact us.";
              _module.canClaim = false;
            }
            else {
              // show modal here
              _module.canClaim = false;
            }
          }
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
