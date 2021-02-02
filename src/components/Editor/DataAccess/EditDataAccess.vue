<template>
  <div>
    <v-card>
      <v-card-title class="grey lighten-4 blue--text">
        Edit Data Access
      </v-card-title>
      <v-card-text>
        <edit-licences />
        <v-divider />
        <edit-support-links />
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="primary"
        >
          Save and continue
        </v-btn>
        <v-btn
          class="primary"
        >
          Save and exit
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-fade-transition>
      <v-overlay
        v-if="!initialized"
        :absolute="false"
        opacity="0.8"
      >
        <loaders />
      </v-overlay>
    </v-fade-transition>
  </div>
</template>

<script>
    import { mapActions } from "vuex"
    import EditLicences from "./EditLicenceLinks";
    import EditSupportLinks from "./EditSupportLinks"
    import Loaders from "../../Navigation/Loaders";

    export default {
        name: "EditDataAccess",
        components: {
          Loaders,
          EditLicences,
          EditSupportLinks
        },
        data(){
          return {
            initialized: false,
          }
        },
        mounted() {
          this.$nextTick(async function () {
            await this.getLicences();
            this.initialized = true;
          });
        },
        methods: {
          ...mapActions('editor', ['getLicences']),
        }
    }
</script>

<style scoped>

</style>
