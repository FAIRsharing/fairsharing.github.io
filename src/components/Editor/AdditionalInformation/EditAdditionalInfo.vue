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
        Edit Additional Information
      </v-card-title>

      <Alerts target="generalInformation" />
      
      <v-row
        v-for="(field, index) in allowedFields"
        :key="'selected_' + index"
      >
        <v-col
          cols="12"
          class="pa-6"
        >
          <!-- Dynamically loads components -->
          <component :is="componentMapping[field]" />
        </v-col>
      </v-row>     
      
      <v-card-text />
      <v-card-actions>
        <v-btn
          class="primary"
          :disabled="!formValid"
          :loading="loading"
          @click="saveRecord(false)"
        >
          Save and continue
        </v-btn>
        <v-btn
          :disabled="!formValid"
          :loading="loading"
          class="primary"
          @click="saveRecord(true)"
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
  </v-form>
</template>

<script>

import {mapGetters, mapState} from "vuex";
import Alerts from "@/components/Editor/Alerts";
import AccessPoints from "@/components/Editor/AdditionalInformation/AccessPoints";
import Loaders from "@/components/Navigation/Loaders";
import RestClient from "@/components/Client/RESTClient.js"

let restClient = new RestClient();

export default {
  name: "EditAdditionalInfo",
  components: { Alerts, AccessPoints, Loaders },
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
      //this.allowedFields = await this.getFieldNames();
      this.allowedFields = ['access_points'];
      //console.log(JSON.stringify(this.allowedFields));
      this.initialized = true;
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
