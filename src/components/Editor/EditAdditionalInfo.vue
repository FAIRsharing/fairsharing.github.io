<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-form
    id="editAdditionalInfo"
    ref="editAdditionalInfo"
    v-model="formValid"
  >
    <v-card
      v-if="initialized"
      class="delayed-transition"
    >
      <v-card-title class="grey lighten-4 blue--text">
        Edit General Information
      </v-card-title>

      <Alerts target="generalInformation" />
    </v-card>
    <v-card>
      <v-card-text>
        <v-container fluid>
          <p>Next, make some forms out of this...</p>
          <p>Fields: {{ allowedFields }}</p>
        </v-container>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>

import Alerts from "@/components/Editor/Alerts";
import RestClient from "@/components/Client/RESTClient.js"
import {mapGetters, mapState} from "vuex";

let restClient = new RestClient();

export default {
  name: "EditAdditionalInfo",
  components: { Alerts },
  data() {
    return {
      initialized: false,
      formValid: false,
      loading: true,
      allowedFields: []
    }
  },
  computed: {
    ...mapGetters("record", ["getSection"]),
    ...mapState('users', ['user']),
    fields() {
      return this.getSection("generalInformation").data
    }
  },
  mounted(){
    this.$nextTick(async () => {
      const _module = this;
      await this.getAllowedFields();

      // Fetch info. about the fields to be edited here.

      _module.loading = false;
    });
  },
  methods: {
    async getAllowedFields() {
      const _module = this;
      _module.allowedFields = await restClient.extraMetadataFields(
          _module.fields.type,
          _module.user().credentials.token
      );
    }
  }
}
</script>

<style>
</style>
