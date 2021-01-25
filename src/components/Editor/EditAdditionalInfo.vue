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

import {mapGetters, mapState} from "vuex";
import Alerts from "@/components/Editor/Alerts";
import RestClient from "@/components/Client/RESTClient.js"

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
      await this.getAllowedFields();
      this.loading = false;
    });
  },
  methods: {
    async getAllowedFields() {
      let fieldData =  await restClient.extraMetadataFields(
          this.fields.type,
          this.user().credentials.token
      );
      if (fieldData.error){
        this.errors.general = fieldData.error;
      }
      else {
        this.allowedFields = fieldData;
      }
      console.log("FD: " + JSON.stringify(fieldData));
    }
  }
}
</script>

<style>
</style>
