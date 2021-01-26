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
    <v-row>
      <v-col
        v-for="(field, index) in allowedFields"
        :key="'selected_' + index"
        class="col-3"
      >
        <component :is="componentMapping[field]" />
      </v-col>
    </v-row>
  </v-form>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import Alerts from "@/components/Editor/Alerts";
import AccessPoints from "@/components/Editor/AdditionalInformation/AccessPoints";
import RestClient from "@/components/Client/RESTClient.js"

let restClient = new RestClient();

export default {
  name: "EditAdditionalInfo",
  components: { Alerts, AccessPoints },
  data() {
    return {
      initialized: false,
      formValid: false,
      loading: true,
      allowedFields: [],
      componentMapping: {
        "access_points": "AccessPoints",
        "data_processes": "AccessPoints",
        "associated_tools": "AccessPoints"
      }
    }
  },
  computed: {
    ...mapGetters("record", ["getSection"]),
    ...mapState("users", ["user"]),
    fields() {
      return this.getSection("generalInformation").data
    }
  },
  mounted(){
    this.$nextTick(async () => {
      this.allowedFields = await this.getFieldNames();
      this.loading = false;
    });
  },
  methods: {
    async getFieldNames() {
      return restClient.extraMetadataFields(
          this.fields.type,
          this.user().credentials.token
      );
    },

  }
}
</script>

<style>
</style>
